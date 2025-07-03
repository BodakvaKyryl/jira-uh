import { rpc } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to create account. Please try again.");
    },
  });

  return mutation;
};
