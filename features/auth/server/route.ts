import { createAdminClient } from "@/lib/appwrite";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { validator } from "hono/validator";
import { ID } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";
import { signInFormSchema, signUpFormSchema } from "../schemas";

const cookieMaxAge = 60 * 60 * 24 * 30;
const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: false,
  secure: true,
  sameSite: "strict" as const,
  maxAge: cookieMaxAge,
};

const validateSignIn = validator("json", (value) =>
  signInFormSchema.parse(value)
);
const validateSignUp = validator("json", (value) =>
  signUpFormSchema.parse(value)
);

const app = new Hono()
  .post("/login", validateSignIn, async (c) => {
    const { email, password } = c.req.valid("json");
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, COOKIE_OPTIONS);

    return c.json({ success: true });
  })

  .post("/register", validateSignUp, async (c) => {
    try {
      const { name, email, password } = c.req.valid("json");
      const { account } = await createAdminClient();
      await account.create(ID.unique(), email, password, name);
      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, COOKIE_OPTIONS);

      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: (error as Error).message }, 400);
    }
  })

  .post("/logout", (c) => {
    deleteCookie(c, AUTH_COOKIE);

    return c.json({ success: true });
  });

export default app;
