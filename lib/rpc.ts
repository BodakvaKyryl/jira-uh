import { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

export const rpc = {
  auth: {
    login: client.api.auth.login["$post"],
    register: client.api.auth.register["$post"],
    logout: client.api.auth.logout["$post"],
  },
};
