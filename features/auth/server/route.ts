import { Hono } from "hono";
import { validator } from "hono/validator";
import { signInFormSchema, signUpFormSchema } from "../schemas";

const app = new Hono()
  .post(
    "/login",
    validator("json", (value) => signInFormSchema.parse(value)),
    async (c) => {
      const { email, password } = c.req.valid("json");

      return c.json({ email, password });
    }
  )
  .post(
    "/register",
    validator("json", (value) => signUpFormSchema.parse(value)),
    async (c) => {
      const { name, email, password } = c.req.valid("json");

      return c.json({ name, email, password });
    }
  );

export default app;
