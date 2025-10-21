import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      try {
        const response = await client.api.members.$get({
          query: { workspaceId },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching members:", error);
        throw error;
      }
    },
    enabled: !!workspaceId,
  });

  return query;
};
