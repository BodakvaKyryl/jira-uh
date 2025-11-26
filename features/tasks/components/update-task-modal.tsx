"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { UseUpdateTaskModal } from "@/features/tasks/hooks/use-update-task-modal";

import { UpdateTaskFormWrapper } from "./update-task-form-wrapper";

export const UpdateTaskModal = () => {
  const { taskId, close } = UseUpdateTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <UpdateTaskFormWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
};
