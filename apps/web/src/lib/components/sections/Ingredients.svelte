<script lang="ts">
  import { env } from '$env/dynamic/public'
  import type { IngredientsBlock } from '$lib/payload'
  import type { Media } from '@repo/payload-types'
  import HardShadowFrame from '$lib/components/ui/HardShadowFrame.svelte'
  import Section from '../ui/Section.svelte'
  import SectionTitle from '../ui/SectionTitle.svelte'
  import Description from '../ui/Description.svelte'

  type Props = { block: IngredientsBlock }
  let { block }: Props = $props()

  function imageUrl(img: number | Media | null | undefined): string | null {
    if (!img || typeof img === 'number') return null
    if (img.url) return img.url.startsWith('http') ? img.url : `${env.PUBLIC_PAYLOAD_URL}${img.url}`
    if (img.filename) return `${env.PUBLIC_PAYLOAD_URL}/api/media/file/${img.filename}`
    return null
  }

  const src = $derived(imageUrl(block.image))
  const altText = $derived(typeof block.image === 'object' && block.image ? block.image.alt : '')
</script>

<Section id={block.sectionId ?? ''}>
  <SectionTitle {...block} />

  <!-- Two-column: image + content -->
  <div class="grid md:grid-cols-2 gap-15 items-start">
    <!-- Image with hard shadow -->
    {#if src}
      <HardShadowFrame shadow="lg" class="bg-brand-cream-dark">
        <img {src} alt={altText} class="w-full h-full object-cover block" />
      </HardShadowFrame>
    {:else}
      <!-- Placeholder when no image uploaded yet -->
      <HardShadowFrame shadow="lg" class="bg-brand-cream-dark aspect-3/4" />
    {/if}

    <!-- Content -->
    <div class="flex flex-col gap-4 pt-2">
      {#if block.description}
        <Description>
          {block.description}
        </Description>
      {/if}

      {#if block.items?.length}
        <ol class="list-none p-0 m-0">
          {#each block.items as item, i}
            <li
              class="flex gap-5.5 items-center py-[1.5px]
                       border-t-[1.5px] border-brand-dark/15"
              class:border-b-[1.5px]={i === block.items!.length - 1}
              style="border-color: rgba(26,18,8,0.15);"
            >
              <!-- Number — Alfa Slab One -->
              <span class="font-slab text-brand-red text-4xl w-10">
                {item.number}
              </span>

              <!-- Title + description -->
              <div class="flex flex-col gap-0.5 py-4">
                <h3
                  class="font-display font-black italic text-brand-dark uppercase
                           text-3xl leading-none"
                >
                  {item.title}
                </h3>
                {#if item.description}
                  <p class="font-display font-bold text-brand-muted text-3.6 leading-normal">
                    {item.description}
                  </p>
                {/if}
              </div>
            </li>
          {/each}
        </ol>
      {/if}
    </div>
  </div>
</Section>
