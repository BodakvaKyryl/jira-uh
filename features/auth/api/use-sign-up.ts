import { rpc } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RequestTypeRegister, ResponseTypeRegister } from "./types";

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseTypeRegister,
    Error,
    RequestTypeRegister
  >({
    mutationFn: async ({ json }) => {
      const response = await rpc.auth.register({ json });

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
  });

  return mutation;
};
