import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma/client";
import { requireAuthor } from "@/lib/auth/session";
import { renderPostHtml } from "@/lib/blog/render";
import { PostArticle } from "@/components/blog/post-article";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export default async function PreviewPostPage({ params }: { params: Params }) {
  const { appUser, allowed } = await requireAuthor();
  if (!allowed) return null;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, email: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!post || post.authorId !== appUser.id) {
    notFound();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">Preview — this is how the article will read.</p>
        <Link
          href={`/dashboard/blog/${post.id}/edit`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Back to editor
        </Link>
      </div>
      <PostArticle post={post} html={renderPostHtml(post.contentJson)} />
    </div>
  );
}
