import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { DottedSeparator } from "../dotted-separator";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface MemberListProps {
  data: Member[];
  total: number;
}

export const MemberList = ({ data, total }: MemberListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="hover:bg-muted/20 overflow-hidden rounded-lg shadow-none">
                <CardContent className="flex flex-col items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-12" />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="line-clamp-1 truncate text-lg font-medium">{member.name}</p>
                    <p className="text-muted-foreground truncate text-sm font-medium">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-muted-foreground hidden text-center text-sm first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};
