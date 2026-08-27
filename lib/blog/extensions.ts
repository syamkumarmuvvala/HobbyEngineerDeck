import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";

export function blogExtensions(placeholder = "Write the piece…") {
  return [
    StarterKit,
    Image.configure({ inline: false, allowBase64: false }),
    Placeholder.configure({ placeholder }),
  ];
}
