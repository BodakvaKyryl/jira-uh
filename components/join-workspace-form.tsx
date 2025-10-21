"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { useInviteCode } from "@/features/workspaces/hooks/use-invite-code";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { DottedSeparator } from "./dotted-separator";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface JoinWorkspaceFormProps {
  initialValues: { name: string };
}

export const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="px-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription className="">
          You&apos;ve been invited to join <strong>{initialValues.name}</strong> workspace.
        </CardDescription>
      </CardHeader>
      <DottedSeparator className="px-7" />
      <CardContent>
        <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
          <Button
            variant={"secondary"}
            type="button"
            size={"lg"}
            asChild
            disabled={isPending}
            className="w-full lg:w-fit">
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            variant={"default"}
            type="button"
            size={"lg"}
            onClick={onSubmit}
            disabled={isPending}
            className="w-full lg:w-fit">
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
