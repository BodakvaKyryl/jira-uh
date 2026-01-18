import z from "zod";

import { TaskStatus } from "@/features/tasks/types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  status: z.enum(TaskStatus),
  workspaceId: z.string().trim().min(1, "Workspace is required"),
  projectId: z.string().trim().min(1, "Project is required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "Assignee is required"),
  description: z.string().optional(),
});
