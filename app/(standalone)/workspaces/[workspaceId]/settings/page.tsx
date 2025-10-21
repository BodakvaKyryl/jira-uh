import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth-utils";

import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";

interface WorkspaceIdSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspaceIdSettingsPage = async ({ params }: WorkspaceIdSettingsPageProps) => {
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
