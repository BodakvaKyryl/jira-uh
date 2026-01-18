"use client";

import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";

import { MobileSidebar } from "./mobile-sidebar";

const DEFAULT_CONFIG = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

const ROUTE_CONFIG = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "My Project",
    description: "View tasks of your projects here",
  },
};

export const Navbar = () => {
  const pathname = usePathname();

  const activeKey = Object.keys(ROUTE_CONFIG).find((key) => pathname.includes(key)) as
    | keyof typeof ROUTE_CONFIG
    | undefined;

  const { title, description } = activeKey ? ROUTE_CONFIG[activeKey] : DEFAULT_CONFIG;

  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
