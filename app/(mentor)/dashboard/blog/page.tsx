import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import { requireAuthor } from "@/lib/auth/session";
import { DeletePostButton } from "@/components/blog/delete-post-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/blog/utils";
import { statusLabel } from "@/lib/blog/live";
import { cn } from "@/lib/utils";

export default async function DashboardBlogPage() {
  const { appUser, allowed } = await requireAuthor();
  if (!allowed) return null;

  const posts = await prisma.blogPost.findMany({
    where: { authorId: appUser.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">My Blogs</h1>
          <p className="text-muted-foreground mt-1 text-sm">Drafts and published pieces.</p>
        </div>
        <Link href="/dashboard/blog/new" className={cn(buttonVariants())}>
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-10">You have not written anything yet.</p>
      ) : (
        <ul className="mt-8 divide-y">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-muted-foreground text-sm">Updated {formatDate(post.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    statusLabel(post.status, post.scheduledAt) === "Published" ? "default" : "secondary"
                  }
                >
                  {statusLabel(post.status, post.scheduledAt)}
                </Badge>
                <Link
                  href={`/dashboard/blog/${post.id}/edit`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  Edit
                </Link>
                <Link
                  href={`/dashboard/blog/${post.id}/preview`}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Preview
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
