import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

export type responseTypeCreateWorkspace = InferResponseType<
  (typeof client.api.workspaces)["$post"]
>;

export type requestTypeCreateWorkspace = InferRequestType<
  (typeof client.api.workspaces)["$post"]
>;

export type responseTypeUpdateWorkspace = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>;

export type requestTypeUpdateWorkspace = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export type responseTypeDeleteWorkspace = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  200
>;

export type requestTypeDeleteWorkspace = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export type responseTypeResetInviteCode = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
  200
>;

export type requestTypeResetInviteCode = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>;

export type responseTypeJoinWorkspace = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"],
  200
>;

export type requestTypeJoinWorkspace = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>;
