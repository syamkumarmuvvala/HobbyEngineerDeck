import { PostEditor } from "@/components/blog/post-editor";

export default function NewPostPage() {
  return (
    <PostEditor
      post={{
        title: "",
        slug: "",
        excerpt: "",
        coverImageUrl: "",
        tags: "",
        contentJson: { type: "doc", content: [{ type: "paragraph" }] },
        status: "DRAFT",
        scheduledAt: null,
        publishedAt: null,
        revisions: [],
      }}
    />
  );
}
