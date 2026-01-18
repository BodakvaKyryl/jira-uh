import { requireGuest } from "@/lib/auth-utils";

import { SignInCard } from "@/features/auth/components/sign-in-card";

export const dynamic = "force-dynamic";

const SignInPage = async () => {
  await requireGuest();

  return <SignInCard />;
};

export default SignInPage;
