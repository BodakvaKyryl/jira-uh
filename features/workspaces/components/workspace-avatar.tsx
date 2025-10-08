import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({
  image,
  name,
  className,
}: WorkspaceAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn(
          "rounder-md relative size-10 overflow-hidden",
          className
        )}>
        <Image
          src={image}
          alt={""}
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="rounded-md bg-blue-600 text-lg font-semibold text-white uppercase">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
