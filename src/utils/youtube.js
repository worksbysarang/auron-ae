// ============================================================
// AURON.AE — YouTube URL Utilities
// ============================================================

/**
 * Extract a YouTube video ID from various URL formats:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *   VIDEO_ID (bare)
 */
export function extractYouTubeId(input) {
  if (!input) return null;
  const str = input.trim();

  // Already a bare ID (11 chars, alphanumeric + _ -)
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;

  try {
    const url = new URL(str);
    // youtu.be/ID
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1).split('?')[0] || null;
    }
    // youtube.com/watch?v=ID
    const v = url.searchParams.get('v');
    if (v) return v;
    // youtube.com/embed/ID
    const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
  } catch {
    // Not a valid URL — try regex extraction
  }

  const match = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  return null;
}

/**
 * Build a youtube-nocookie.com embed URL from an ID or any YouTube URL.
 */
export function buildEmbedUrl(input) {
  const id = extractYouTubeId(input);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

/**
 * Build a YouTube thumbnail URL from an ID or URL.
 */
export function buildThumbnailUrl(input) {
  const id = extractYouTubeId(input);
  if (!id) return null;
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Build an external watch URL.
 */
export function buildWatchUrl(input) {
  const id = extractYouTubeId(input);
  if (!id) return null;
  return `https://www.youtube.com/watch?v=${id}`;
}

