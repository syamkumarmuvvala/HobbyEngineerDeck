"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isLivePost, statusLabel } from "@/lib/blog/live";
import type { SaveIntent } from "@/app/(mentor)/dashboard/blog/actions";
import type { PostStatus } from "@/lib/generated/prisma/client";

export function EditorToolbar({
  status,
  scheduledAt,
  savedLabel,
  pending,
  pendingIntent,
  postId,
  slug,
  onSave,
  onPublish,
  onSchedule,
  onUnpublish,
  onOpenSettings,
}: {
  status: PostStatus;
  scheduledAt: Date | string | null;
  savedLabel: string;
  pending: boolean;
  pendingIntent: SaveIntent | null;
  postId?: string;
  slug: string;
  onSave: () => void;
  onPublish: () => void;
  onSchedule: () => void;
  onUnpublish: () => void;
  onOpenSettings: () => void;
}) {
  const scheduled = scheduledAt ? new Date(scheduledAt) : null;
  const live = isLivePost(status, scheduled);
  const label = statusLabel(status, scheduled);

  return (
    <div className="border-border bg-background/95 sticky top-0 z-30 -mx-4 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="bg-muted rounded-full px-2.5 py-1 text-xs font-medium">{label}</span>
        <span className="text-muted-foreground text-xs">{savedLabel}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Button type="button" size="sm" variant="ghost" className="lg:hidden" onClick={onOpenSettings}>
          <Settings />
          Settings
        </Button>
        {postId ? (
          <Link
            href={`/dashboard/blog/${postId}/preview`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Preview
          </Link>
        ) : null}
        {live && slug ? (
          <Link
            href={`/blog/${slug}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            target="_blank"
          >
            View live
          </Link>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={pending && pendingIntent === "persist"}
          disabled={pending}
          onClick={onSave}
        >
          {pending && pendingIntent === "persist" ? "Saving…" : "Save"}
        </Button>
        {status !== "DRAFT" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            loading={pending && pendingIntent === "unpublish"}
            disabled={pending}
            onClick={onUnpublish}
          >
            {pending && pendingIntent === "unpublish" ? "Unpublishing…" : "Unpublish"}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={pending && pendingIntent === "schedule"}
          disabled={pending}
          onClick={onSchedule}
        >
          {pending && pendingIntent === "schedule" ? "Scheduling…" : "Schedule"}
        </Button>
        <Button
          type="button"
          size="sm"
          loading={pending && pendingIntent === "publish"}
          disabled={pending}
          onClick={onPublish}
        >
          {pending && pendingIntent === "publish" ? "Publishing…" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
