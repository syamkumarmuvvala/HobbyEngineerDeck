"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useRef, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { blogExtensions } from "@/lib/blog/extensions";
import { COVER_BUCKET, MAX_COVER_BYTES, slugify } from "@/lib/blog/utils";
import { createClient } from "@/lib/supabase/client";
import { savePost } from "@/app/dashboard/blog/actions";

const emptyDoc: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

type EditorPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  tags: string;
  contentJson: JSONContent;
};

export function PostEditor({ post }: { post: EditorPost }) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(post.slug));
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [tags, setTags] = useState(post.tags);
  const [coverImageUrl, setCoverImageUrl] = useState(post.coverImageUrl);
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: blogExtensions(),
    content: post.contentJson ?? emptyDoc,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[280px] focus:outline-none px-3 py-2",
      },
    },
    onUpdate: ({ editor: instance }) => {
      if (contentRef.current) {
        contentRef.current.value = JSON.stringify(instance.getJSON());
      }
    },
  });

  async function onCover(file: File) {
    if (file.size > MAX_COVER_BYTES) {
      toast.error("Cover image must be 5MB or smaller");
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      toast.error("You must be signed in to upload");
      return;
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(COVER_BUCKET).upload(path, file, {
      upsert: false,
    });
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
    setCoverImageUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <form action={savePost} className="space-y-6">
      {post.id ? <input type="hidden" name="id" value={post.id} /> : null}
      <input
        ref={contentRef}
        type="hidden"
        name="contentJson"
        defaultValue={JSON.stringify(post.contentJson ?? emptyDoc)}
      />
      <input type="hidden" name="coverImageUrl" value={coverImageUrl} />

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(event) => {
            const next = event.target.value;
            setTitle(next);
            if (!slugTouched) setSlug(slugify(next));
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="firmware, 3d-print, ham-radio"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
        />
        <p className="text-muted-foreground text-xs">Comma-separated.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover">Cover image</Label>
        <Input
          id="cover"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onCover(file);
          }}
        />
        {uploading ? <p className="text-muted-foreground text-xs">Uploading…</p> : null}
        {coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt=""
            className="mt-2 max-h-48 rounded-lg object-cover"
          />
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Body</Label>
        <div className="rounded-lg border">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" name="intent" value="draft" variant="outline">
          Save draft
        </Button>
        <Button type="submit" name="intent" value="publish">
          Publish
        </Button>
      </div>
    </form>
  );
}
