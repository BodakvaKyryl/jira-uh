import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { MiddlewareContext, sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { ID } from "node-appwrite";
import { createWorkspaceSchema } from "../schemas";

const app = new Hono<MiddlewareContext>().post(
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
        }
      );

      return c.json({ data: workspace });
    } catch (error) {
      console.error("Error creating workspace:", error);
      return c.json({ error: "Failed to create workspace" }, 500);
    }
  }
);

export default app;
