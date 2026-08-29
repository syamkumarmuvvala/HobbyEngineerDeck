import { COVER_BUCKET, MAX_COVER_BYTES } from "@/lib/blog/utils";
import { createClient } from "@/lib/supabase/client";

export async function uploadBlogImage(file: File) {
  if (file.size > MAX_COVER_BYTES) {
    throw new Error("Image must be 5MB or smaller");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be signed in to upload");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(COVER_BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) {
    throw new Error(error.message);
  }

  return supabase.storage.from(COVER_BUCKET).getPublicUrl(path).data.publicUrl;
}
