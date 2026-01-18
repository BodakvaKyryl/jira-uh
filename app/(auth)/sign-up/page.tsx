import { requireGuest } from "@/lib/auth-utils";

import { SignUpCard } from "@/features/auth/components/sign-up-card";

export const dynamic = "force-dynamic";

const SignUpPage = async () => {
  await requireGuest();

  return <SignUpCard />;
};

export default SignUpPage;
