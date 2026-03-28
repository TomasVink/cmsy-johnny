<script lang="ts">
  import type { SiteSettings } from '$lib/payload'
  import Banner from '$lib/components/ui/Banner.svelte'
  import { localizeHref } from '$lib/utils'
  import { page } from '$app/stores'

  type Props = {
    settings: SiteSettings
    locale: string
  }

  let { settings, locale }: Props = $props()

  let menuOpen = $state(false)

  const navLinks = $derived(settings.navLinks ?? [])
  const cta = $derived(settings.navCta)

  const locales = ['nl', 'fr'] as const

  function switchLocalHref(target: string): string {
    return $page.url.pathname.replace(/^\/(nl|fr)/, `/${target}`)
  }
</script>

<!-- Checker strip at very top of page -->
<Banner variant="red" />

<header class="sticky top-0 z-50">
  <nav class="bg-brand-cream border-b-2 border-brand-dark">
    <div class="max-w-273.5 mx-auto px-10 flex items-center justify-between h-13">
      <!-- Logo -->
      <a href="/{locale}" class="shrink-0 leading-none">
        {#if settings.logo && typeof settings.logo === 'object' && settings.logo.url}
          <img src={settings.logo.url} alt="Here's Johnny!" class="h-10 w-auto" />
        {:else}
          <!-- Fallback text logo while no image is uploaded -->
          <span class="font-script text-brand-dark text-2xl leading-none">Here's Johnny!</span>
        {/if}
      </a>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-8">
        <ul class="flex items-center gap-8 list-none m-0 p-0">
          {#each navLinks as link}
            <li>
              <a
                href={localizeHref(link.href, locale)}
                class="font-display font-black not-italic text-brand-dark text-3
                       tracking-[3px] uppercase hover:text-brand-red transition-colors"
              >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>

        <!-- Language switcher -->
        <div class="flex items-center gap-2">
          {#each locales as loc}
            <a
              href={switchLocalHref(loc)}
              class="font-display font-black not-italic text-3 tracking-[3px] uppercase transition-colors
                     {loc === locale ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'}"
            >
              {loc}
            </a>
            {#if loc !== locales[locales.length - 1]}
              <span class="text-brand-dark/40 text-3">/</span>
            {/if}
          {/each}
        </div>

        <!-- CTA button -->
        {#if cta?.href}
          <a
            href={localizeHref(cta.href, locale)}
            class="inline-flex items-center px-5.5 py-2 rounded-0.75
                 bg-brand-red text-brand-cream font-display font-black not-italic
                 text-3 tracking-[3px] uppercase
                 hover:brightness-110 transition-all"
          >
            {cta.label}
          </a>
        {/if}
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden flex flex-col gap-1.5 p-2"
        onclick={() => (menuOpen = !menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        <span
          class="block w-6 h-0.5 bg-brand-dark transition-transform"
          class:rotate-45={menuOpen}
          class:translate-y-2={menuOpen}
        ></span>
        <span class="block w-6 h-0.5 bg-brand-dark transition-opacity" class:opacity-0={menuOpen}
        ></span>
        <span
          class="block w-6 h-0.5 bg-brand-dark transition-transform"
          class:-rotate-45={menuOpen}
          class:-translate-y-2={menuOpen}
        ></span>
      </button>
    </div>

    <!-- Mobile menu -->
    {#if menuOpen}
      <div class="md:hidden bg-brand-cream border-t border-brand-dark/20">
        <ul class="list-none m-0 p-0 px-10 py-6 flex flex-col gap-5">
          {#each navLinks as link}
            <li>
              <a
                href={localizeHref(link.href, locale)}
                class="font-display font-black not-italic text-brand-dark text-3
                       tracking-[3px] uppercase hover:text-brand-red transition-colors"
                onclick={() => (menuOpen = false)}
              >
                {link.label}
              </a>
            </li>
          {/each}
          {#if cta?.href}
            <li>
              <a
                href={localizeHref(cta.href, locale)}
                class="inline-flex items-center px-5.5 py-2 rounded-0.75
                       bg-brand-red text-brand-cream font-display font-black not-italic
                       text-3 tracking-[3px] uppercase"
                onclick={() => (menuOpen = false)}
              >
                {cta.label}
              </a>
            </li>
          {/if}
          <li>
            <div class="flex items-center gap-2">
              {#each locales as loc}
                <a
                  href={switchLocalHref(loc)}
                  class="font-display font-black not-italic text-3 tracking-[3px] uppercase transition-colors
                         {loc === locale ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'}"
                  onclick={() => (menuOpen = false)}
                >
                  {loc}
                </a>
                {#if loc !== locales[locales.length - 1]}
                  <span class="text-brand-dark/40 text-3">/</span>
                {/if}
              {/each}
            </div>
          </li>
        </ul>
      </div>
    {/if}
  </nav>
</header>
