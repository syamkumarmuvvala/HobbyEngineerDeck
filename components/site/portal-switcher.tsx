"use client";

import { useTransition } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { buttonVariants } from "@/components/ui/button";
import { setPortal } from "@/lib/auth/portal-actions";
import type { Portal } from "@/lib/auth/portal-cookie";
import { cn } from "@/lib/utils";

export function PortalSwitcher({
  activePortal,
  className,
}: {
  activePortal: Portal;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const label = activePortal === "mentor" ? "Mentor" : "Learner";

  function switchPortal(portal: Portal) {
    if (portal === activePortal || pending) return;
    startTransition(() => {
      void setPortal(portal);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={pending}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "text-foreground/80 gap-1",
          className,
        )}
        aria-label="Switch portal"
        aria-busy={pending || undefined}
      >
        {pending ? <Spinner className="size-3.5" /> : null}
        {label}
        <ChevronDownIcon className="size-4 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem disabled={pending} onClick={() => switchPortal("learner")}>
          Learner
          {activePortal === "learner" ? <CheckIcon className="ml-auto size-3.5" /> : null}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={pending} onClick={() => switchPortal("mentor")}>
          Mentor
          {activePortal === "mentor" ? <CheckIcon className="ml-auto size-3.5" /> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
