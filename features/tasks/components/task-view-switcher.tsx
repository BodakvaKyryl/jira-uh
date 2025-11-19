"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { PlusIcon } from "lucide-react";
import { Fragment } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UseCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";

export const TaskViewSwitcher = () => {
  const { open } = UseCreateTaskModal();

  return (
    <Tabs className="w-full flex-1 rounded-lg border">
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
          <TabsList className="w-full p-0 lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value={"table"}>
              Table
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
        <div>Data filters</div>
        <DottedSeparator className="my-4" />
        <Fragment>
          <TabsContent value={"table"} className="mt-0">
            Table View Content
          </TabsContent>
          <TabsContent value={"kanban"} className="mt-0">
            Kanban View Content
          </TabsContent>
          <TabsContent value={"calendar"} className="mt-0">
            Calendar View Content
          </TabsContent>
        </Fragment>
      </div>
    </Tabs>
  );
};
