import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

interface useGetTasksProps {
  workspaceId: string;
}

export const useGetTasks = ({ workspaceId }: useGetTasksProps) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      try {
        const response = await client.api.tasks.$get({
          query: { workspaceId },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
