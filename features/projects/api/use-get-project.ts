import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

interface useGetProjectProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: useGetProjectProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      try {
        const response = await client.api.projects[":projectId"].$get({
          param: { projectId },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching project:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
