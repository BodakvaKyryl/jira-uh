import "server-only";

import { AUTH_COOKIE } from "@/features/auth/constants";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { Account, Client, Databases, Models, Storage } from "node-appwrite";

export type MiddlewareContext = {
  Variables: {
    account: Account;
    databases: Databases;
    storage: Storage;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware(async (c, next) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
      console.warn("No session cookie found.");
      return c.json({ error: "Unauthorized" }, 401);
    }

    client.setSession(session);

    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    const user = await account.get();

    c.set("account", account);
    c.set("databases", databases);
    c.set("storage", storage);
    c.set("user", user);

    await next();
  } catch (error) {
    console.error("Session middleware error:", error);
    return c.json(
      { error: "Authentication failed", details: String(error) },
      500
    );
  }
});
