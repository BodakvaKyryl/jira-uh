import { requireAuth } from "@/lib/auth-utils";

import { ProjectIdClient } from "./client";

const ProjectIdPage = async () => {
  await requireAuth();

  return <ProjectIdClient />;
};

export default ProjectIdPage;
