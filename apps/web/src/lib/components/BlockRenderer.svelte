<script lang="ts">
  import Hero from './sections/Hero.svelte'
  import Ingredients from './sections/Ingredients.svelte'
  import PhotoStrip from './sections/PhotoStrip.svelte'
  import StatementBanner from './sections/StatementBanner.svelte'
  import Locations from './sections/Locations.svelte'
  import Social from './sections/Social.svelte'
  import TickerBanner from './ui/TickerBanner.svelte'
  import type { Page, TickerBannerBlock } from '$lib/payload'
  import Banner from './ui/Banner.svelte'
  import Signup from './sections/Signup.svelte'
  import Polaroids from './sections/Polaroids.svelte'
  import Map from './sections/Map.svelte'
  import Toolkit from './sections/Toolkit.svelte'

  type Props = {
    blocks: Page['layout']
  }

  let { blocks }: Props = $props()
</script>

{#if blocks?.length}
  {#each blocks as block (block.id ?? block.blockType)}
    {#if block.blockType === 'hero'}
      <Hero {block} />
    {:else if block.blockType === 'ingredients'}
      <Ingredients {block} />
    {:else if block.blockType === 'photo-strip'}
      <PhotoStrip {block} />
    {:else if block.blockType === 'statement-banner'}
      <StatementBanner {block} />
    {:else if block.blockType === 'locations'}
      <Locations {block} />
    {:else if block.blockType === 'signup'}
      <Signup {block} />
    {:else if block.blockType === 'social'}
      <Social {block} />
    {:else if block.blockType === 'ticker-banner'}
      {@const tb = block as TickerBannerBlock}
      <TickerBanner
        variant={tb.variant ?? 'red'}
        items={(tb.items ?? []).map((i) => i.text).filter(Boolean)}
      />
    {:else if block.blockType === 'polaroids'}
      <Polaroids {block} />
    {:else if block.blockType === 'map'}
      <Map {block} />
    {:else if block.blockType === 'checker-divider'}
      <Banner variant={block.variant ?? undefined} />
    {:else if block.blockType === 'toolkit'}
      <Toolkit {block} />
    {/if}
  {/each}
{/if}
