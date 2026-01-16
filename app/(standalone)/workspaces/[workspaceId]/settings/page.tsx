import { requireAuth } from "@/lib/auth-utils";

import { WorkspaceIdSettingsClient } from "./client";

const WorkspaceIdSettingsPage = async () => {
  await requireAuth();

  return <WorkspaceIdSettingsClient />;
};

export default WorkspaceIdSettingsPage;
