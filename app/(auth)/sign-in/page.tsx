import { getCurrentUser } from "@/features/auth/actions";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return <SignInCard />;
};

export default SignInPage;
