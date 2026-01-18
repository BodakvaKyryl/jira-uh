import { requireAuth } from "@/lib/auth-utils";

import { WorkspaceIdClient } from "./client";

const WorkspaceIdPage = async () => {
  await requireAuth();

  return <WorkspaceIdClient />;
};

export default WorkspaceIdPage;
