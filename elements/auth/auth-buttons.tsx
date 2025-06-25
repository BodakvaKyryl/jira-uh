import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const AuthButtons = () => {
  return (
    <>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col gap-y-4 pb-0">
        <Button variant="secondary" size="lg" className="w-full">
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
        <Button variant="secondary" size="lg" className="w-full">
          <FaGithub className="mr-2 size-5" />
          Login with GitHub
        </Button>
      </CardContent>
    </>
  );
};
