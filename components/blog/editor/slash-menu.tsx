"use client";

import { useEffect, useState } from "react";
import type { SuggestionProps } from "@tiptap/suggestion";
import type { SlashItem } from "@/lib/blog/slash-command";
import { cn } from "@/lib/utils";

export function EditorSlashMenu({
  suggestion,
  onKeyDownRef,
}: {
  suggestion: SuggestionProps<SlashItem, SlashItem> | null;
  onKeyDownRef: { current: (event: KeyboardEvent) => boolean };
}) {
  const items = suggestion?.items ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [suggestion?.query, items.length]);

  useEffect(() => {
    onKeyDownRef.current = (event) => {
      if (!suggestion || items.length === 0) return false;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setIndex((current) => (current + 1) % items.length);
        return true;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setIndex((current) => (current - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const item = items[index];
        if (item) suggestion.command(item);
        return true;
      }
      if (event.key === "Escape") {
        return true;
      }
      return false;
    };
  }, [index, items, onKeyDownRef, suggestion]);

  if (!suggestion || items.length === 0) return null;

  const rect = suggestion.clientRect?.();
  if (!rect) return null;

  return (
    <div
      className="border-border bg-popover text-popover-foreground fixed z-50 w-72 overflow-hidden rounded-xl border shadow-lg"
      style={{ top: rect.bottom + 8, left: rect.left }}
    >
      <p className="text-muted-foreground px-3 pt-2 pb-1 text-[11px] font-medium tracking-wide uppercase">
        Insert
      </p>
      <ul className="max-h-80 overflow-y-auto p-1">
        {items.map((item, itemIndex) => (
          <li key={item.title}>
            <button
              type="button"
              className={cn(
                "flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm",
                itemIndex === index ? "bg-muted" : "hover:bg-muted/60",
              )}
              onMouseDown={(event) => {
                event.preventDefault();
                suggestion.command(item);
              }}
              onMouseEnter={() => setIndex(itemIndex)}
            >
              <span className="font-medium">{item.title}</span>
              <span className="text-muted-foreground text-xs">{item.subtitle}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
