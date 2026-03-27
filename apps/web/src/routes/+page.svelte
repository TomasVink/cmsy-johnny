<script lang="ts">
  import type { PageData } from './$types'
  import Nav from '$lib/components/layout/Nav.svelte'
  import Footer from '$lib/components/layout/Footer.svelte'
  import BlockRenderer from '$lib/components/BlockRenderer.svelte'

  let { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>{data.page?.seo?.title ?? data.page?.title ?? "Here's Johnny!"}</title>
  {#if data.page?.seo?.description}
    <meta name="description" content={data.page.seo.description} />
  {/if}
</svelte:head>

<Nav settings={data.settings} />

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<BlockRenderer blocks={((data.page as any)?.layout) ?? []} />

<Footer settings={data.settings} />
