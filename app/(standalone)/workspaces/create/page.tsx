import { requireAuth } from "@/lib/auth-utils";

import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

export const dynamic = "force-dynamic";

const WorkspaceCreatePage = async () => {
  await requireAuth();

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
