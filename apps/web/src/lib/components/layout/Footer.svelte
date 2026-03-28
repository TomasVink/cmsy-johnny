<script lang="ts">
  import type { SiteSettings } from '$lib/payload'
  import Banner from '../ui/Banner.svelte'
  import { localizeHref } from '$lib/utils'

  type Props = {
    settings: SiteSettings
    locale: string
  }

  let { settings, locale }: Props = $props()

  const footerLinks = $derived(settings.footerLinks ?? [])
</script>

<footer>
  {#if settings.footerImage}
    <div class="bg-brand-red pt-12">
      <img
        src={settings.footerImage?.url}
        alt={settings.footerImage?.alt}
        class="max-w-5xl mx-auto w-full"
      />
    </div>
  {/if}
  <Banner variant="black" />
  <!-- Bottom bar -->
  <div class="bg-brand-dark">
    <div
      class="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <!-- Logo -->
      <a href="/{locale}" class="shrink-0">
        {#if settings.logo && typeof settings.logo === 'object' && settings.logo.url}
          <img src={settings.logo.url} alt="Here's Johnny" class="h-8 w-auto brightness-0 invert" />
        {:else}
          <span class="font-script text-white text-xl">Here's Johnny!</span>
        {/if}
      </a>

      <!-- Footer links -->
      <nav aria-label="Footer navigation">
        <ul class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 list-none m-0 p-0">
          {#each footerLinks as link}
            <li>
              <a
                href={localizeHref(link.href, locale)}
                class="text-white/60 font-body text-xs uppercase tracking-widest
                       hover:text-white transition-colors"
              >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>
  </div>
  <Banner variant="black" />
</footer>
