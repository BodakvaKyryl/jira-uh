import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { requireAuth } from "@/lib/auth-utils";

const WorkspaceCreatePage = async () => {
  await requireAuth();

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
