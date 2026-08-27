import { PostEditor } from "@/components/blog/post-editor";

export default function NewPostPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-heading mb-8 text-3xl tracking-tight">New post</h1>
      <PostEditor
        post={{
          title: "",
          slug: "",
          excerpt: "",
          coverImageUrl: "",
          tags: "",
          contentJson: { type: "doc", content: [{ type: "paragraph" }] },
        }}
      />
    </main>
  );
}
