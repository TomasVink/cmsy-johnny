/**
 * Live Preview store for Payload CMS integration.
 *
 * Payload's admin panel embeds this app in an iframe and sends
 * `payload-live-preview` postMessage events whenever document data changes.
 *
 * Usage in a Svelte component:
 *
 *   import { useLivePreview } from '$lib/stores/live-preview.svelte'
 *   import type { Page } from '@repo/payload-types'
 *
 *   const preview = useLivePreview<Page>({ initialData: data.page })
 *   // Access preview.data reactively — it updates as you edit in the CMS admin
 */

export type LivePreviewOptions<T> = {
  /** Initial data from the server-side load function, displayed before first postMessage. */
  initialData: T
  /**
   * Origin of the Payload CMS admin panel.
   * Defaults to the PUBLIC_PAYLOAD_URL from the .env file.
   * Must match exactly — used for postMessage origin validation.
   */
  serverURL?: string
}

/**
 * Creates a reactive live preview state using Svelte 5 runes.
 * Must be called at component initialisation time (top-level in <script>).
 */
export function useLivePreview<T extends object>(
  options: LivePreviewOptions<T>,
) {
  const { initialData, serverURL = 'http://localhost:3000' } = options

  // Normalize to a bare origin (strips trailing slash, paths, etc.) so that
  // postMessage targetOrigin and event.origin comparisons work correctly.
  // e.g. "http://localhost:3000/" → "http://localhost:3000"
  const origin = (() => {
    try {
      return new URL(serverURL).origin
    } catch {
      return serverURL
    }
  })()

  let data = $state<T>(initialData)
  // Start as true — Payload sends the first update after receiving the ready
  // signal, so we show a loading state until that first message arrives.
  let isLoading = $state(true)

  $effect(() => {
    if (typeof window === 'undefined') return

    function handleMessage(event: MessageEvent) {
      // Only accept messages from the configured Payload origin.
      // This is a critical security check — do not remove.
      if (event.origin !== origin) return

      const message = event.data as { type: string; data: T }
      if (message?.type !== 'payload-live-preview') return

      data = message.data
      isLoading = false
    }

    window.addEventListener('message', handleMessage)

    // Signal to Payload's admin panel that this iframe is ready.
    // Payload waits for this before sending the first preview update.
    // Must be { type: 'payload-live-preview', ready: true } — Payload checks
    // event.data.type and event.data.ready, not a plain string message.
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'payload-live-preview', ready: true }, origin)
    } else {
      // Not in an iframe — no live preview, show content immediately.
      isLoading = false
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  })

  return {
    get data() {
      return data
    },
    get isLoading() {
      return isLoading
    },
  }
}
