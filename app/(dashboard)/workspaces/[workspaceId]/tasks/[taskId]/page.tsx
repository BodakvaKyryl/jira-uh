import { requireAuth } from "@/lib/auth-utils";

import { TaskIdClient } from "./client";

const TaskIdPage = async () => {
  requireAuth();

  return <TaskIdClient />;
};

export default TaskIdPage;
