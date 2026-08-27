"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma/client";
import { requireAuthor } from "@/lib/auth/session";
import { slugify } from "@/lib/blog/utils";
import type { JSONContent } from "@tiptap/react";

const emptyDoc: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
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

function parseContent(raw: string): JSONContent {
  try {
    const parsed = JSON.parse(raw) as JSONContent;
    if (parsed && parsed.type === "doc") return parsed;
  } catch {
    // fall through
  }
  return emptyDoc;
}

export async function savePost(formData: FormData) {
  const { appUser, allowed } = await requireAuthor();
  if (!allowed) {
    throw new Error("Only mentors and admins can publish");
  }

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim() || null;
  const tags = String(formData.get("tags") ?? "");
  const intent = String(formData.get("intent") ?? "draft");
  const contentJson = parseContent(String(formData.get("contentJson") ?? ""));

  if (!title) {
    throw new Error("Title is required");
  }

  const publish = intent === "publish";
  const slug = await uniqueSlug(slugInput || title, id || undefined);

  if (id) {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing || existing.authorId !== appUser.id) {
      throw new Error("Post not found");
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        coverImageUrl,
        contentJson: contentJson as Prisma.InputJsonValue,
        status: publish ? "PUBLISHED" : "DRAFT",
        publishedAt: publish ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
      },
    });
    await syncTags(id, tags);
  } else {
    const created = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        coverImageUrl,
        contentJson: contentJson as Prisma.InputJsonValue,
        authorId: appUser.id,
        status: publish ? "PUBLISHED" : "DRAFT",
        publishedAt: publish ? new Date() : null,
      },
    });
    await syncTags(created.id, tags);
  }

  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
  redirect("/dashboard/blog");
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
