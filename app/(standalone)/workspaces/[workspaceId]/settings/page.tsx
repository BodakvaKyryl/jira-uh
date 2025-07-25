import { getWorkspace } from "@/features/workspaces/actions";
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspaceIdSettingsPage = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  await requireAuth();

  const { workspaceId } = await params;
  const initialValues = await getWorkspace({ workspaceId });

  if (!initialValues) redirect(`/workspaces/${workspaceId}`);

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
