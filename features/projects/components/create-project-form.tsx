"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { cn } from "@/lib/utils";

import { DottedSeparator } from "@/components/dotted-separator";
import { ImageUploadButton } from "@/components/image-upload-button";
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

import { useCreateProject } from "@/features/projects/api/use-create-project";
import { createProjectSchema } from "@/features/projects/schemas";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface CreateProjectFormProps {
  onCancelForm?: () => void;
}

export const CreateProjectForm = ({ onCancelForm }: CreateProjectFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateProject();
  const inputRef = useRef<HTMLInputElement>(null);

  type CreateProject = z.infer<typeof createProjectSchema>;
  type FormValues = Omit<CreateProject, "workspaceId">;

  const form = useForm<FormValues>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: { name: "", image: undefined },
  });
  const onSubmitForm = (values: FormValues) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          if (data) {
            router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
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

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex px-7">
        <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
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
                    <FormLabel className="text-sm">Project name</FormLabel>
                    <FormControl>
                      <Input type="projectName" placeholder="Enter project name" {...field} />
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
                            alt={"project logo"}
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
                        <p className="text-sm">Project icon</p>
                        <p className="text-muted-foreground text-xs">
                          JPG, PNG, SVG or JPEG, max 1MB
                        </p>
                        <ImageUploadButton
                          hasImage={!!field.value}
                          isPending={isPending}
                          onRemoveImage={() => {
                            field.onChange(undefined);
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
                        disabled={isPending}
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
                variant="secondary"
                size="lg"
                onClick={onCancelForm}
                className={cn(!onCancelForm && "invisible")}
                type="button">
                Cancel
              </Button>
              <Button size="lg" disabled={isPending}>
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
