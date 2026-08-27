"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { setPortal } from "@/lib/auth/portal-actions";
import type { Portal } from "@/lib/auth/portal";
import { cn } from "@/lib/utils";

export function PortalSwitcher({
  activePortal,
  className,
}: {
  activePortal: Portal;
  className?: string;
}) {
  const label = activePortal === "mentor" ? "Mentor" : "Learner";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "text-foreground/80 gap-1",
          className,
        )}
        aria-label="Switch portal"
      >
        {label}
        <ChevronDownIcon className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem onClick={() => setPortal("learner")}>
          Learner
          {activePortal === "learner" ? <CheckIcon className="ml-auto size-3.5" /> : null}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPortal("mentor")}>
          Mentor
          {activePortal === "mentor" ? <CheckIcon className="ml-auto size-3.5" /> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
