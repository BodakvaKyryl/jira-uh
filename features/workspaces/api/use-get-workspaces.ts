import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      try {
        const response = await client.api.workspaces.$get();

        if (!response.ok) {
          throw new Error("Failed to fetch workspaces");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
