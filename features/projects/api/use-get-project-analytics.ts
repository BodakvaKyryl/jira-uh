import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

interface useGetProjectAnalyticsProps {
  projectId: string;
}

export type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"],
  200
>;

export const useGetProjectAnalytics = ({ projectId }: useGetProjectAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      try {
        const response = await client.api.projects[":projectId"]["analytics"].$get({
          param: { projectId },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch project analytics");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching project analytics:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
