import { generateHTML } from "@tiptap/html";
import DOMPurify from "isomorphic-dompurify";
import type { JSONContent } from "@tiptap/react";
import { blogExtensions } from "@/lib/blog/extensions";

export function renderPostHtml(contentJson: unknown) {
  if (!contentJson || typeof contentJson !== "object") {
    return "";
  }

  const html = generateHTML(contentJson as JSONContent, blogExtensions());
  return DOMPurify.sanitize(html);
}
