import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { prisma } from "@/lib/prisma/client";
import { requireAuthor } from "@/lib/auth/session";
import { PostEditor } from "@/components/blog/post-editor";

type Params = Promise<{ id: string }>;

export default async function EditPostPage({ params }: { params: Params }) {
  const { appUser, allowed } = await requireAuthor();
  if (!allowed) return null;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      revisions: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { id: true, createdAt: true },
      },
    },
  });

  if (!post || post.authorId !== appUser.id) {
    notFound();
  }

  return (
    <PostEditor
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        coverImageUrl: post.coverImageUrl ?? "",
        tags: post.tags.map((row) => row.tag.name).join(", "),
        contentJson: post.contentJson as JSONContent,
        status: post.status,
        scheduledAt: post.scheduledAt,
        publishedAt: post.publishedAt,
        revisions: post.revisions,
      }}
    />
  );
}
