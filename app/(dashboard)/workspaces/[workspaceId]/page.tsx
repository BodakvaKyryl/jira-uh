import { requireAuth } from "@/lib/auth-utils";

const WorkspaceIdPage = async () => {
  await requireAuth();

  return <div>WorkspaceIdPage</div>;
};

export default WorkspaceIdPage;
