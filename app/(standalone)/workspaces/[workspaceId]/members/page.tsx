import { requireAuth } from "@/lib/auth-utils";

import { MembersList } from "@/features/auth/components/members-list";

const WorkspaceIdMembersPage = async () => {
  await requireAuth();

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMembersPage;
