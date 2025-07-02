import { rpc } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RequestTypeLogin, ResponseTypeLogin } from "./types";

export const useSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseTypeLogin, Error, RequestTypeLogin>({
    mutationFn: async ({ json }) => {
      const response = await rpc.auth.login({ json });

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
  });

  return mutation;
};
