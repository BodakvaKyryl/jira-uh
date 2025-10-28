"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-3">
      <AlertTriangle className="text-muted-foreground size-6" />
      <p className="text-muted-foreground text-sm">Something went wrong...</p>
      <Button variant={"secondary"} size={"sm"}>
        <Link href={"/"}>Back to Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
