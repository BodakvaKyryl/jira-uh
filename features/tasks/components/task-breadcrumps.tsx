import { ChevronRightIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

import { useConfirm } from "@/hooks/use-confirm";

import { Button } from "@/components/ui/button";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useDeleteTask } from "../api/use-delete-task";
import { Task } from "../types";

interface TaskBreadcrumpsProps {
  project: Project;
  task: Task;
}

export const TaskBreadcrumps = ({ project, task }: TaskBreadcrumpsProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useDeleteTask();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task?",
    "This action cannot be undone.",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6 lg:size-8" />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-muted-foreground text-sm font-semibold transition hover:opacity-75 lg:text-lg">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="text-muted-foreground size-4 lg:size-5" />
      <p className="text-sm font-semibold lg:text-lg">{task.name}</p>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="ml-auto">
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};
