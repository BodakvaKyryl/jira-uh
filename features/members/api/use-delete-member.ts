import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type responseTypeDeleteMember = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;

type requestTypeDeleteMember = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

interface UseDeleteMemberProps {
  workspaceId: string;
}

export const useDeleteMember = ({ workspaceId }: UseDeleteMemberProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    responseTypeDeleteMember,
    Error,
    requestTypeDeleteMember
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["$delete"]({
        param,
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member deleted!");
      queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete member.");
    },
  });

  return mutation;
};
