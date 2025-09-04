import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { requestTypeJoinWorkspace, responseTypeJoinWorkspace } from "./types";

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    responseTypeJoinWorkspace,
    Error,
    requestTypeJoinWorkspace
  >({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[":workspaceId"]["join"][
        "$post"
      ]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to join workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Joined workspace!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to join workspace.");
    },
  });

  return mutation;
};
