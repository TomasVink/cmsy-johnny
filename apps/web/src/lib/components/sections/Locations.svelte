<script lang="ts">
  import { onMount } from 'svelte'
  import { env } from '$env/dynamic/public'
  import { browser } from '$app/environment'
  import type { LocationsBlock } from '$lib/payload'

  type Props = { block: LocationsBlock }
  let { block }: Props = $props()

  let mapEl: HTMLDivElement | undefined = $state()
  let mapReady = $state(false)

  // Load HERE Maps SDK scripts sequentially
  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
      const s = document.createElement('script')
      s.src = src
      s.onload = () => resolve()
      s.onerror = reject
      document.head.appendChild(s)
    })
  }

  function loadStyle(href: string) {
    if (document.querySelector(`link[href="${href}"]`)) return
    const l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = href
    document.head.appendChild(l)
  }

  onMount(() => {
    if (!browser || !mapEl) return

    const apiKey = env.PUBLIC_HERE_API_KEY
    if (!apiKey) {
      console.warn('Locations map: PUBLIC_HERE_API_KEY is not set.')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null

    const base = 'https://js.api.here.com/v3/3.1'
    loadStyle(`${base}/mapsjs-ui.css`)

    const init = async () => {
      await loadScript(`${base}/mapsjs-core.js`)
      await loadScript(`${base}/mapsjs-service.js`)
      await loadScript(`${base}/mapsjs-ui.js`)
      await loadScript(`${base}/mapsjs-mapevents.js`)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const H = (window as any).H
      if (!H || !mapEl) return

      const platform = new H.service.Platform({ apikey: apiKey })
      const defaultLayers = platform.createDefaultLayers()

      map = new H.Map(mapEl, defaultLayers.vector.normal.map, {
        zoom: 8,
        center: { lat: 50.85, lng: 4.35 }, // Belgium center
      })

      const mapEvents = new H.mapevents.MapEvents(map)
      new H.mapevents.Behavior(mapEvents)
      H.ui.UI.createDefault(map, defaultLayers)

      // Add numbered markers
      const locations = block.locations ?? []
      locations.forEach((loc, i) => {
        if (loc.lat == null || loc.lng == null) return

        const svg = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="15" fill="#E8001C" stroke="white" stroke-width="2"/>
          <text x="16" y="21" text-anchor="middle" fill="white"
                font-family="sans-serif" font-size="13" font-weight="bold">${i + 1}</text>
        </svg>`

        const icon = new H.map.Icon(`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, {
          size: { w: 32, h: 32 },
          anchor: { x: 16, y: 16 },
        })

        map!.addObject(new H.map.Marker({ lat: loc.lat, lng: loc.lng }, { icon }))
      })

      // Fit map to markers if we have valid coords
      const validLocs = locations.filter((l) => l.lat != null && l.lng != null)
      if (validLocs.length > 1) {
        const group = new H.map.Group()
        validLocs.forEach((loc) => {
          group.addObject(new H.map.Marker({ lat: loc.lat, lng: loc.lng }))
        })
        map!.addObject(group)
        map!.getViewModel().setLookAtData({ bounds: group.getBoundingBox() }, true)
      }

      mapReady = true
    }

    init()

    return () => map?.dispose()
  })
</script>

<!-- Checker stripe above -->
<div class="checker-stripe"></div>

<section id={block.sectionId ?? 'vind-een-frituur'} class="bg-[#FAF6EE] py-20 px-4">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-12">
      <p class="text-brand-red font-display text-xs tracking-[0.3em] uppercase mb-3">
        · vind een frituur
      </p>
      {#if block.title}
        <h2 class="font-display text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-none">
          {block.title}
        </h2>
      {/if}
      {#if block.subtitle}
        <p class="font-body text-gray-500 mt-4 max-w-lg">{block.subtitle}</p>
      {/if}
    </div>

    <div class="grid md:grid-cols-2 gap-10 items-start">
      <!-- Map -->
      <div
        bind:this={mapEl}
        class="w-full h-105 rounded-2xl overflow-hidden bg-gray-100"
        class:opacity-0={!mapReady}
        style="transition: opacity 0.3s"
      ></div>

      <!-- Location list -->
      <div class="space-y-6">
        {#each block.locations ?? [] as loc, i}
          <div class="flex gap-4 items-start">
            <span
              class="shrink-0 w-8 h-8 rounded-full bg-brand-red text-white font-display
                     text-sm font-bold flex items-center justify-center"
            >
              {i + 1}
            </span>
            <div>
              <h3 class="font-display text-base font-black uppercase">{loc.name}</h3>
              {#if loc.address}
                <p class="font-body text-gray-500 text-sm">{loc.address}{#if loc.city}, {loc.city}{/if}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
