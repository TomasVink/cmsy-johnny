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
export function useLivePreview<T extends Record<string, unknown>>(
  options: LivePreviewOptions<T>,
) {
  const { initialData, serverURL = 'http://localhost:3000' } = options

  let data = $state<T>(initialData)
  let isLoading = $state(false)

  $effect(() => {
    if (typeof window === 'undefined') return

    function handleMessage(event: MessageEvent) {
      // Only accept messages from the configured Payload origin.
      // This is a critical security check — do not remove.
      if (event.origin !== serverURL) return

      const message = event.data as { type: string; data: T }
      if (message?.type !== 'payload-live-preview') return

      data = message.data
      isLoading = false
    }

    window.addEventListener('message', handleMessage)

    // Signal to Payload's admin panel that this iframe is ready.
    // Payload waits for this before sending the first preview update.
    if (window.parent !== window) {
      window.parent.postMessage('payload-live-preview-ready', serverURL)
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
