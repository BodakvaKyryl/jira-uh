import { Hono } from "hono";
import { validator } from "hono/validator";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";

import { createAdminClient } from "@/lib/appwrite";
import { MiddlewareContext, sessionMiddleware } from "@/lib/session-middleware";

import { Member } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { Project } from "@/features/projects/types";
import { createTaskSchema } from "@/features/tasks/schemas";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono<MiddlewareContext>()
  .get(
    "/",
    sessionMiddleware,
    validator("query", (value) =>
      z
        .object({
          workspaceId: z.string(),
          projectId: z.string().nullish(),
          assigneeId: z.string().nullish(),
          status: z.nativeEnum(TaskStatus).nullish(),
          search: z.string().nullish(),
          dueDate: z.string().nullish(),
        })
        .parse(value)
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { users } = await createAdminClient();

      const { workspaceId, projectId, assigneeId, status, search, dueDate } = c.req.valid("query");

      const member = await getMember({ databases, workspaceId, userId: user.$id });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
        ...(projectId ? [Query.equal("projectId", projectId)] : []),
        ...(status ? [Query.equal("status", status)] : []),
        ...(assigneeId ? [Query.equal("assigneeId", assigneeId)] : []),
        ...(search ? [Query.search("name", search)] : []),
        ...(dueDate ? [Query.equal("dueDate", dueDate)] : []),
      ];

      const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, query);

      const projectIds = [
        ...new Set(tasks.documents.map((task) => task.projectId).filter(Boolean)),
      ];

      const assigneeIds = [
        ...new Set(tasks.documents.map((task) => task.assigneeId).filter(Boolean)),
      ];

      const [projectsResponse, membersResponse] = await Promise.all([
        projectIds.length
          ? databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
              Query.contains("$id", projectIds),
            ])
          : Promise.resolve({ documents: [], total: 0 }),
        assigneeIds.length
          ? databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
              Query.contains("$id", assigneeIds),
            ])
          : Promise.resolve({ documents: [], total: 0 }),
      ]);

      const userIds = [
        ...new Set(membersResponse.documents.map((member) => member.userId).filter(Boolean)),
      ];
      const usersResponse = userIds.length
        ? await users.list([Query.contains("$id", userIds)])
        : { users: [], total: 0 };

      const populatedTasks = tasks.documents.map((task) => {
        const project = projectsResponse.documents.find((p) => p.$id === task.projectId);
        const member = membersResponse.documents.find((m) => m.$id === task.assigneeId);
        const assignee = member
          ? {
              ...member,
              ...usersResponse.users.find((u) => u.$id === member.userId),
            }
          : undefined;

        return { ...task, project, assignee };
      });

      return c.json({ data: { ...tasks, documents: populatedTasks } }, 200);
    }
  )
  .post(
    "/",
    sessionMiddleware,
    validator("json", (value) => createTaskSchema.parse(value)),
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");

        const { name, status, workspaceId, projectId, dueDate, assigneeId, description } =
          c.req.valid("json");

        const member = await getMember({ databases, workspaceId, userId: user.$id });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const POSITION_GAP = 1000;

        const highestPositionTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("position"),
          Query.limit(1),
        ]);

        const newPosition =
          highestPositionTask.documents.length > 0
            ? highestPositionTask.documents[0].position + POSITION_GAP
            : POSITION_GAP;

        const task = await databases.createDocument(DATABASE_ID, TASKS_ID, ID.unique(), {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
          ...(description && { description }),
        });

        return c.json({ data: task }, 201);
      } catch (error) {
        console.error("Error creating task:", error);
        return c.json({ error: "Failed to create task", details: String(error) }, 500);
      }
    }
  );

export default app;
