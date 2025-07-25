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
