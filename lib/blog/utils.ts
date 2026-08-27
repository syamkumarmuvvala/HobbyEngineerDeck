export const COVER_BUCKET = "blog-covers";
export const POSTS_PER_PAGE = 12;
export const MAX_COVER_BYTES = 5 * 1024 * 1024;

export function slugify(input: string) {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "post";
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
