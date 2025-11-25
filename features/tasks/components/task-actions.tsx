import { Ellipsis, ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="p-[10px] font-medium" onClick={() => {}} disabled={false}>
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" /> Open Project
          </DropdownMenuItem>
          <DropdownMenuItem className="p-[10px] font-medium" onClick={() => {}} disabled={false}>
            <Ellipsis className="mr-2 size-4 stroke-2" /> Task Details
          </DropdownMenuItem>
          <DropdownMenuItem className="p-[10px] font-medium" onClick={() => {}} disabled={false}>
            <PencilIcon className="mr-2 size-4 stroke-2" /> Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-[10px] font-medium text-amber-700 focus:text-amber-700"
            onClick={() => {}}
            disabled={false}>
            <TrashIcon className="mr-2 size-4 stroke-2" /> Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
