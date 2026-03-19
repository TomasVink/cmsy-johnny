<script lang="ts">
  import { untrack } from 'svelte'
  import type { PageData } from './$types'
  import { useLivePreview } from '$lib/stores/live-preview.svelte.ts'
  import { PUBLIC_PAYLOAD_URL } from '$env/static/public'
  import type { Page } from '@repo/payload-types'

  let { data }: { data: PageData } = $props()

  // Intentionally untracked: live preview starts with SSR-fetched data and
  // updates reactively via postMessage from the Payload admin iframe.
  const preview = useLivePreview<Page>({
    initialData: untrack(() => data.page as Page),
    serverURL: PUBLIC_PAYLOAD_URL,
  })
</script>

<svelte:head>
  <title>{preview.data?.seo?.title ?? preview.data?.title ?? 'Preview'}</title>
  {#if preview.data?.seo?.description}
    <meta name="description" content={preview.data.seo.description} />
  {/if}
</svelte:head>

{#if preview.isLoading}
  <div class="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
    <span class="text-gray-500 text-sm">Connecting to live preview…</span>
  </div>
{/if}

<article class="container mx-auto px-4 py-16 max-w-3xl">
  <h1 class="text-4xl font-bold mb-8">
    {preview.data?.title ?? 'Untitled'}
  </h1>

  {#if preview.data?.content}
    <!--
      Render your Lexical rich text content here.
      The raw content is a Lexical JSON object — use a Lexical-to-HTML
      converter or the @payloadcms/richtext-lexical helpers for rendering.
    -->
    <div class="prose prose-lg">
      <p class="text-gray-400 italic text-sm">
        [Rich text content — add your Lexical renderer here]
      </p>
    </div>
  {/if}
</article>
