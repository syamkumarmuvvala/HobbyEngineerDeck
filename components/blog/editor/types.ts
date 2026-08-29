import type { JSONContent } from "@tiptap/react";
import type { PostStatus } from "@/lib/generated/prisma/client";

export type EditorRevision = {
  id: string;
  createdAt: Date | string;
};

export type EditorPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  tags: string;
  contentJson: JSONContent;
  status: PostStatus;
  scheduledAt: Date | string | null;
  publishedAt: Date | string | null;
  revisions: EditorRevision[];
};

export const emptyDoc: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};
