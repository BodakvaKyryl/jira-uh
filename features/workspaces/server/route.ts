import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { MiddlewareContext, sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { ID } from "node-appwrite";
import { createWorkspaceSchema } from "../schemas";

const app = new Hono<MiddlewareContext>().post(
  "/",
  validator("json", (value) => createWorkspaceSchema.parse(value)),
  sessionMiddleware,
  async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");
      const { name } = c.req.valid("json");

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
        }
      );

      return c.json({ data: workspace });
    } catch (error) {
      return c.json(
        { error: "Failed to create workspace", details: String(error) },
        500
      );
    }
  }
);

export default app;
