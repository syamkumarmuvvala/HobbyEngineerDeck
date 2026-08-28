import type { Prisma } from "@/lib/generated/prisma/client";

export function livePostWhere(now = new Date()): Prisma.BlogPostWhereInput {
  return {
    OR: [{ status: "PUBLISHED" }, { status: "SCHEDULED", scheduledAt: { lte: now } }],
  };
}

export function isLivePost(status: string, scheduledAt: Date | null, now = new Date()) {
  if (status === "PUBLISHED") return true;
  return status === "SCHEDULED" && scheduledAt !== null && scheduledAt <= now;
}

export function statusLabel(status: string, scheduledAt: Date | null, now = new Date()) {
  if (isLivePost(status, scheduledAt, now)) return "Published";
  if (status === "SCHEDULED") return "Scheduled";
  return "Draft";
}
