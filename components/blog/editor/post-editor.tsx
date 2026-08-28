"use client";

import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { NodeRange } from "@tiptap/extension-node-range";
import { EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import type { SuggestionProps } from "@tiptap/suggestion";
import { GripVertical, ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { loadRevision, savePost, type SaveIntent } from "@/app/(mentor)/dashboard/blog/actions";
import { EditorBubbleMenu } from "@/components/blog/editor/bubble-menu";
import { defaultScheduleLocal, EditorSettingsFields } from "@/components/blog/editor/editor-settings";
import { EditorTableMenu } from "@/components/blog/editor/table-menu";
import { EditorToolbar } from "@/components/blog/editor/editor-toolbar";
import { EditorSlashMenu } from "@/components/blog/editor/slash-menu";
import { emptyDoc, type EditorPost, type EditorRevision } from "@/components/blog/editor/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { blogExtensions } from "@/lib/blog/extensions";
import { uploadBlogImage } from "@/lib/blog/media";
import { SlashCommand, type SlashItem } from "@/lib/blog/slash-command";
import { slugify } from "@/lib/blog/utils";
import type { PostStatus } from "@/lib/generated/prisma/client";

function slashItems(
  query: string,
  hooks: { onImage: () => void; onYoutube: () => void },
): SlashItem[] {
  const items: SlashItem[] = [
    {
      title: "Heading 2",
      subtitle: "Large section heading",
      keywords: "h2 heading",
      command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: "Heading 3",
      subtitle: "Smaller heading",
      keywords: "h3 heading",
      command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: "Bullet list",
      subtitle: "Simple list",
      keywords: "ul list bullets",
      command: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      title: "Numbered list",
      subtitle: "Ordered steps",
      keywords: "ol list numbers",
      command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      title: "Quote",
      subtitle: "Highlight a passage",
      keywords: "blockquote cite",
      command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      title: "Divider",
      subtitle: "Horizontal rule",
      keywords: "hr line",
      command: (editor) => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      title: "Code block",
      subtitle: "Syntax-highlighted snippet",
      keywords: "code pre",
      command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: "Image",
      subtitle: "Upload from your computer",
      keywords: "photo picture upload",
      command: () => hooks.onImage(),
    },
    {
      title: "YouTube",
      subtitle: "Embed a video",
      keywords: "video youtube embed",
      command: () => hooks.onYoutube(),
    },
    {
      title: "Note",
      subtitle: "Callout",
      keywords: "callout aside note",
      command: (editor) => editor.chain().focus().setCallout("note").run(),
    },
    {
      title: "Tip",
      subtitle: "Helpful callout",
      keywords: "callout tip",
      command: (editor) => editor.chain().focus().setCallout("tip").run(),
    },
    {
      title: "Warning",
      subtitle: "Caution callout",
      keywords: "callout warning",
      command: (editor) => editor.chain().focus().setCallout("warning").run(),
    },
    {
      title: "Table",
      subtitle: "3 × 3 with header",
      keywords: "table grid",
      command: (editor) =>
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
  ];

  const needle = query.toLowerCase().trim();
  if (!needle) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(needle) || item.keywords.includes(needle) || item.subtitle.toLowerCase().includes(needle),
  );
}

export function PostEditor({ post }: { post: EditorPost }) {
  const [postId, setPostId] = useState(post.id);
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(post.slug));
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [tags, setTags] = useState(post.tags);
  const [coverImageUrl, setCoverImageUrl] = useState(post.coverImageUrl);
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [scheduledAt, setScheduledAt] = useState<Date | string | null>(post.scheduledAt);
  const [scheduledLocal, setScheduledLocal] = useState(defaultScheduleLocal(post.scheduledAt));
  const [revisions, setRevisions] = useState<EditorRevision[]>(post.revisions);
  const [contentTick, setContentTick] = useState(0);
  const [, setSelectionTick] = useState(0);
  const [pending, setPending] = useState(false);
  const [savedLabel, setSavedLabel] = useState(post.id ? "Saved" : "Not saved yet");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [slashSuggestion, setSlashSuggestion] = useState<SuggestionProps<SlashItem, SlashItem> | null>(
    null,
  );

  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const skipAutosave = useRef(true);
  const savingRef = useRef(false);
  const slashKeyDownRef = useRef<(event: KeyboardEvent) => boolean>(() => false);
  const hooksRef = useRef({ onImage: () => undefined as void, onYoutube: () => undefined as void });
  const insertImageRef = useRef<(file: File) => Promise<void>>(async () => undefined);

  const editor = useEditor({
    extensions: [
      ...blogExtensions(),
      NodeRange,
      SlashCommand.configure({
        items: (query) => slashItems(query, hooksRef.current),
        renderer: {
          onStart: (props) => setSlashSuggestion(props),
          onUpdate: (props) => setSlashSuggestion(props),
          onExit: () => setSlashSuggestion(null),
          onKeyDown: (event) => slashKeyDownRef.current(event),
        },
      }),
    ],
    content: post.contentJson ?? emptyDoc,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap blog-content min-h-[50vh] focus:outline-none",
      },
      handlePaste(_view, event) {
        const file = [...(event.clipboardData?.files ?? [])].find((item) =>
          item.type.startsWith("image/"),
        );
        if (!file) return false;
        event.preventDefault();
        void insertImageRef.current(file);
        return true;
      },
      handleDrop(_view, event, _slice, moved) {
        if (moved) return false;
        const file = [...(event.dataTransfer?.files ?? [])].find((item) =>
          item.type.startsWith("image/"),
        );
        if (!file) return false;
        event.preventDefault();
        void insertImageRef.current(file);
        return true;
      },
    },
    onUpdate: () => setContentTick((tick) => tick + 1),
    onSelectionUpdate: () => setSelectionTick((tick) => tick + 1),
  });

  async function insertImage(file: File) {
    try {
      const src = await uploadBlogImage(file);
      editor?.chain().focus().setImage({ src }).run();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload image");
    }
  }
  insertImageRef.current = insertImage;

  hooksRef.current = {
    onImage: () => imageInputRef.current?.click(),
    onYoutube: () => {
      setYoutubeUrl("");
      setYoutubeOpen(true);
    },
  };

  async function persist(intent: SaveIntent, snapshot: boolean) {
    if (savingRef.current) return;
    const nextTitle = title.trim();
    if (!nextTitle) {
      if (intent !== "persist") toast.error("Add a title before saving");
      return;
    }
    if (!editor) return;

    savingRef.current = true;
    setPending(true);
    try {
      const result = await savePost({
        id: postId,
        title: nextTitle,
        slug,
        excerpt,
        coverImageUrl,
        tags,
        contentJson: editor.getJSON() as JSONContent,
        intent,
        scheduledAt: scheduledLocal ? new Date(scheduledLocal).toISOString() : null,
        snapshot,
      });
      setPostId(result.id);
      setSlug(result.slug);
      setStatus(result.status);
      setScheduledAt(result.scheduledAt);
      setRevisions(result.revisions);
      setSavedLabel("Saved just now");
      if (!postId) {
        window.history.replaceState(null, "", `/dashboard/blog/${result.id}/edit`);
      }
      if (intent === "publish") toast.success("Published");
      else if (intent === "schedule") toast.success("Scheduled");
      else if (intent === "unpublish") toast.success("Moved to drafts");
      else if (snapshot) toast.success("Saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    } finally {
      savingRef.current = false;
      setPending(false);
    }
  }

  useEffect(() => {
    if (skipAutosave.current) {
      skipAutosave.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      void persist("persist", false);
    }, 2000);
    return () => window.clearTimeout(timer);
    // Autosave when writing changes; persist() reads latest state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slug, excerpt, tags, coverImageUrl, contentTick, scheduledLocal]);

  async function onCover(file: File) {
    try {
      const url = await uploadBlogImage(file);
      setCoverImageUrl(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload cover");
    }
  }

  async function onRestore(revisionId: string) {
    if (!postId || !editor) return;
    setRestoringId(revisionId);
    try {
      const revision = await loadRevision(postId, revisionId);
      setTitle(revision.title);
      setExcerpt(revision.excerpt);
      setCoverImageUrl(revision.coverImageUrl);
      editor.commands.setContent(revision.contentJson ?? emptyDoc);
      toast.success("Revision loaded — save to keep it");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not restore");
    } finally {
      setRestoringId(null);
    }
  }

  const settings = (
    <EditorSettingsFields
      slug={slug}
      excerpt={excerpt}
      tags={tags}
      scheduledLocal={scheduledLocal}
      revisions={revisions}
      restoringId={restoringId}
      onSlug={(value) => {
        setSlugTouched(true);
        setSlug(value);
      }}
      onExcerpt={setExcerpt}
      onTags={setTags}
      onScheduledLocal={setScheduledLocal}
      onRestore={onRestore}
    />
  );

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      <EditorToolbar
        status={status}
        scheduledAt={scheduledAt}
        savedLabel={savedLabel}
        pending={pending}
        postId={postId}
        slug={slug}
        onSave={() => void persist("persist", true)}
        onPublish={() => void persist("publish", true)}
        onSchedule={() => void persist("schedule", true)}
        onUnpublish={() => void persist("unpublish", true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex min-h-0 flex-1 gap-8 pt-6">
        <div className="mx-auto min-w-0 w-full max-w-2xl">
          <button
            type="button"
            className="group relative mb-8 block w-full overflow-hidden rounded-xl"
            onClick={() => coverInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files[0];
              if (file?.type.startsWith("image/")) void onCover(file);
            }}
          >
            {coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="" className="aspect-[16/8] w-full object-cover" />
            ) : (
              <div className="border-border text-muted-foreground flex aspect-[16/8] items-center justify-center gap-2 rounded-xl border border-dashed text-sm">
                <ImagePlus className="size-4" />
                Add a cover
              </div>
            )}
          </button>
          {coverImageUrl ? (
            <Button
              type="button"
              size="xs"
              variant="ghost"
              className="mb-4"
              onClick={() => setCoverImageUrl("")}
            >
              <X />
              Remove cover
            </Button>
          ) : null}

          <textarea
            value={title}
            placeholder="Title"
            rows={1}
            className="font-heading placeholder:text-muted-foreground mb-6 w-full resize-none bg-transparent text-4xl tracking-tight outline-none"
            onChange={(event) => {
              const next = event.target.value;
              setTitle(next);
              if (!slugTouched) setSlug(slugify(next));
            }}
          />

          {editor ? <EditorTableMenu editor={editor} /> : null}

          <div className="relative pl-8">
            {editor ? (
              <DragHandle editor={editor} className="drag-handle">
                <GripVertical className="size-4" />
              </DragHandle>
            ) : null}
            <EditorContent editor={editor} />
            {editor ? <EditorBubbleMenu editor={editor} /> : null}
          </div>
        </div>

        <aside className="border-border hidden w-72 shrink-0 border-l pl-6 lg:block">
          <p className="mb-4 text-sm font-medium">Post settings</p>
          {settings}
        </aside>
      </div>

      <EditorSlashMenu suggestion={slashSuggestion} onKeyDownRef={slashKeyDownRef} />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void insertImage(file);
        }}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void onCover(file);
        }}
      />

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Post settings</DialogTitle>
            <DialogDescription>Slug, excerpt, tags, schedule, and history.</DialogDescription>
          </DialogHeader>
          {settings}
        </DialogContent>
      </Dialog>

      <Dialog open={youtubeOpen} onOpenChange={setYoutubeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Embed YouTube</DialogTitle>
            <DialogDescription>Paste a YouTube watch or share URL.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="youtube">URL</Label>
            <Input
              id="youtube"
              value={youtubeUrl}
              placeholder="https://www.youtube.com/watch?v="
              onChange={(event) => setYoutubeUrl(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setYoutubeOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!youtubeUrl.trim() || !editor) return;
                editor.chain().focus().setYoutubeVideo({ src: youtubeUrl.trim() }).run();
                setYoutubeOpen(false);
              }}
            >
              Embed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
