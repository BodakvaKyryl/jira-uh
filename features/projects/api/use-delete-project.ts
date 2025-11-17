import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RawResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"],
  200
>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseType = [RawResponseType] extends [never] ? any : RawResponseType;
type RequestType = InferRequestType<(typeof client.api.projects)[":projectId"]["$delete"]>;

export const useDeleteProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }: RequestType) => {
      const response = await client.api.projects[":projectId"]["$delete"]({ param });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      return (await response.json()) as ResponseType;
    },
    onSuccess: ({ data }) => {
      toast.success("Project deleted!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete project.");
    },
  });

  return mutation;
};
