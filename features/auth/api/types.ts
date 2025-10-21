import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

export type ResponseTypeLogin = InferResponseType<(typeof client.api.auth.login)["$post"]>;

export type RequestTypeLogin = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export type ResponseTypeRegister = InferResponseType<(typeof client.api.auth.register)["$post"]>;

export type RequestTypeRegister = InferRequestType<(typeof client.api.auth.register)["$post"]>;
