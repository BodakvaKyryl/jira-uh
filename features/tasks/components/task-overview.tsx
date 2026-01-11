import { PencilIcon } from "lucide-react";

import { snakeCaseToTitleCase } from "@/lib/utils";

import { DottedSeparator } from "@/components/dotted-separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { MemberAvatar } from "@/features/members/components/member-avatar";

import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import { Task } from "../types";
import { OverviewProperty } from "./overview-property";
import { TaskDate } from "./task-date";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useUpdateTaskModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button variant="secondary" size="sm" onClick={() => open(task.$id)}>
            <PencilIcon className="mr-2 size-4" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>{snakeCaseToTitleCase(task.status)}</Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
