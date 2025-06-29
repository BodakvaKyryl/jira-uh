import { rpc } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { RequestTypeRegister, ResponseTypeRegister } from "./types";

export const useSignUp = () => {
  const mutation = useMutation<
    ResponseTypeRegister,
    Error,
    RequestTypeRegister
  >({
    mutationFn: async ({ json }) => {
      const response = await rpc.auth.register({ json });

      return await response.json();
    },
  });

  return mutation;
};
