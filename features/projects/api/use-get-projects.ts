import { useQuery } from "@tanstack/react-query";
import { Models } from "node-appwrite";

import { client } from "@/lib/rpc";

import { Project } from "@/features/projects/types";

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

interface useGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
  const query = useQuery<Models.DocumentList<Project>>({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      try {
        const response = await client.api.projects.$get({
          query: { workspaceId },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching projects:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
