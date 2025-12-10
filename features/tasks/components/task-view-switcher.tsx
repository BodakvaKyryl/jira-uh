"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { Fragment, useCallback } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { DataFilters } from "@/features/tasks/components/data-filters";
import { UseCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { TaskStatus } from "../types";
import { columns } from "./columns";
import { DataKanban } from "./data-kanban";
import { DataTable } from "./data-table";

export const TaskViewSwitcher = () => {
  const [{ projectId, status, assigneeId, dueDate }] = useTaskFilters();

  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });
  const workspaceId = useWorkspaceId();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    status,
    assigneeId,
    dueDate,
  });

  const { open } = UseCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({
        json: { tasks },
      });
      console.log(tasks);
    },
    [bulkUpdate]
  );

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1 rounded-lg border">
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
          <TabsList className="w-full p-0 lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value={"table"}>
              Tasks
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value={"kanban"}>
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value={"calendar"}>
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button variant="default" size="sm" onClick={open} className="w-full lg:w-auto">
            <PlusIcon className="mr-2 size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="grounded-lg flex h-[200px] w-full flex-col items-center justify-center border">
            <Loader className="text-muted-foreground size-6 animate-spin" />
          </div>
        ) : (
          <Fragment>
            <TabsContent value={"table"} className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value={"kanban"} className="mt-0">
              <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChange} />
            </TabsContent>
            <TabsContent value={"calendar"} className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </Fragment>
        )}
      </div>
    </Tabs>
  );
};
