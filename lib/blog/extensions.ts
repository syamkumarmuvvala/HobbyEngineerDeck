import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Placeholder } from "@tiptap/extensions";
import { TableKit } from "@tiptap/extension-table";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import { Callout } from "@/lib/blog/callout";

const lowlight = createLowlight(common);

export function blogExtensions(placeholder = "Type / for commands") {
  return [
    StarterKit.configure({
      codeBlock: false,
      heading: { levels: [2, 3] },
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      },
    }),
    Placeholder.configure({
      placeholder,
      showOnlyCurrent: true,
      includeChildren: false,
    }),
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: { class: "rounded-lg" },
    }),
    Youtube.configure({
      width: "100%",
      HTMLAttributes: { class: "youtube-embed" },
      modestBranding: true,
    }),
    CodeBlockLowlight.configure({ lowlight }),
    TableKit.configure({
      table: { resizable: false, HTMLAttributes: { class: "blog-table" } },
    }),
    Callout,
  ];
}
