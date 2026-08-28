import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import { PostCard } from "@/components/blog/post-card";
import { POSTS_PER_PAGE } from "@/lib/blog/utils";
import { livePostWhere } from "@/lib/blog/live";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ page?: string }>;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: livePostWhere(),
      orderBy: { publishedAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
      include: { author: { select: { name: true, email: true } } },
    }),
    prisma.blogPost.count({ where: livePostWhere() }),
  ]);

  const pages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">Blog</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Build notes, course sketches, and field reports from mentors on HobbyEngineerDeck.
      </p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-12">
          No published posts yet. Mentors can write from the dashboard.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {pages > 1 ? (
        <div className="mt-10 flex gap-2">
          {page > 1 ? (
            <Link
              href={`/blog?page=${page - 1}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Previous
            </Link>
          ) : null}
          {page < pages ? (
            <Link
              href={`/blog?page=${page + 1}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Next
            </Link>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
