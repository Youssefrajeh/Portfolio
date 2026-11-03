// Turns a Google Drive share link into its embeddable player URL.
// "https://drive.google.com/file/d/<id>/view?usp=sharing" -> ".../file/d/<id>/preview"
// Returns undefined for links that aren't Drive files, so callers can fall back to a plain link.
export function videoEmbedUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const match = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : undefined;
}
