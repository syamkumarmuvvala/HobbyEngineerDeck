import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma/client";
import { renderPostHtml } from "@/lib/blog/render";
import { livePostWhere } from "@/lib/blog/live";
import { PostArticle } from "@/components/blog/post-article";

type Params = Promise<{ slug: string }>;

async function getPublishedPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, ...livePostWhere() },
    include: {
      author: { select: { name: true, email: true, avatarUrl: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  return <PostArticle post={post} html={renderPostHtml(post.contentJson)} />;
}
