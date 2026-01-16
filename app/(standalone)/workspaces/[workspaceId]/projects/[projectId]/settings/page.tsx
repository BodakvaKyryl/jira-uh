import { requireAuth } from "@/lib/auth-utils";

import { ProjectIdSettingsClient } from "./client";

const ProjectIdSettingsPage = async () => {
  await requireAuth();

  return <ProjectIdSettingsClient />;
};

export default ProjectIdSettingsPage;
