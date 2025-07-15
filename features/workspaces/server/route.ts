import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { MemberRole } from "@/features/members/types";
import { MiddlewareContext, sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCodeWorkspace } from "@/lib/utils";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { ID, Query } from "node-appwrite";
import { createWorkspaceSchema } from "../schemas";

const app = new Hono<MiddlewareContext>()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    validator("form", (value) => createWorkspaceSchema.parse(value)),
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");
        const { name, image } = c.req.valid("form");
        let uploadedImageUrl: string | undefined;

        if (image instanceof File) {
          try {
            if (image.size > 1024 * 1024) {
              return c.json(
                { error: "Image file size must be less than 1MB" },
                400
              );
            }

            const file = await storage.createFile(
              IMAGES_BUCKET_ID,
              ID.unique(),
              image
            );

            const arrayBuffer = await storage.getFilePreview(
              IMAGES_BUCKET_ID,
              file.$id
            );

            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            return c.json({ error: "Failed to upload image" }, 500);
          }
        }

        const workspace = await databases.createDocument(
          DATABASE_ID,
          WORKSPACES_ID,
          ID.unique(),
          {
            name,
            userId: user.$id,
            imageUrl: uploadedImageUrl,
            inviteCode: generateInviteCodeWorkspace(8),
          }
        );

        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN,
        });

        return c.json({ data: workspace });
      } catch (error) {
        console.error("Error creating workspace:", error);
        return c.json({ error: "Failed to create workspace" }, 500);
      }
    }
  );

export default app;
