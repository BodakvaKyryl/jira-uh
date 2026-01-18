import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useGetTask } from "../api/use-get-task";
import { UpdateTaskForm } from "./update-task-form";

interface UpdateTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const UpdateTaskFormWrapper = ({ onCancel, id }: UpdateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({ taskId: id });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const projectOptions = projects?.documents?.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="h-[714px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="text-muted-foreground size-4 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) return null;

  return (
    <UpdateTaskForm
      onCancelForm={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      initialValues={initialValues}
      isLoading={isLoading}
    />
  );
};
