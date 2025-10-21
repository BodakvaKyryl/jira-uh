import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { rpc } from "@/lib/rpc";

import { RequestTypeLogin, ResponseTypeLogin } from "./types";

export const useSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseTypeLogin, Error, RequestTypeLogin>({
    mutationFn: async ({ json }) => {
      const response = await rpc.auth.login({ json });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Signed in successfully!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to sign in. Please check your credentials.");
    },
  });

  return mutation;
};
