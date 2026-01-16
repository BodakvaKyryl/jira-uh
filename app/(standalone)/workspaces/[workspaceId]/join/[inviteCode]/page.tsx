import { requireAuth } from "@/lib/auth-utils";

import { WorkspaceIdJoinClient } from "./client";

const WorkspaceIdJoinPage = async () => {
  await requireAuth();

  return <WorkspaceIdJoinClient />;
};
export default WorkspaceIdJoinPage;
