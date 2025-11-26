import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";

import { Task, TaskStatus } from "../types";
import { KanbanColumnHeader } from "./kanban-column-header";

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TO_DO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TaskState = {
  [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
  data: Task[];
}

export const DataKanban = ({ data }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TO_DO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  return (
    <DragDropContext onDragEnd={(result) => {}}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div className="bg-muted mx-2 flex w-[200px] rounded-md p-1.5" key={board}>
              <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
