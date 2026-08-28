import { generateHTML } from "@tiptap/html/server";
import DOMPurify from "isomorphic-dompurify";
import type { JSONContent } from "@tiptap/react";
import { blogExtensions } from "@/lib/blog/extensions";

const YOUTUBE_EMBED =
  /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\/[\w-]+/;

let purifyHooksBound = false;

function bindPurifyHooks() {
  if (purifyHooksBound) return;
  purifyHooksBound = true;
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName !== "iframe") return;
    const element = node as unknown as { getAttribute?: (name: string) => string | null };
    const src = element.getAttribute?.("src") ?? "";
    if (!YOUTUBE_EMBED.test(src)) {
      node.parentNode?.removeChild(node);
    }
  });
}

export function renderPostHtml(contentJson: unknown) {
  if (!contentJson || typeof contentJson !== "object") {
    return "";
  }

  bindPurifyHooks();
  const html = generateHTML(contentJson as JSONContent, blogExtensions());
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe", "aside"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "target",
      "rel",
      "src",
      "class",
      "data-callout",
    ],
  });
}
