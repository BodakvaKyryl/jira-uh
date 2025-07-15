import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { requireGuest } from "@/lib/auth-utils";

const SignUpPage = async () => {
  await requireGuest();

  return <SignUpCard />;
};

export default SignUpPage;
