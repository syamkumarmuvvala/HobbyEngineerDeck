import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/blog/utils";

type PostCardPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  author: { name: string | null; email: string };
};

export function PostCard({ post }: { post: PostCardPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        {post.coverImageUrl ? (
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={post.coverImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="bg-muted aspect-[16/9] w-full" />
        )}
        <CardHeader>
          <CardTitle className="font-heading text-xl">{post.title}</CardTitle>
          <CardDescription>
            {post.author.name ?? post.author.email}
            {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : null}
          </CardDescription>
        </CardHeader>
        {post.excerpt ? (
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}
