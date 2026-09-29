<script lang="ts">
  import type { PhotoStripBlock } from '$lib/payload'
  import { mediaUrl } from '$lib/payload'
  import HardShadowFrame from '$lib/components/ui/HardShadowFrame.svelte'
  import Section from '../ui/Section.svelte'

  type Props = { block: PhotoStripBlock }
  let { block }: Props = $props()
</script>

<Section id="">
  <div class="grid grid-cols-1 sm:grid-cols-4 gap-8 px-8 sm:px-0">
    {#each block.photos as photo}
      {@const src = mediaUrl(photo.image, 'tablet')}
      {#if src}
        <div class="flex flex-col gap-4">
          <HardShadowFrame shadow="lg">
            <img
              {src}
              alt={typeof photo.image === 'object' ? photo.image.alt : ''}
              loading="lazy"
              decoding="async"
              class="w-full aspect-square object-cover block"
            />
          </HardShadowFrame>
          {#if photo.caption}
            <p class="font-display font-black text-brand-dark text-lg tracking-[3px] uppercase">
              {photo.caption}
            </p>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
</Section>
