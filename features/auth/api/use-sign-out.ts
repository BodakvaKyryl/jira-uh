import { rpc } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResponseTypeLogin } from "./types";

export const useSignOut = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseTypeLogin, Error>({
    mutationFn: async () => {
      const response = await rpc.auth.logout();

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
  });

  return mutation;
};
