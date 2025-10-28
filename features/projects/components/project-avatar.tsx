import Image from "next/image";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassname?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClassname,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div className={cn("relative size-5 overflow-hidden rounded-sm", className)}>
        <Image src={image} alt={""} width={40} height={40} className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-5 rounded-sm", className)}>
      <AvatarFallback
        className={cn(
          "rounded-sm bg-blue-600 text-sm font-semibold text-white uppercase",
          fallbackClassname
        )}>
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
