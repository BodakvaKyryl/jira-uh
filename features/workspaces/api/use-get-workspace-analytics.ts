import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

interface useGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

export type WorkspcaceAnalyticsResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["analytics"]["$get"],
  200
>;

export const useGetWorkspaceAnalytics = ({ workspaceId }: useGetWorkspaceAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      try {
        const response = await client.api.workspaces[":workspaceId"]["analytics"].$get({
          param: { workspaceId },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch workspace analytics");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching workspace analytics:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
