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
import { Task, TaskStatus } from "@/features/tasks/types";

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
          status: z.enum(TaskStatus).nullish(),
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

      const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);

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
  .get("/:taskId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const currentUser = c.get("user");

    const { users } = await createAdminClient();

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) return c.json({ error: "Unauthorized" }, 401);

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, task.projectId);

    const member = await databases.getDocument<Member>(DATABASE_ID, MEMBERS_ID, task.assigneeId);

    const user = await users.get(member.userId);

    const assignee = { ...member, name: user.name, email: user.email };

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
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
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    validator("json", (value) => createTaskSchema.partial().parse(value)),
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");

        const payload = c.req.valid("json");
        const { name, status, projectId, dueDate, assigneeId, description } = payload;

        const taskId = c.req.param("taskId");

        const existingTask = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

        const member = await getMember({
          databases,
          workspaceId: existingTask.workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Build update object including only fields that were provided in the request.
        // Important: include description even if it's an empty string (to allow clearing).
        const updatePayload: Record<string, unknown> = {};
        if (typeof name !== "undefined") updatePayload.name = name;
        if (typeof status !== "undefined") updatePayload.status = status;
        if (typeof projectId !== "undefined") updatePayload.projectId = projectId;
        if (typeof dueDate !== "undefined") updatePayload.dueDate = dueDate;
        if (typeof assigneeId !== "undefined") updatePayload.assigneeId = assigneeId;
        if (typeof description !== "undefined") updatePayload.description = description;

        if (Object.keys(updatePayload).length === 0) {
          return c.json({ error: "No fields provided to update" }, 400);
        }

        try {
          const task = await databases.updateDocument(DATABASE_ID, TASKS_ID, taskId, updatePayload);
          return c.json({ data: task }, 200);
        } catch (appwriteError) {
          return c.json(
            {
              error: "Failed to update task (Appwrite error).",
              details: String(appwriteError),
            },
            500
          );
        }
      } catch (error) {
        console.error("Error updating task:", error);
        return c.json({ error: "Failed to update task", details: String(error) }, 500);
      }
    }
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

    const member = await getMember({ databases, workspaceId: task.workspaceId, userId: user.$id });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({ data: { $id: task.$id } });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    validator("json", (value) =>
      z
        .object({
          tasks: z.array(
            z.object({
              $id: z.string(),
              status: z.enum(TaskStatus),
              position: z.number().int().positive().min(1000).max(1_000_000),
            })
          ),
        })
        .parse(value)
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { tasks } = c.req.valid("json");

      const tasksToUpdate = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.contains(
          "$id",
          tasks.map((task) => task.$id)
        ),
      ]);

      const workspaceIds = new Set(tasksToUpdate.documents.map((task) => task.workspaceId));

      if (workspaceIds.size !== 1) {
        return c.json({ error: "All tasks must belong to the same workspace" }, 400);
      }

      const workspaceId = workspaceIds.values().next().value;

      if (!workspaceId) {
        return c.json({ error: "Workspace ID not found" }, 400);
      }

      const member = await getMember({ databases, workspaceId, userId: user.$id });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, status, position } = task;
          return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, { status, position });
        })
      );

      return c.json({ data: updatedTasks });
    }
  );

export default app;
