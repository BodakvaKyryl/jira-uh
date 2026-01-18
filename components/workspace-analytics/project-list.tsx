"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { UseCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface ProjectListProps {
  data: Project[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const workspaceId = useWorkspaceId();

  const { open: createProject } = UseCreateProjectModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="secondary" size="icon" onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspace/${workspaceId}/projects/${project.$id}`}>
                <Card className="hover:bg-muted/20 rounded-lg shadow-none transition hover:opacity-75">
                  <CardContent className="flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassname="text-lg"
                    />
                    <p className="truncate text-lg font-medium">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-muted-foreground hidden text-center text-sm first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};
