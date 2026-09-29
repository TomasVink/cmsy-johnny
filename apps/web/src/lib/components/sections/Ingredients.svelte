<script lang="ts">
  import type { IngredientsBlock } from '$lib/payload'
  import { mediaUrl, mediaDimensions } from '$lib/payload'
  import HardShadowFrame from '$lib/components/ui/HardShadowFrame.svelte'
  import Section from '../ui/Section.svelte'
  import SectionTitle from '../ui/SectionTitle.svelte'
  import Description from '../ui/Description.svelte'

  type Props = { block: IngredientsBlock }
  let { block }: Props = $props()

  const src = $derived(mediaUrl(block.image, 'tablet'))
  const size = $derived(mediaDimensions(block.image, 'tablet'))
  const altText = $derived(typeof block.image === 'object' && block.image ? block.image.alt : '')
</script>

<Section id={block.sectionId ?? ''}>
  <SectionTitle {...block} />

  <!-- Two-column: image + content -->
  <div class="grid md:grid-cols-2 gap-15 items-start">
    <!-- Image with hard shadow -->
    {#if src}
      <HardShadowFrame shadow="lg" class="bg-brand-cream-dark">
        <img
          {src}
          alt={altText}
          width={size?.width}
          height={size?.height}
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover block"
        />
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
