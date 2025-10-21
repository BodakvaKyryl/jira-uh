import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

import { requestTypeCreateWorkspace, responseTypeCreateWorkspace } from "./types";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<responseTypeCreateWorkspace, Error, requestTypeCreateWorkspace>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces["$post"]({ form });

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace created!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Failed to create workspace.");
    },
  });

  return mutation;
};
