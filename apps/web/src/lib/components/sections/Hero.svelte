<script lang="ts">
  import type { HeroBlock } from '$lib/payload'
  import Section from '../ui/Section.svelte'

  type Props = { block: HeroBlock }
  let { block }: Props = $props()

  const headlineMedia = $derived(typeof block.headline === 'object' ? block.headline : null)

  // Split tagline on "·" or "+" so separators can be rendered at reduced opacity
  const taglineParts = $derived(
    block.tagline
      ? block.tagline
          .split(/\s*[·+]\s*/)
          .map((p) => p.trim())
          .filter(Boolean)
      : []
  )
</script>

<Section id="" class="bg-brand-red py-8 relative overflow-hidden">
  <img
    src="/sunburst.svg"
    alt=""
    aria-hidden="true"
    class="absolute pointer-events-none select-none max-w-none -bottom-12 lg:-bottom-24"
    style="
      width: 120vmax;
      left: 50%;
      animation: sunburst-spin 360s linear infinite;
    "
  />

  <!-- Headline image (uploaded via CMS) -->
  {#if headlineMedia}
    <img
      src={headlineMedia.url ?? ''}
      alt={headlineMedia.alt ?? ''}
      class="relative z-10 w-full max-w-146.5 mb-8 mx-auto"
    />
  {/if}

  <!-- Tagline — items in yellow, + separators in cream at 55% opacity -->
  {#if taglineParts.length}
    <p
      class="font-display font-black italic text-brand-yellow uppercase tracking-[2px]
             text-[clamp(1rem,2.5vw,1.75rem)] flex flex-wrap items-center
             justify-center gap-x-2 mb-10 relative z-10"
    >
      {#each taglineParts as part, i}
        {#if i > 0}
          <span class="text-brand-cream opacity-55 not-italic">+</span>
        {/if}
        <span>{part}</span>
      {/each}
    </p>
  {/if}

  <!-- CTA Buttons -->
  {#if block.ctaButtons?.length}
    <div class="flex flex-wrap items-center justify-center gap-3 relative z-10">
      {#each block.ctaButtons as btn}
        {#if btn.variant === 'solid'}
          <!-- Solid: red bg + semi-transparent white border + cream text -->
          <a
            href={btn.href}
            class="inline-flex items-center px-8 py-3.25 rounded-0.75
                   bg-brand-red border-2 border-white/40 text-brand-cream
                   font-display font-black not-italic text-3.25 tracking-[3px] uppercase
                   hover:brightness-110 transition-all"
          >
            {btn.label}
          </a>
        {:else}
          <!-- Outline: cream bg + cream border + red text -->
          <a
            href={btn.href}
            class="inline-flex items-center px-8 py-3.25 rounded-0.75
                   bg-brand-cream border-2 border-brand-cream text-brand-red
                   font-display font-black not-italic text-3.25 tracking-[3px] uppercase
                   hover:bg-transparent hover:text-brand-cream transition-all"
          >
            {btn.label}
          </a>
        {/if}
      {/each}
    </div>
  {/if}
</Section>
