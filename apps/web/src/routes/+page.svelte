<script lang="ts">
  import type { PageData } from './$types'
  import { PUBLIC_PAYLOAD_URL } from '$env/static/public'

  let { data }: { data: PageData } = $props()
</script>

<main class="container mx-auto px-4 py-16 max-w-2xl">
  <div class="mb-12">
    <h1 class="text-3xl font-bold mb-2">SvelteKit + Payload CMS</h1>
    <p class="text-gray-500">Headless CMS demo with live preview.</p>
  </div>

  <section class="mb-12">
    <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Pages</h2>
    {#if data.pages.length > 0}
      <ul class="space-y-2">
        {#each data.pages as page}
          <li>
            <a href="/{page.slug}" class="text-lg hover:underline underline-offset-4">
              {page.title}
            </a>
            {#if page.seo?.description}
              <p class="text-sm text-gray-500 mt-0.5">{page.seo.description}</p>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-400">No pages yet — create one in the CMS.</p>
    {/if}
  </section>

  <a
    href="{PUBLIC_PAYLOAD_URL}/admin"
    class="text-sm text-gray-400 hover:text-black transition-colors"
    target="_blank"
    rel="noreferrer"
  >
    Open CMS Admin →
  </a>
</main>
