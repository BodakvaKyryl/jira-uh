import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { rpc } from "@/lib/rpc";

import { ResponseTypeLogin } from "./types";

export const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseTypeLogin, Error>({
    mutationFn: async () => {
      const response = await rpc.auth.logout();

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Signed out successfully!");
      router.refresh();
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Failed to sign out. Please try again.");
    },
  });

  return mutation;
};
