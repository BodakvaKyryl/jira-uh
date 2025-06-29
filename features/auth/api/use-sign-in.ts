import { rpc } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { RequestTypeLogin, ResponseTypeLogin } from "./types";

export const useSignIn = () => {
  const mutation = useMutation<ResponseTypeLogin, Error, RequestTypeLogin>({
    mutationFn: async ({ json }) => {
      const response = await rpc.auth.login({ json });

      return await response.json();
    },
  });

  return mutation;
};
