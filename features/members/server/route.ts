import { Hono } from "hono";
import { validator } from "hono/validator";
import { AppwriteException, Query } from "node-appwrite";
import { z } from "zod";

import { DATABASE_ID, MEMBERS_ID } from "@/config";

import { createAdminClient } from "@/lib/appwrite";
import { MiddlewareContext, sessionMiddleware } from "@/lib/session-middleware";

import { MemberRole } from "../types";
import { getMember } from "../utils";

const app = new Hono<MiddlewareContext>()
  .get(
    "/",
    sessionMiddleware,
    validator("query", (value) => {
      return z.object({ workspaceId: z.string() }).parse(value);
    }),
    async (c) => {
      try {
        const { users } = await createAdminClient();
        const databases = c.get("databases");
        const user = c.get("user");
        const { workspaceId } = c.req.valid("query");

        const performingMember = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!performingMember) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", workspaceId),
          Query.limit(100),
        ]);

        const populatedMembers = await Promise.all(
          members.documents.map(async (member) => {
            try {
              const appwriteUser = await users.get(member.userId);
              return {
                ...member,
                name: appwriteUser.name,
                email: appwriteUser.email,
              };
            } catch (userError) {
              console.warn(
                `Could not retrieve user details for userId: ${member.userId}`,
                userError
              );
              return {
                ...member,
                name: "[User Not Found]",
                email: "[Email Not Found]",
              };
            }
          })
        );

        return c.json({ data: { ...members, documents: populatedMembers } });
      } catch (error) {
        console.error("Error fetching members:", error);
        return c.json({ error: "Failed to fetch members", details: String(error) }, 500);
      }
    }
  )
  .delete(
    "/:memberId",
    sessionMiddleware,
    validator("query", (value) => {
      return z.object({ workspaceId: z.string() }).parse(value);
    }),
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");
        const { memberId } = c.req.param();
        const { workspaceId } = c.req.valid("query");

        // 1. Get the member document to be deleted
        const memberToDelete = await databases.getDocument(DATABASE_ID, MEMBERS_ID, memberId);

        if (memberToDelete.workspaceId !== workspaceId) {
          return c.json({ error: "Bad Request: Member does not belong to this workspace." }, 400);
        }

        // 2. Authorize the user performing the deletion
        const performingMember = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!performingMember) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        if (performingMember.$id !== memberId && performingMember.role !== MemberRole.ADMIN) {
          return c.json(
            {
              error: "Unauthorized: Only workspace admins can delete other members.",
            },
            401
          );
        }

        // 3. Prevent deleting the last admin
        if (memberToDelete.role === MemberRole.ADMIN) {
          const adminMembers = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
            Query.equal("workspaceId", workspaceId),
            Query.equal("role", MemberRole.ADMIN),
            Query.limit(2),
          ]);

          if (adminMembers.total === 1 && adminMembers.documents[0].$id === memberId) {
            return c.json(
              {
                error: "Forbidden: Cannot delete the last admin of the workspace.",
              },
              403
            );
          }
        }

        // 4. Perform the deletion
        await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

        return c.json({ data: { $id: memberToDelete.$id } });
      } catch (error) {
        console.error("Error deleting member:", error);
        if (error instanceof AppwriteException && error.code === 404) {
          return c.json({ error: "Member not found." }, 404);
        }
        return c.json({ error: "Failed to delete member", details: String(error) }, 500);
      }
    }
  )
  .patch(
    "/:memberId",
    sessionMiddleware,
    validator("json", (value) => {
      return z.object({ role: z.enum(MemberRole) }).parse(value);
    }),
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");
        const { memberId } = c.req.param();
        const { role: newRole } = c.req.valid("json");

        const memberToUpdate = await databases.getDocument(DATABASE_ID, MEMBERS_ID, memberId);

        const performingMember = await getMember({
          databases,
          workspaceId: memberToUpdate.workspaceId,
          userId: user.$id,
        });

        if (!performingMember || performingMember.role !== MemberRole.ADMIN) {
          return c.json(
            {
              error: "Unauthorized: Only workspace admins can change member roles.",
            },
            401
          );
        }

        if (
          memberToUpdate.role === MemberRole.ADMIN &&
          newRole !== MemberRole.ADMIN &&
          memberToUpdate.$id === performingMember.$id
        ) {
          const adminMembers = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
            Query.equal("workspaceId", memberToUpdate.workspaceId),
            Query.equal("role", MemberRole.ADMIN),
            Query.limit(2),
          ]);

          if (adminMembers.total === 1 && adminMembers.documents[0].$id === memberId) {
            return c.json(
              {
                error: "Forbidden: Cannot demote the last admin of the workspace.",
              },
              403
            );
          }
        }

        await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
          role: newRole,
        });

        return c.json({ data: { $id: memberToUpdate.$id, role: newRole } });
      } catch (error) {
        console.error("Error updating member role:", error);
        if (error instanceof AppwriteException && error.code === 404) {
          return c.json({ error: "Member not found." }, 404);
        }
        return c.json({ error: "Failed to update member role", details: String(error) }, 500);
      }
    }
  );

export default app;
