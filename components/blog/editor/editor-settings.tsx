"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, toDatetimeLocalValue } from "@/lib/blog/utils";
import type { EditorRevision } from "@/components/blog/editor/types";

export function EditorSettingsFields({
  slug,
  excerpt,
  tags,
  scheduledLocal,
  revisions,
  restoringId,
  onSlug,
  onExcerpt,
  onTags,
  onScheduledLocal,
  onRestore,
}: {
  slug: string;
  excerpt: string;
  tags: string;
  scheduledLocal: string;
  revisions: EditorRevision[];
  restoringId: string | null;
  onSlug: (value: string) => void;
  onExcerpt: (value: string) => void;
  onTags: (value: string) => void;
  onScheduledLocal: (value: string) => void;
  onRestore: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={slug} onChange={(event) => onSlug(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          rows={4}
          value={excerpt}
          onChange={(event) => onExcerpt(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="firmware, 3d-print"
          value={tags}
          onChange={(event) => onTags(event.target.value)}
        />
        <p className="text-muted-foreground text-xs">Comma-separated.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="scheduledAt">Schedule for</Label>
        <Input
          id="scheduledAt"
          type="datetime-local"
          value={scheduledLocal}
          onChange={(event) => onScheduledLocal(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">History</p>
        {revisions.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            Explicit saves, publishes, and schedules keep a snapshot here.
          </p>
        ) : (
          <ul className="space-y-1">
            {revisions.map((revision) => (
              <li key={revision.id} className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-xs">
                  {formatDateTime(new Date(revision.createdAt))}
                </span>
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  disabled={restoringId === revision.id}
                  onClick={() => onRestore(revision.id)}
                >
                  Restore
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function defaultScheduleLocal(scheduledAt: Date | string | null) {
  if (scheduledAt) return toDatetimeLocalValue(new Date(scheduledAt));
  const next = new Date();
  next.setHours(next.getHours() + 1);
  next.setMinutes(0, 0, 0);
  return toDatetimeLocalValue(next);
}
