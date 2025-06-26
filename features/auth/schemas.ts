import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email("Write your email!"),
  password: z.string().min(1, "Password is required!"),
});

export const signUpFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required!"),
  email: z.string().email("Write your email!"),
  password: z
    .string()
    .min(8, "Password is required!")
    .max(60, "Password is too long!"),
});
