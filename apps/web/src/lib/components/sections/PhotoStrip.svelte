<script lang="ts">
  import { env } from '$env/dynamic/public'
  import type { PhotoStripBlock } from '$lib/payload'
  import type { Media } from '@repo/payload-types'
  import HardShadowFrame from '$lib/components/ui/HardShadowFrame.svelte'
  import Section from '../ui/Section.svelte'

  type Props = { block: PhotoStripBlock }
  let { block }: Props = $props()

  function imageUrl(img: number | Media): string | null {
    if (typeof img === 'number') return null
    if (img.url) return img.url.startsWith('http') ? img.url : `${env.PUBLIC_PAYLOAD_URL}${img.url}`
    if (img.filename) return `${env.PUBLIC_PAYLOAD_URL}/api/media/file/${img.filename}`
    return null
  }
</script>

<Section id="">
  <div class="grid grid-cols-1 sm:grid-cols-4 gap-8 px-8 sm:px-0">
    {#each block.photos as photo}
      {@const src = imageUrl(photo.image)}
      {#if src}
        <div class="flex flex-col gap-4">
          <HardShadowFrame shadow="lg">
            <img
              {src}
              alt={typeof photo.image === 'object' ? photo.image.alt : ''}
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
