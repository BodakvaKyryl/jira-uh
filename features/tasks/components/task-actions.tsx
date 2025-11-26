import { Ellipsis, ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useConfirm } from "@/hooks/use-confirm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useDeleteTask } from "../api/use-delete-task";
import { UseUpdateTaskModal } from "../hooks/use-update-task-modal";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { open } = UseUpdateTaskModal();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This action cannot be undone.",
    "destructive"
  );

  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="p-[10px] font-medium" onClick={onOpenProject}>
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" /> Open Project
          </DropdownMenuItem>
          <DropdownMenuItem className="p-[10px] font-medium" onClick={onOpenTask}>
            <Ellipsis className="mr-2 size-4 stroke-2" /> Task Details
          </DropdownMenuItem>
          <DropdownMenuItem className="p-[10px] font-medium" onClick={() => open(id)}>
            <PencilIcon className="mr-2 size-4 stroke-2" /> Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-[10px] font-medium text-amber-700 focus:text-amber-700"
            onClick={onDelete}
            disabled={isPending}>
            <TrashIcon className="mr-2 size-4 stroke-2" /> Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
