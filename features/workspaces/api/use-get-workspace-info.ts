import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

interface useGetWorkspaceInfoProps {
  workspaceId: string;
}

export const useGetWorkspaceInfo = ({ workspaceId }: useGetWorkspaceInfoProps) => {
  const query = useQuery({
    queryKey: ["workspace-info", workspaceId],
    queryFn: async () => {
      try {
        const response = await client.api.workspaces[":workspaceId"]["info"].$get({
          param: { workspaceId },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch workspace info");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching workspace info:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
