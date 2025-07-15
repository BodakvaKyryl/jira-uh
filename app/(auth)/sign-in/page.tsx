import { SignInCard } from "@/features/auth/components/sign-in-card";
import { requireGuest } from "@/lib/auth-utils";

const SignInPage = async () => {
  await requireGuest();

  return <SignInCard />;
};

export default SignInPage;
