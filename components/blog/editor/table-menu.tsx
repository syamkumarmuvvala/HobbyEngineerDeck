"use client";

import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";

export function EditorTableMenu({ editor }: { editor: Editor }) {
  if (!editor.isActive("table")) return null;

  return (
    <div className="border-border bg-background mb-3 flex flex-wrap gap-1 rounded-lg border p-1">
      <Button
        type="button"
        size="xs"
        variant="ghost"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        Add column
      </Button>
      <Button
        type="button"
        size="xs"
        variant="ghost"
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        Delete column
      </Button>
      <Button
        type="button"
        size="xs"
        variant="ghost"
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        Add row
      </Button>
      <Button
        type="button"
        size="xs"
        variant="ghost"
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        Delete row
      </Button>
      <Button
        type="button"
        size="xs"
        variant="ghost"
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        Delete table
      </Button>
    </div>
  );
}
