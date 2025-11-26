import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";

import { snakeCaseToTitleCase } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { UseCreateTaskModal } from "../hooks/use-create-task-modal";
import { TaskStatus } from "../types";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconsMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashedIcon className="size=[18px] text-purple-800" />,
  [TaskStatus.TO_DO]: <CircleIcon className="size=[18px] text-rose-800" />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon className="size=[18px] text-amber-800" />,
  [TaskStatus.IN_REVIEW]: <CircleDotIcon className="size=[18px] text-sky-800" />,
  [TaskStatus.DONE]: <CircleCheckIcon className="size=[18px] text-emerald-800" />,
};

export const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
  const statusIcon = statusIconsMap[board];
  const { open } = UseCreateTaskModal();

  return (
    <div className="flex w-full items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-x-2">
        {statusIcon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="flex size-5 items-center justify-center rounded-lg bg-neutral-200 text-xs font-medium text-neutral-700">
          {taskCount}
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={open} className="size-5 shrink-0">
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
