"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { WorkspaceAvatar } from "./workspace-avatar";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: workspaces } = useGetWorkspaces();

  const onSelectWorkspace = (selectId: string) => {
    router.push(`/workspaces/${selectId}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500 uppercase">Workspaces</p>
        <RiAddCircleFill className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75" />
      </div>
      <Select onValueChange={onSelectWorkspace} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 p-1 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  // image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
