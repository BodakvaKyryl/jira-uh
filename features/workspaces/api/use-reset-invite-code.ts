import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

import { requestTypeResetInviteCode, responseTypeResetInviteCode } from "./types";

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<responseTypeResetInviteCode, Error, requestTypeResetInviteCode>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to reset invite code");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to reset invite code.");
    },
  });

  return mutation;
};
