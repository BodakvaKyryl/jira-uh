import { requireAuth } from "@/lib/auth-utils";

import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

const TasksPage = async () => {
  await requireAuth();

  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
