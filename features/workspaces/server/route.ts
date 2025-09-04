import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { uploadImageAndGetBase64 } from "@/lib/appwrite";
import { MiddlewareContext, sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCodeWorkspace } from "@/lib/utils";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { ID, Permission, Query, Role } from "node-appwrite";
import { z } from "zod";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";

const app = new Hono<MiddlewareContext>()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
      Query.limit(5000),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspaceIds),
        Query.limit(5000),
      ]
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
            uploadedImageUrl = await uploadImageAndGetBase64(storage, image);
          } catch (uploadError: any) {
            console.error(
              "Error uploading image for new workspace:",
              uploadError
            );
            return c.json(
              { error: uploadError.message || "Failed to upload image" },
              400
            );
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
          },

          [
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
          ]
        );

        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN,
        });

        return c.json({ data: { $id: workspace.$id } });
      } catch (error) {
        console.error("Error creating workspace:", error);
        return c.json(
          { error: "Failed to create workspace", details: String(error) },
          500
        );
      }
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    validator("form", (value) => updateWorkspaceSchema.parse(value)),
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        const { workspaceId } = c.req.param();
        const { name, image } = c.req.valid("form");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        let newImageUrl: string | null | undefined = undefined;

        if (image instanceof File) {
          try {
            newImageUrl = await uploadImageAndGetBase64(storage, image);
          } catch (uploadError: any) {
            console.error(
              "Error uploading image for workspace update:",
              uploadError
            );
            return c.json(
              { error: uploadError.message || "Failed to upload image" },
              400
            );
          }
        } else if (typeof image === "string") {
          newImageUrl = image === "" ? null : image;
        }

        const updatePayload: { name?: string; imageUrl?: string | null } = {};

        if (name !== undefined) {
          updatePayload.name = name;
        }

        if (
          Object.prototype.hasOwnProperty.call(c.req.valid("form"), "image")
        ) {
          updatePayload.imageUrl = newImageUrl;
        }

        const workspace = await databases.updateDocument(
          DATABASE_ID,
          WORKSPACES_ID,
          workspaceId,
          updatePayload
        );

        return c.json({ data: workspace });
      } catch (error) {
        console.error("Error updating workspace:", error);
        return c.json(
          { error: "Failed to update workspace", details: String(error) },
          500
        );
      }
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

      return c.json({ data: { $id: workspaceId } });
    } catch (error) {
      console.error("Error deleting workspace:", error);
      return c.json(
        { error: "Failed to delete workspace", details: String(error) },
        500
      );
    }
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          inviteCode: generateInviteCodeWorkspace(8),
        }
      );

      return c.json({ data: workspace });
    } catch (error) {
      console.error("Error resetting invite code:", error);
      return c.json(
        { error: "Failed to reset invite code", details: String(error) },
        500
      );
    }
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    validator("json", (value) => z.object({ code: z.string() }).parse(value)),
    async (c) => {
      try {
        const { workspaceId } = c.req.param();
        const { code } = c.req.valid("json");
        const databases = c.get("databases");
        const user = c.get("user");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (member) {
          return c.json({ error: "User already a member" }, 400);
        }

        const workspace = await databases.getDocument<Workspace>(
          DATABASE_ID,
          WORKSPACES_ID,
          workspaceId
        );

        if (workspace.inviteCode !== code) {
          return c.json({ error: "Invalid invite code" }, 400);
        }

        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          workspaceId,
          userId: user.$id,
          role: MemberRole.MEMBER,
        });

        return c.json({ data: workspace });
      } catch (error) {
        console.error("Error joining workspace:", error);
        const appwriteError: any = error;
        if (appwriteError.code === 404) {
          return c.json({ error: "Workspace not found" }, 404);
        }
        return c.json(
          { error: "Failed to join workspace", details: String(error) },
          500
        );
      }
    }
  );

export default app;
