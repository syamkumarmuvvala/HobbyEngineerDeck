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
    include: { tags: { include: { tag: true } } },
  });

  if (!post || post.authorId !== appUser.id) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-heading mb-8 text-3xl tracking-tight">Edit post</h1>
      <PostEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          coverImageUrl: post.coverImageUrl ?? "",
          tags: post.tags.map((row) => row.tag.name).join(", "),
          contentJson: post.contentJson as JSONContent,
        }}
      />
    </main>
  );
}
