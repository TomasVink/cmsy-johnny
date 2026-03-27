<script lang="ts">
  import { env } from '$env/dynamic/public'
  import type { Media } from '@repo/payload-types'
  import Section from '../ui/Section.svelte'

  // Local type until `bun payload generate:types` is run after adding the block to the CMS
  type PolaroidPhoto = {
    image: number | Media
    title?: string | null
    id?: string | null
  }
  type PolaroidsBlock = {
    blockType: 'polaroids'
    blockName?: string | null
    id?: string | null
    sectionId?: string | null
    photos: PolaroidPhoto[]
  }

  type Props = { block: PolaroidsBlock }
  let { block }: Props = $props()

  let topIndex = $state<number | null>(1)

  function imageUrl(img: number | Media): string | null {
    if (typeof img === 'number') return null
    if (img.url) return img.url.startsWith('http') ? img.url : `${env.PUBLIC_PAYLOAD_URL}${img.url}`
    if (img.filename) return `${env.PUBLIC_PAYLOAD_URL}/api/media/file/${img.filename}`
    return null
  }

  // Per-card rotation and small vertical nudge for a natural scattered look
  const cardStyle: Array<{ rotation: number; ty: number }> = [
    { rotation: -18, ty: -8 },
    { rotation: 12, ty: 5 },
    { rotation: -4, ty: -12 },
    { rotation: 15, ty: 8 },
    { rotation: -9, ty: 3 },
    { rotation: 20, ty: -5 },
    { rotation: -6, ty: 10 },
    { rotation: 11, ty: -3 }
  ]

  // Horizontal spread: evenly from -maxTx to +maxTx in screen space
  const maxTx = 130 // px

  function getTx(index: number, total: number): number {
    if (total <= 1) return 0
    return (index / (total - 1) - 0.5) * 2 * maxTx
  }

  function getZIndex(index: number): number {
    if (topIndex === index) return 100
    return index + 1
  }
</script>

<Section id={block.sectionId ?? 'polaroids'} class="bg-brand-red">
  <div class="polaroids-wrapper">
    {#each block.photos as photo, i}
      {@const src = imageUrl(photo.image)}
      {@const s = cardStyle[i % cardStyle.length]}
      {@const tx = getTx(i, block.photos.length)}
      {#if src}
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions a11y_no_noninteractive_element_interactions -->
        <div
          class="polaroid"
          class:is-top={topIndex === i}
          style="--rotation: {s.rotation}deg; --tx: {tx}px; --ty: {s.ty}px; z-index: {getZIndex(i)}"
          onmouseenter={() => (topIndex = i)}
          onclick={() => (topIndex = topIndex === i ? null : i)}
        >
          <div class="polaroid-inner">
            <div class="polaroid-photo">
              <img {src} alt={typeof photo.image === 'object' ? photo.image.alt : ''} />
            </div>
            <div class="polaroid-caption">
              <span>{photo.title}</span>
            </div>
          </div>
        </div>
      {/if}
    {/each}
  </div>
</Section>

<style>
  .polaroids-wrapper {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: visible;
  }

  .polaroid {
    position: absolute;
    left: 50%;
    top: 50%;
    width: clamp(160px, 50vw, 320px);
    /* Center card, spread horizontally, then rotate */
    transform: translate(-50%, -50%) translateX(var(--tx)) rotate(var(--rotation))
      translateY(var(--ty));
    cursor: pointer;
    transition: filter 0.25s ease;
  }

  .polaroid:hover,
  .polaroid.is-top {
    animation: polaroid-float 2.8s ease-in-out infinite;
    filter: drop-shadow(0px 16px 40px rgba(0, 0, 0, 0.4));
  }

  .polaroid-inner {
    background: white;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow:
      0px 8px 32px 0px rgba(0, 0, 0, 0.3),
      0px 2px 8px 0px rgba(0, 0, 0, 0.18);
    padding: 10px 10px 0;
  }

  .polaroid-photo {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
  }

  .polaroid-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
  }

  .polaroid-caption {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    overflow: hidden;
  }

  .polaroid-caption span {
    font-family: 'Cerline Rinande Script', serif;
    font-size: clamp(14px, 2vw, 20px);
    color: var(--color-brand-dark, #1a1208);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @keyframes polaroid-float {
    0%,
    100% {
      transform: translate(-50%, -50%) translateX(var(--tx)) rotate(var(--rotation))
        translateY(var(--ty));
    }
    35% {
      transform: translate(-50%, -50%) translateX(var(--tx)) rotate(calc(var(--rotation) + 1.5deg))
        translateY(calc(var(--ty) - 10px));
    }
    70% {
      transform: translate(-50%, -50%) translateX(var(--tx)) rotate(calc(var(--rotation) - 1deg))
        translateY(calc(var(--ty) - 5px));
    }
  }
</style>
