import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { WorkspcaceAnalyticsResponseType } from "@/features/workspaces/api/use-get-workspace-analytics";

import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type AnalyticsData = ProjectAnalyticsResponseType["data"] | WorkspcaceAnalyticsResponseType["data"];

interface AnalyticsProps {
  data: AnalyticsData;
}

export const Analytics = ({ data }: AnalyticsProps) => {
  if (!data) return null;

  return (
    <ScrollArea className="w-full shrink-0 rounded-lg border whitespace-nowrap">
      <div className="flex w-full flex-row">
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Total tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
        </div>
        <DottedSeparator direction="vertical" />
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Assigned tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDifference}
          />
        </div>
        <DottedSeparator direction="vertical" />
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Completed tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDifference}
          />
        </div>
        <DottedSeparator direction="vertical" />
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Incomplete tasks"
            value={data.incompletedTaskCount}
            variant={data.incompletedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.incompletedTaskDifference}
          />
        </div>
        <DottedSeparator direction="vertical" />
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Overdue tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
