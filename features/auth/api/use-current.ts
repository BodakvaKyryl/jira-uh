import { useQuery } from "@tanstack/react-query";
import { Models } from "node-appwrite";

import { client } from "@/lib/rpc";

type UserType = Models.User<Models.Preferences> | null;

type AppwriteException = {
  message: string;
  code: number;
  type: string;
};

export const useCurrent = () => {
  const query = useQuery<UserType, AppwriteException>({
    queryKey: ["current"],
    queryFn: async () => {
      try {
        const response = await client.api.auth.current.$get();

        if (!response.ok) {
          console.warn("Failed to fetch current user:", response.status, response.statusText);
          return null;
        }

        const { data } = await response.json();

        return data as UserType;
      } catch (error) {
        console.error("Error fetching current user:", error);
        throw error as AppwriteException;
      }
    },
  });

  return query;
};
