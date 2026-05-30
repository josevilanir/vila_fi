/**
 * Same-origin proxy URL that streams a Freesound preview through our backend.
 *
 * The audio never loads from freesound.org directly — it flows through
 * `/api/v1/freesound/[id]`, so the request reaches Freesound from the server's
 * IP (Vercel) instead of the client's. Howler can't infer the format from this
 * extension-less URL, so callers must pass `format: ['mp3']`.
 */
export function getSoundStreamUrl(freesoundId: number): string {
  return `/api/v1/freesound/${freesoundId}`
}
