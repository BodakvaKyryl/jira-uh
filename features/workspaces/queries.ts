"use server";

import { Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

import { createSessionClient } from "@/lib/appwrite";

import { getMember } from "../members/utils";
import { Workspace } from "./types";

interface getWorkspaceProps {
  workspaceId: string;
}

interface getWorkspaceInfoProps {
  workspaceId: string;
}

export const getWorkspaces = async () => {
  const emptyState = { documents: [], total: 0 };
  const { databases, account } = await createSessionClient();

  const user = await account.get();

  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", user.$id),
  ]);

  if (members.total === 0) {
    return emptyState;
  }

  const workspaceIds = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
    Query.orderDesc("$createdAt"),
    Query.contains("$id", workspaceIds),
  ]);

  return workspaces;
};

export const getWorkspace = async ({ workspaceId }: getWorkspaceProps) => {
  const { databases, account } = await createSessionClient();

  const user = await account.get();

  const member = await getMember({
    databases,
    workspaceId,
    userId: user.$id,
  });

  if (!member) throw new Error("Unauthorized");

  const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

  return workspace;
};

export const getWorkspaceInfo = async ({ workspaceId }: getWorkspaceInfoProps) => {
  const { databases } = await createSessionClient();

  const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

  return { name: workspace.name };
};
