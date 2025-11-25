import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { TaskStatus } from "@/features/tasks/types";

const badgeVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent",
        destructive:
          "bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 border-transparent text-white",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        [TaskStatus.BACKLOG]:
          "border-purple-200 bg-purple-100 text-purple-800 hover:bg-purple-200/80 dark:bg-purple-900/40 dark:text-purple-100",
        [TaskStatus.TO_DO]:
          "border-rose-200 bg-rose-100 text-rose-800 hover:bg-rose-200/80 dark:bg-rose-900/40 dark:text-rose-100",
        [TaskStatus.IN_PROGRESS]:
          "border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-200/80 dark:bg-amber-900/40 dark:text-amber-100",
        [TaskStatus.IN_REVIEW]:
          "border-sky-200 bg-sky-100 text-sky-800 hover:bg-sky-200/80 dark:bg-sky-900/40 dark:text-sky-100",
        [TaskStatus.DONE]:
          "border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-200/80 dark:bg-emerald-900/40 dark:text-emerald-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
