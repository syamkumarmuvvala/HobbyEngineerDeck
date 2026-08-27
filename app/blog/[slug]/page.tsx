import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma/client";
import { renderPostHtml } from "@/lib/blog/render";
import { formatDate } from "@/lib/blog/utils";
import { Badge } from "@/components/ui/badge";

type Params = Promise<{ slug: string }>;

async function getPublishedPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
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

  const html = renderPostHtml(post.contentJson);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      {post.coverImageUrl ? (
        <div className="relative mb-8 aspect-[16/8] overflow-hidden rounded-xl">
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      ) : null}
      <p className="text-muted-foreground text-sm">
        {post.author.name ?? post.author.email}
        {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : null}
      </p>
      <h1 className="font-heading mt-2 text-4xl tracking-tight text-pretty">{post.title}</h1>
      {post.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map(({ tag }) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      ) : null}
      <div className="blog-content mt-10" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
