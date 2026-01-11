import { PencilIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateTask } from "../api/use-update-task";
import { Task } from "../types";

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string>(task.description ?? "");

  useEffect(() => {
    setValue(task.description ?? "");
  }, [task.description]);

  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    const json: { description: string } = { description: value ?? "" };

    mutate(
      { json, param: { taskId: task.$id } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button variant="outline" size="sm" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? <XIcon className="mr-2 size-4" /> : <PencilIcon className="sze-4 mr-2" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description"
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isPending}
            className="ml-auto w-fit">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div className="text-muted-foreground">
          {task.description || <span className="text-muted-foreground">No description set</span>}
        </div>
      )}
    </div>
  );
};
