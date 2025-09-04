import { JoinWorkspaceForm } from "@/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  await requireAuth();

  const { workspaceId } = await params;

  const initialValues = await getWorkspaceInfo({
    workspaceId,
  });

  if (!initialValues) {
    redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
};
export default WorkspaceIdJoinPage;
