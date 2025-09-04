"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";
import { ImageUploadButton } from "./image-upload-button";

interface UpdateWorkspaceForms {
  onCancelForm?: () => void;
  initialValues: Workspace;
}

export const UpdateWorkspaceForm = ({
  onCancelForm,
  initialValues,
}: UpdateWorkspaceForms) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete this workspace?",
    "This action can't be undone.",
    "destructive"
  );

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite link for this workspace?",
    "This will invalidate the the current invite link",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [fullInviteLink, setFullInviteLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullInviteLink(
        `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`
      );
    }
  }, [initialValues.$id, initialValues.inviteCode]);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: { ...initialValues, image: initialValues.imageUrl ?? "" },
  });

  const onSubmitForm = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: (response) => {
          form.reset();
          if ("data" in response) {
            router.push(`/workspaces/${response.data.$id}`);
          }
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  const handleResetInviteLink = async () => {
    const acceptReset = await confirmReset();
    if (!acceptReset) return;
    resetInviteCode(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  const handleDeleteWorkspace = async () => {
    const acceptDelete = await confirmDelete();
    if (!acceptDelete) return;
    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  const isLoading = isPending || isDeletingWorkspace;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex justify-between px-7">
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
          <Button
            size={"sm"}
            variant={"secondary"}
            disabled={isLoading}
            onClick={
              onCancelForm
                ? onCancelForm
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }>
            <ArrowLeftIcon className="mr-2 size-4" />
            Back
          </Button>
        </CardHeader>
        <DottedSeparator className="px-7" />
        <CardContent className="px-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input
                          type="workspaceName"
                          placeholder="Enter workspace name"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative size-[72px] overflow-hidden rounded-md">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt={"workspace logo"}
                              className="object-cover"
                              fill
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace icon</p>
                          <p className="text-muted-foreground text-xs">
                            JPG, PNG, SVG or JPEG, max 1MB
                          </p>
                          <ImageUploadButton
                            hasImage={!!field.value}
                            isPending={isLoading}
                            onRemoveImage={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                            onUploadClick={() => inputRef.current?.click()}
                          />
                        </div>
                        <input
                          className="hidden"
                          type="file"
                          accept=".jpg, .png, .svg, .jpeg"
                          ref={inputRef}
                          disabled={isLoading}
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size={"lg"}
                  variant={"secondary"}
                  onClick={onCancelForm}
                  disabled={isLoading}
                  className={cn(!onCancelForm && "invisible")}>
                  Cancel
                </Button>
                <Button disabled={isLoading} size={"lg"}>
                  Update Workspace
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-x-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-muted-foreground text-sm">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex w-full items-center gap-x-2">
                <Input
                  readOnly
                  value={fullInviteLink}
                  aria-label="Invite link"
                />
                <Button
                  onClick={handleCopyInviteLink}
                  variant={"secondary"}
                  size={"lg"}
                  disabled={isLoading}
                  aria-label="Copy invite link">
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              variant={"destructive"}
              size={"lg"}
              type="button"
              disabled={isLoading || isResettingInviteCode}
              onClick={handleResetInviteLink}
              className="ml-auto w-fit">
              {isDeletingWorkspace ? "Reset..." : "Reset Invite Link"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-x-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-muted-foreground text-sm">
              Deleting a workspace is irreversible and will remove all
              associated data
            </p>
            <DottedSeparator className="py-7" />
            <Button
              variant={"destructive"}
              size={"lg"}
              type="button"
              disabled={isLoading}
              onClick={handleDeleteWorkspace}
              className="ml-auto w-fit">
              {isDeletingWorkspace ? "Deleting..." : "Delete Workspace"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
