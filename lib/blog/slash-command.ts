import { Extension } from "@tiptap/core";
import type { Editor, Range } from "@tiptap/core";
import Suggestion, { type SuggestionProps } from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";

export const slashPluginKey = new PluginKey("slashCommand");

export type SlashItem = {
  title: string;
  subtitle: string;
  keywords: string;
  command: (editor: Editor) => void;
};

export type SlashRenderer = {
  onStart: (props: SuggestionProps<SlashItem, SlashItem>) => void;
  onUpdate: (props: SuggestionProps<SlashItem, SlashItem>) => void;
  onExit: () => void;
  onKeyDown: (event: KeyboardEvent) => boolean;
};

type SlashOptions = {
  items: (query: string) => SlashItem[];
  renderer: SlashRenderer;
};

export const SlashCommand = Extension.create<SlashOptions>({
  name: "slashCommand",

  addOptions() {
    return {
      items: () => [],
      renderer: {
        onStart: () => undefined,
        onUpdate: () => undefined,
        onExit: () => undefined,
        onKeyDown: () => false,
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        pluginKey: slashPluginKey,
        char: "/",
        allowSpaces: false,
        startOfLine: false,
        allowedPrefixes: null,
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          if ($from.parent.type.name !== "paragraph") return false;
          const textBefore = state.doc.textBetween($from.start(), range.from, "\n", "\0");
          return textBefore.trim() === "";
        },
        items: ({ query }) => this.options.items(query),
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range as Range).run();
          props.command(editor);
        },
        render: () => {
          const renderer = this.options.renderer;
          return {
            onStart: (props) => renderer.onStart(props),
            onUpdate: (props) => renderer.onUpdate(props),
            onExit: () => renderer.onExit(),
            onKeyDown: ({ event }) => renderer.onKeyDown(event),
          };
        },
      }),
    ];
  },
});
