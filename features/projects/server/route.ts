import { Hono } from "hono";
import { validator } from "hono/validator";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import { DATABASE_ID, PROJECTS_ID } from "@/config";

import { uploadImageAndGetBase64 } from "@/lib/appwrite";
import { MiddlewareContext, sessionMiddleware } from "@/lib/session-middleware";

import { getMember } from "@/features/members/utils";
import { createProjectSchema } from "@/features/projects/schemas";

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
  );

export default app;
