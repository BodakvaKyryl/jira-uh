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
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { createWorkspaceSchema } from "../schemas";

interface CreateWorkspaceFormProps {
  onCancelForm: () => void;
}

export const CreateWorkspaceForm = ({
  onCancelForm,
}: CreateWorkspaceFormProps) => {
  const { mutate, isPending } = useCreateWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "" },
  });

  const onSubmitForm = (values: z.infer<typeof createWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: () => {
          form.reset();
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
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
      </CardHeader>
      <DottedSeparator className="px-7" />
      <CardContent className="p-7">
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
                        <Button
                          className="mt-2 w-fit"
                          type="button"
                          disabled={isPending}
                          variant={"teritary"}
                          size="sx"
                          onClick={() => inputRef.current?.click()}>
                          Upload Image
                        </Button>
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
                type="button"
                size={"lg"}
                variant={"secondary"}
                onClick={onCancelForm}>
                Cancel
              </Button>
              <Button disabled={isPending} size={"lg"}>
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
