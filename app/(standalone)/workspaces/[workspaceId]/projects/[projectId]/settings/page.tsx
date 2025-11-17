import { requireAuth } from "@/lib/auth-utils";

import { UpdateProjectForm } from "@/features/projects/components/update-project-form";
import { getProject } from "@/features/projects/queries";

interface ProjectIdSettingsPageProps {
  params: {
    projectId: string;
  };
}

const ProjectIdSettingsPage = async ({ params }: ProjectIdSettingsPageProps) => {
  await requireAuth();

  const { projectId } = await params;

  const initialValues = await getProject({ projectId });

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateProjectForm initialValues={initialValues} />
    </div>
  );
};

export default ProjectIdSettingsPage;
