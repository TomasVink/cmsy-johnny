<script lang="ts">
  import { env } from '$env/dynamic/public'
  import type { StatementBannerBlock } from '$lib/payload'
  import type { Media } from '@repo/payload-types'
  import Section from '../ui/Section.svelte'
  import Banner from '../ui/Banner.svelte'

  type Props = { block: StatementBannerBlock }
  let { block }: Props = $props()

  function imageUrl(img: number | Media | null | undefined): string | null {
    if (!img || typeof img === 'number') return null
    if (img.url) return img.url.startsWith('http') ? img.url : `${env.PUBLIC_PAYLOAD_URL}${img.url}`
    if (img.filename) return `${env.PUBLIC_PAYLOAD_URL}/api/media/file/${img.filename}`
    return null
  }

  const src = $derived(imageUrl(block.image))
  const altText = $derived(typeof block.image === 'object' && block.image ? block.image.alt : '')

  function highlightStars(text: string): string {
    return text.replace(/\*([^*]+)\*/g, '<span class="text-brand-yellow">$1</span>')
  }
</script>

<Banner variant="red-yellow" />

<div
  class="relative flex flex-col items-center justify-center text-center
         px-6 overflow-hidden bg-brand-red"
>
  <!-- Spinning sunburst background -->
  <img
    src="/sunburst.svg"
    alt=""
    aria-hidden="true"
    class="absolute pointer-events-none select-none"
    style="
      width: 250vmax;
      height: auto;
      left: 50%;
      bottom: -8rem;
      animation: sunburst-spin 360s linear infinite;
    "
  />

  <Section id={block.id ?? ''}>
    <div class="flex items-center gap-8">
      <!-- Product image -->
      {#if src}
        <div class="shrink-0 w-96 flex-1">
          <img {src} alt={altText} class="w-full object-contain drop-shadow-2xl" />
        </div>
      {:else}
        <div class="shrink-0 w-96"></div>
      {/if}

      <!-- Text content -->
      <div class="flex-1 flex flex-col gap-4 text-center uppercase">
        {#if block.headline}
          <h2 class="font-script text-brand-cream text-[72px] leading-[0.84] whitespace-pre-line">
            {@html highlightStars(block.headline)}
          </h2>
        {/if}

        {#if block.subtitle}
          <p class="font-display font-black text-brand-yellow text-[12px] tracking-[5px]">
            {block.subtitle}
          </p>
        {/if}
      </div>
    </div>
  </Section>
</div>

<Banner variant="red-yellow" />
