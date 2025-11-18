import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { requireAuth } from "@/lib/auth-utils";

import { Button } from "@/components/ui/button";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { getProject } from "@/features/projects/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

interface ProjectIdPageProps {
  params: {
    projectId: string;
  };
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  await requireAuth();

  const { projectId } = await params;
  const initialValues = await getProject({ projectId });

  if (!initialValues) throw new Error("Project not found");

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>

        <Button variant={"secondary"} size={"sm"} asChild>
          <Link
            href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}>
            <PencilIcon className="mr-2 size-4" />
            Edit Project
          </Link>
        </Button>
      </div>
      <TaskViewSwitcher />
    </div>
  );
};

export default ProjectIdPage;
