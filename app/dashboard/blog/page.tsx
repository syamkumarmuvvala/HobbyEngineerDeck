import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import { getActivePortal } from "@/lib/auth/portal";
import { requireAuthor } from "@/lib/auth/session";
import { DeletePostButton } from "@/components/blog/delete-post-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/blog/utils";
import { cn } from "@/lib/utils";

export default async function DashboardBlogPage() {
  const { appUser, allowed } = await requireAuthor();
  if (!allowed) return null;

  const activePortal = await getActivePortal(appUser);

  const posts = await prisma.blogPost.findMany({
    where: { authorId: appUser.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">Your posts</h1>
          <p className="text-muted-foreground mt-1 text-sm">Drafts and published pieces.</p>
        </div>
        {activePortal === "mentor" ? (
          <Link href="/dashboard/blog/new" className={cn(buttonVariants())}>
            New post
          </Link>
        ) : null}
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-10">You have not written anything yet.</p>
      ) : (
        <ul className="mt-8 divide-y">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-muted-foreground text-sm">
                  Updated {formatDate(post.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                  {post.status === "PUBLISHED" ? "Published" : "Draft"}
                </Badge>
                <Link
                  href={`/dashboard/blog/${post.id}/edit`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  Edit
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
