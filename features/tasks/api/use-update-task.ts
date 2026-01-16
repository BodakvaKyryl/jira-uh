import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.tasks)[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[":taskId"]["$patch"]>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (payload: RequestType) => {
      const hasJson = (payload as any).json !== undefined;
      const hasForm = (payload as any).form !== undefined;

      if (!hasJson && !hasForm) {
        throw new Error("Failed to update task: missing payload (provide either json or form)");
      }

      const opts: any = {};
      if ((payload as any).param) opts.param = (payload as any).param;
      if (hasJson) opts.json = (payload as any).json;
      if (hasForm) opts.form = (payload as any).form;

      const response = await client.api.tasks[":taskId"]["$patch"](opts);

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Failed to update task${text ? `: ${text}` : ""}`);
      }

      const data = (await response.json()) as ResponseType;

      return data;
    },
    onSuccess: ({ data }) => {
      toast.success("Task updated!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update task.");
    },
  });

  return mutation;
};
