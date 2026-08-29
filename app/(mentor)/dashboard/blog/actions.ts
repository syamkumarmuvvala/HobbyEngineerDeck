"use server";

import { revalidatePath } from "next/cache";
import type { JSONContent } from "@tiptap/react";
import { Prisma, type PostStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma/client";
import { requireAuthor } from "@/lib/auth/session";
import { slugify } from "@/lib/blog/utils";

const emptyDoc: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const REVISION_CAP = 30;

export type SaveIntent = "persist" | "publish" | "schedule" | "unpublish";

export type SavePostInput = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  tags: string;
  contentJson: JSONContent;
  intent: SaveIntent;
  scheduledAt?: string | null;
  snapshot?: boolean;
};

export type RevisionSummary = {
  id: string;
  createdAt: Date;
};

export type SavePostResult = {
  id: string;
  slug: string;
  status: PostStatus;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  updatedAt: Date;
  revisions: RevisionSummary[];
};

async function uniqueSlug(base: string, excludeId?: string) {
  const root = slugify(base);
  let candidate = root;
  let n = 2;
  while (
    await prisma.blogPost.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    })
  ) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

async function syncTags(postId: string, rawTags: string) {
  const names = rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  await prisma.blogPostTag.deleteMany({ where: { postId } });

  for (const name of names) {
    const slug = slugify(name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
    });
    await prisma.blogPostTag.create({
      data: { postId, tagId: tag.id },
    });
  }
}

function parseContent(content: JSONContent | undefined): JSONContent {
  if (content && content.type === "doc") return content;
  return emptyDoc;
}

async function snapshotRevision(postId: string) {
  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) return;

  await prisma.blogPostRevision.create({
    data: {
      postId,
      title: post.title,
      excerpt: post.excerpt,
      contentJson: post.contentJson as Prisma.InputJsonValue,
      coverImageUrl: post.coverImageUrl,
    },
  });

  const extras = await prisma.blogPostRevision.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    skip: REVISION_CAP,
    select: { id: true },
  });
  if (extras.length > 0) {
    await prisma.blogPostRevision.deleteMany({
      where: { id: { in: extras.map((row) => row.id) } },
    });
  }
}

async function listRevisions(postId: string): Promise<RevisionSummary[]> {
  return prisma.blogPostRevision.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    take: REVISION_CAP,
    select: { id: true, createdAt: true },
  });
}

function resolveStatus(
  intent: SaveIntent,
  existing: { status: PostStatus; publishedAt: Date | null; scheduledAt: Date | null },
  scheduledAtRaw?: string | null,
) {
  const now = new Date();

  if (intent === "persist") {
    if (existing.status === "SCHEDULED" && scheduledAtRaw) {
      const when = new Date(scheduledAtRaw);
      if (!Number.isNaN(when.getTime()) && when > now) {
        return {
          status: "SCHEDULED" as const,
          publishedAt: existing.publishedAt ?? when,
          scheduledAt: when,
        };
      }
    }
    return {
      status: existing.status,
      publishedAt: existing.publishedAt,
      scheduledAt: existing.scheduledAt,
    };
  }

  if (intent === "unpublish") {
    return { status: "DRAFT" as const, publishedAt: existing.publishedAt, scheduledAt: null };
  }

  if (intent === "publish") {
    return {
      status: "PUBLISHED" as const,
      publishedAt: existing.publishedAt ?? now,
      scheduledAt: null,
    };
  }

  if (intent === "schedule") {
    const when = scheduledAtRaw ? new Date(scheduledAtRaw) : null;
    if (!when || Number.isNaN(when.getTime())) {
      throw new Error("Choose a date and time to schedule");
    }
    if (when <= now) {
      return {
        status: "PUBLISHED" as const,
        publishedAt: existing.publishedAt ?? now,
        scheduledAt: null,
      };
    }
    return {
      status: "SCHEDULED" as const,
      publishedAt: existing.publishedAt ?? when,
      scheduledAt: when,
    };
  }

  return {
    status: existing.status,
    publishedAt: existing.publishedAt,
    scheduledAt: existing.scheduledAt,
  };
}

export async function savePost(input: SavePostInput): Promise<SavePostResult> {
  const { appUser, allowed } = await requireAuthor();
  if (!allowed) {
    throw new Error("Only mentors and admins can publish");
  }

  const title = input.title.trim();
  if (!title) {
    throw new Error("Title is required");
  }

  const id = input.id?.trim() || "";
  const excerpt = input.excerpt.trim() || null;
  const coverImageUrl = input.coverImageUrl.trim() || null;
  const contentJson = parseContent(input.contentJson);
  const slug = await uniqueSlug(input.slug.trim() || title, id || undefined);

  const existing = id
    ? await prisma.blogPost.findUnique({ where: { id } })
    : null;

  if (id && (!existing || existing.authorId !== appUser.id)) {
    throw new Error("Post not found");
  }

  const next = resolveStatus(
    input.intent,
    existing ?? { status: "DRAFT", publishedAt: null, scheduledAt: null },
    input.scheduledAt,
  );

  const data = {
    title,
    slug,
    excerpt,
    coverImageUrl,
    contentJson: contentJson as Prisma.InputJsonValue,
    status: next.status,
    publishedAt: next.publishedAt,
    scheduledAt: next.scheduledAt,
  };

  const saved = existing
    ? await prisma.blogPost.update({ where: { id: existing.id }, data })
    : await prisma.blogPost.create({
        data: { ...data, authorId: appUser.id },
      });

  await syncTags(saved.id, input.tags);

  if (input.snapshot) {
    await snapshotRevision(saved.id);
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${saved.slug}`);
  revalidatePath("/dashboard/blog");
  revalidatePath(`/dashboard/blog/${saved.id}/edit`);
  revalidatePath(`/dashboard/blog/${saved.id}/preview`);

  return {
    id: saved.id,
    slug: saved.slug,
    status: saved.status,
    publishedAt: saved.publishedAt,
    scheduledAt: saved.scheduledAt,
    updatedAt: saved.updatedAt,
    revisions: await listRevisions(saved.id),
  };
}

export async function loadRevision(postId: string, revisionId: string) {
  const { appUser, allowed } = await requireAuthor();
  if (!allowed) {
    throw new Error("Only mentors and admins can load revisions");
  }

  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== appUser.id) {
    throw new Error("Post not found");
  }

  const revision = await prisma.blogPostRevision.findFirst({
    where: { id: revisionId, postId },
  });
  if (!revision) {
    throw new Error("Revision not found");
  }

  return {
    title: revision.title,
    excerpt: revision.excerpt ?? "",
    coverImageUrl: revision.coverImageUrl ?? "",
    contentJson: revision.contentJson as JSONContent,
  };
}

export async function deletePost(formData: FormData) {
  const { appUser, allowed } = await requireAuthor();
  if (!allowed) {
    throw new Error("Only mentors and admins can delete posts");
  }

  const id = String(formData.get("id") ?? "");
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing || existing.authorId !== appUser.id) {
    throw new Error("Post not found");
  }

  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
}
