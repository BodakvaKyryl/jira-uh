import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RawResponseType = InferResponseType<(typeof client.api.projects)[":projectId"]["$patch"], 200>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseType = [RawResponseType] extends [never] ? any : RawResponseType;
type RequestType = InferRequestType<(typeof client.api.projects)[":projectId"]["$patch"]>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }: RequestType) => {
      const response = await client.api.projects[":projectId"]["$patch"]({ form, param });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      return (await response.json()) as ResponseType;
    },
    onSuccess: ({ data }) => {
      toast.success("Project updated!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update project.");
    },
  });

  return mutation;
};
