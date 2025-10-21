import { Context, Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { validator } from "hono/validator";
import { ID } from "node-appwrite";
import { z } from "zod";

import { createAdminClient } from "@/lib/appwrite";
import { MiddlewareContext, sessionMiddleware } from "@/lib/session-middleware";

import { AUTH_COOKIE, COOKIE_OPTIONS } from "../constants";
import { signInFormSchema, signUpFormSchema } from "../schemas";

const validateSignIn = validator("json", (value) => signInFormSchema.parse(value));

const validateSignUp = validator("json", (value) => signUpFormSchema.parse(value));

const setAuthCookie = (c: Context, secret: string) => {
  setCookie(c, AUTH_COOKIE, secret, COOKIE_OPTIONS);
};

const createUserAndSession = async (name: string, email: string, password: string) => {
  const { account } = await createAdminClient();
  await account.create(ID.unique(), email, password, name);
  const session = await account.createEmailPasswordSession(email, password);
  return { session };
};

const app = new Hono<MiddlewareContext>()
  .get("/current", sessionMiddleware, async (c) => {
    try {
      const user = c.get("user");
      return c.json({ data: user });
    } catch (error) {
      console.error("Error fetching current user:", error);
      return c.json({ error: "Failed to fetch current user" }, 500);
    }
  })
  .post("/login", validateSignIn, async (c) => {
    try {
      const { email, password } = c.req.valid("json");
      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(email, password);

      setAuthCookie(c, session.secret);
      return c.json({ success: true });
    } catch (error) {
      console.error("Login error:", error);
      return c.json({ error: "Invalid credentials" }, 401);
    }
  })
  .post("/register", validateSignUp, async (c) => {
    try {
      const { name, email, password } = c.req.valid("json");
      const { session } = await createUserAndSession(name, email, password);

      setAuthCookie(c, session.secret);
      return c.json({ success: true });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return c.json({ error: "Validation error", details: error.errors }, 400);
      }
      return c.json({ error: "Registration failed" }, 500);
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    try {
      const account = c.get("account");
      deleteCookie(c, AUTH_COOKIE);
      await account.deleteSession("current");

      return c.json({ success: true });
    } catch (error) {
      console.error("Logout error:", error);
      return c.json({ error: "Logout failed" }, 500);
    }
  });

export default app;
