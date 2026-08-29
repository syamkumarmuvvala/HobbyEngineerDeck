import { Node, mergeAttributes } from "@tiptap/core";

export type CalloutVariant = "tip" | "note" | "warning";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (variant?: CalloutVariant) => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: "note" satisfies CalloutVariant,
        parseHTML: (element) =>
          (element.getAttribute("data-callout") as CalloutVariant | null) ?? "note",
        renderHTML: (attributes) => ({ "data-callout": attributes.variant }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "aside[data-callout]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const variant = (HTMLAttributes["data-callout"] as CalloutVariant) || "note";
    return [
      "aside",
      mergeAttributes(HTMLAttributes, {
        "data-callout": variant,
        class: `callout callout-${variant}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setCallout:
        (variant: CalloutVariant = "note") =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { variant },
            content: [{ type: "paragraph" }],
          }),
    };
  },
});
