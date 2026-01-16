import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

interface useGetWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspace = ({ workspaceId }: useGetWorkspaceProps) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      try {
        const response = await client.api.workspaces[":workspaceId"].$get({
          param: { workspaceId },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch workspace");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching workspace:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
