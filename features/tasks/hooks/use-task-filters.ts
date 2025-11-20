import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { TaskStatus } from "@/features/tasks/types";

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)).withDefault(Object.values(TaskStatus)[0]),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
