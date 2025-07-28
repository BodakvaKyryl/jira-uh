import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  requestTypeDeleteWorkspace,
  responseTypeDeleteWorkspace,
} from "./types";

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    responseTypeDeleteWorkspace,
    Error,
    requestTypeDeleteWorkspace
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace deleted!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete workspace.");
    },
  });

  return mutation;
};
