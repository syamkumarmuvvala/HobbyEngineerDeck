import { prisma } from "@/lib/prisma/client";
import { livePostWhere } from "@/lib/blog/live";

export async function getAuthorPostStats(authorId: string) {
  const now = new Date();
  const [total, drafts, published, scheduled] = await Promise.all([
    prisma.blogPost.count({ where: { authorId } }),
    prisma.blogPost.count({ where: { authorId, status: "DRAFT" } }),
    prisma.blogPost.count({ where: { authorId, ...livePostWhere(now) } }),
    prisma.blogPost.count({
      where: { authorId, status: "SCHEDULED", scheduledAt: { gt: now } },
    }),
  ]);

  return { total, drafts, published, scheduled };
}
