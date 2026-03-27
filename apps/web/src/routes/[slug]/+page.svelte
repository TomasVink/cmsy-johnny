<script lang="ts">
  import { untrack } from 'svelte'
  import type { PageData } from './$types'
  import { useLivePreview } from '$lib/stores/live-preview.svelte.ts'
  import { env } from '$env/dynamic/public'
  import type { Page } from '@repo/payload-types'
  import Nav from '$lib/components/layout/Nav.svelte'
  import Footer from '$lib/components/layout/Footer.svelte'
  import BlockRenderer from '$lib/components/BlockRenderer.svelte'

  let { data }: { data: PageData } = $props()

  // useLivePreview starts with SSR data and updates reactively via postMessage
  // when this page is embedded in the Payload admin iframe.
  const preview = useLivePreview<Page>({
    initialData: untrack(() => data.page as Page),
    serverURL: env.PUBLIC_PAYLOAD_URL,
  })
</script>

<svelte:head>
  <title>{preview.data?.seo?.title ?? preview.data?.title ?? "Here's Johnny!"}</title>
  {#if preview.data?.seo?.description}
    <meta name="description" content={preview.data.seo.description} />
  {/if}
</svelte:head>

{#if preview.isLoading}
  <div class="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
    <span class="text-sm text-gray-400">Connecting to live preview…</span>
  </div>
{/if}

<Nav settings={data.settings} />

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<BlockRenderer blocks={((preview.data as any)?.layout) ?? []} />

<Footer settings={data.settings} />
