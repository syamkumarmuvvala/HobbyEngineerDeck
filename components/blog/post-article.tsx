import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/blog/utils";

type ArticlePost = {
  title: string;
  excerpt?: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  scheduledAt?: Date | null;
  author: { name: string | null; email: string };
  tags: { tag: { id: string; name: string } }[];
};

export function PostArticle({ post, html }: { post: ArticlePost; html: string }) {
  const displayDate = post.publishedAt ?? post.scheduledAt;

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
        {displayDate ? ` · ${formatDate(displayDate)}` : null}
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
