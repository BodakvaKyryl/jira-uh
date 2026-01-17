import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";

import { uploadImageAndGetBase64 } from "@/lib/appwrite";
import { MiddlewareContext, sessionMiddleware } from "@/lib/session-middleware";

import { getMember } from "@/features/members/utils";
import { createProjectSchema, updateProjectSchema } from "@/features/projects/schemas";
import { Project } from "@/features/projects/types";
import { Task, TaskStatus } from "@/features/tasks/types";

const app = new Hono<MiddlewareContext>()
  .post(
    "/",
    sessionMiddleware,
    validator("form", (value) => createProjectSchema.parse(value)),
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        const { name, image, workspaceId } = c.req.valid("form");

        const member = await getMember({ databases, workspaceId, userId: user.$id });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        let uploadedImageUrl: string | undefined;

        if (image instanceof File) {
          try {
            uploadedImageUrl = await uploadImageAndGetBase64(storage, image);
          } catch (uploadError) {
            console.error("Error uploading image for new workspace:", uploadError);
            if (uploadError instanceof Error) {
              return c.json({ error: uploadError.message || "Failed to upload image" }, 400);
            }
            return c.json({ error: "Failed to upload image" }, 400);
          }
        }

        const project = await databases.createDocument(DATABASE_ID, PROJECTS_ID, ID.unique(), {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        });

        return c.json({ data: project }, 201);
      } catch (error) {
        console.error("Error creating workspace:", error);
        return c.json({ error: "Failed to create workspace", details: String(error) }, 500);
      }
    }
  )
  .get(
    "/",
    sessionMiddleware,
    validator("query", (value) =>
      z
        .object({
          workspaceId: z.string(),
        })
        .parse(value)
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({ databases, workspaceId, userId: user.$id });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$updatedAt"),
        Query.limit(100),
      ]);

      return c.json({ data: projects.documents }, 200);
    }
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");

      const { projectId } = c.req.param();

      const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      const member = await getMember({
        databases,
        workspaceId: project.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      return c.json({ data: project }, 200);
    } catch (error) {
      console.error("Error get project:", error);
      return c.json({ error: "Failed to get project", details: String(error) }, 500);
    }
  })
  .patch(
    "/:projectId",
    sessionMiddleware,
    validator("form", (value) => updateProjectSchema.parse(value)),
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        const { projectId } = c.req.param();
        const { name, image } = c.req.valid("form");

        const existingProject = await databases.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        );

        const member = await getMember({
          databases,
          workspaceId: existingProject.workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        let newImageUrl: string | null | undefined = undefined;

        if (image instanceof File) {
          try {
            newImageUrl = await uploadImageAndGetBase64(storage, image);
          } catch (uploadError) {
            console.error("Error uploading image for workspace update:", uploadError);
            const message =
              uploadError instanceof Error ? uploadError.message : String(uploadError);
            return c.json({ error: message || "Failed to upload image" }, 400);
          }
        } else if (typeof image === "string") {
          newImageUrl = image === "" ? null : image;
        }

        const updatePayload: { name?: string; imageUrl?: string | null } = {};

        if (name !== undefined) {
          updatePayload.name = name;
        }

        if (Object.prototype.hasOwnProperty.call(c.req.valid("form"), "image")) {
          updatePayload.imageUrl = newImageUrl;
        }

        const project = await databases.updateDocument(
          DATABASE_ID,
          PROJECTS_ID,
          projectId,
          updatePayload
        );

        return c.json({ data: project });
      } catch (error) {
        console.error("Error updating project:", error);
        return c.json({ error: "Failed to update project", details: String(error) }, 500);
      }
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId } = c.req.param();

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

      return c.json({ data: { $id: existingProject.$id } });
    } catch (error) {
      console.error("Error deleting project:", error);
      return c.json({ error: "Failed to delete project", details: String(error) }, 500);
    }
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId } = c.req.param();

      const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

      const member = await getMember({
        databases,
        workspaceId: project.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      const thisMonthTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.greaterThan("$createdAt", thisMonthStart.toISOString()),
        Query.lessThan("$createdAt", thisMonthEnd.toISOString()),
      ]);

      const lastMonthTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.greaterThan("$createdAt", lastMonthStart.toISOString()),
        Query.lessThan("$createdAt", lastMonthEnd.toISOString()),
      ]);

      const taskCount = thisMonthTasks.total;
      const taskDifference = taskCount - lastMonthTasks.total;

      const thisMonthAssignedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThan("$createdAt", thisMonthStart.toISOString()),
        Query.lessThan("$createdAt", thisMonthEnd.toISOString()),
      ]);

      const lastMonthAssignedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThan("$createdAt", lastMonthStart.toISOString()),
        Query.lessThan("$createdAt", lastMonthEnd.toISOString()),
      ]);

      const assignedTaskCount = thisMonthAssignedTasks.total;
      const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total;

      const thisMonthIncompletedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThan("$createdAt", thisMonthStart.toISOString()),
        Query.lessThan("$createdAt", thisMonthEnd.toISOString()),
      ]);

      const lastMonthIncompletedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThan("$createdAt", lastMonthStart.toISOString()),
        Query.lessThan("$createdAt", lastMonthEnd.toISOString()),
      ]);

      const incompletedTaskCount = thisMonthIncompletedTasks.total;
      const incompletedTaskDifference = incompletedTaskCount - lastMonthIncompletedTasks.total;

      const thisMonthCompletedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThan("$createdAt", thisMonthStart.toISOString()),
        Query.lessThan("$createdAt", thisMonthEnd.toISOString()),
      ]);

      const lastMonthCompletedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThan("$createdAt", lastMonthStart.toISOString()),
        Query.lessThan("$createdAt", lastMonthEnd.toISOString()),
      ]);

      const completedTaskCount = thisMonthCompletedTasks.total;
      const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks.total;

      const thisMonthOverdueTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThan("$createdAt", thisMonthStart.toISOString()),
        Query.lessThan("$createdAt", thisMonthEnd.toISOString()),
      ]);

      const lastMonthOverdueTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThan("$createdAt", lastMonthStart.toISOString()),
        Query.lessThan("$createdAt", lastMonthEnd.toISOString()),
      ]);

      const overdueTaskCount = thisMonthOverdueTasks.total;
      const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total;

      return c.json({
        data: {
          taskCount,
          taskDifference,
          assignedTaskCount,
          assignedTaskDifference,
          completedTaskCount,
          completedTaskDifference,
          incompletedTaskCount,
          incompletedTaskDifference,
          overdueTaskCount,
          overdueTaskDifference,
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return c.json({ error: "Failed to fetch analytics", details: String(error) }, 500);
    }
  });

export default app;
