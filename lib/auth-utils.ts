import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
};

export const requireGuest = async () => {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return null;
};
