import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

import { requestTypeUpdateWorkspace, responseTypeUpdateWorkspace } from "./types";

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<responseTypeUpdateWorkspace, Error, requestTypeUpdateWorkspace>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({
        form,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update workspace.");
    },
  });

  return mutation;
};
