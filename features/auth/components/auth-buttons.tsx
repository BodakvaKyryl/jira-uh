import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

interface AuthButtonsProps {
  showSeparator?: boolean;
  separatorClassName?: string;
  disabled?: boolean;
  onGoogleClick?: () => void;
  onGithubClick?: () => void;
  className?: string;
}

export const AuthButtons = ({
  showSeparator = true,
  separatorClassName = "px-7",
  disabled = false,
  onGoogleClick,
  onGithubClick,
  className,
}: AuthButtonsProps) => {
  const handleGoogleLogin = () => {
    try {
      onGoogleClick?.();
      // Add toast for when social login is implemented
    } catch {
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleGithubLogin = () => {
    try {
      onGithubClick?.();
      // Add toast for when social login is implemented
    } catch {
      toast.error("GitHub login failed. Please try again.");
    }
  };

  return (
    <>
      {showSeparator && (
        <div className={separatorClassName}>
          <DottedSeparator />
        </div>
      )}
      <CardContent className={`flex flex-col gap-y-4 pb-0 ${className || ""}`}>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={disabled}
          onClick={handleGoogleLogin}
          type="button">
          <FcGoogle className="mr-2 size-5" aria-hidden="true" />
          Login with Google
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={disabled}
          onClick={handleGithubLogin}
          type="button">
          <FaGithub className="mr-2 size-5" aria-hidden="true" />
          Login with GitHub
        </Button>
      </CardContent>
    </>
  );
};
