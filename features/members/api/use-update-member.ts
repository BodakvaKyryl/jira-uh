import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type responseTypeDeleteMember = InferResponseType<
  (typeof client.api.members)[":memberId"]["$patch"],
  200
>;

type requestTypeDeleteMember = InferRequestType<
  (typeof client.api.members)[":memberId"]["$patch"]
>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    responseTypeDeleteMember,
    Error,
    requestTypeDeleteMember
  >({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[":memberId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to update member");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member updated!");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("Failed to update member.");
    },
  });

  return mutation;
};
