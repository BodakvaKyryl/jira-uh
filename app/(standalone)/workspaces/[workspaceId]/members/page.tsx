import { MembersList } from "@/features/auth/components/members-list";
import { requireAuth } from "@/lib/auth-utils";

const WorkspaceIdMembersPage = async () => {
  await requireAuth();

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMembersPage;
