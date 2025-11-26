import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

interface useGetTaskProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: useGetTaskProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      try {
        const response = await client.api.tasks[":taskId"].$get({ param: { taskId } });

        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching task:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
