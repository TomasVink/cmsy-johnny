<script lang="ts">
  import { onMount, mount, unmount } from 'svelte'
  import { env } from '$env/dynamic/public'
  import { browser } from '$app/environment'
  import type { MapBlock } from '$lib/payload'
  import HardShadowFrame from '$lib/components/ui/HardShadowFrame.svelte'
  import FrituurPopup from '$lib/components/ui/FrituurPopup.svelte'
  import Section from '../ui/Section.svelte'
  import SectionTitle from '../ui/SectionTitle.svelte'
  import Description from '../ui/Description.svelte'

  type Frituur = {
    id: number
    frituurName: string
    name: string
    address?: string | null
    postcode?: string | null
    city?: string | null
    email?: string | null
    urlType?: ('website' | 'instagram' | 'facebook' | 'tiktok') | null
    url?: string | null
    handle?: string | null
    gps?: { lat?: number | null; lng?: number | null } | null
  }

  type Cluster = { lat: number; lng: number; members: Frituur[] }

  type Props = { block: MapBlock }
  let { block }: Props = $props()

  let mapEl: HTMLDivElement | undefined = $state()
  let mapReady = $state(false)
  let showScrollHint = $state(false)
  let isMac = $state(false)

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }
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

  async function fetchFrituren(): Promise<Frituur[]> {
    const url = `${env.PUBLIC_PAYLOAD_URL}/api/frituur-applications?where[visible][equals]=true&limit=200`
    try {
      const res = await fetch(url)
      if (!res.ok) return []
      const data = await res.json()
      return (data.docs as Frituur[]).filter((f) => f.gps?.lat != null && f.gps?.lng != null)
    } catch {
      return []
    }
  }

  // Pixel distance threshold for clustering — increase to cluster more aggressively,
  // decrease to keep markers separate at lower zoom levels.
  const CLUSTER_EPS = 24

  // Group points whose screen positions are within `eps` pixels of each other.
  function computeClusters(frituren: Frituur[], map: H.Map, eps = CLUSTER_EPS): Cluster[] {
    const assigned = new Array(frituren.length).fill(false)
    const clusters: Cluster[] = []

    for (let i = 0; i < frituren.length; i++) {
      if (assigned[i]) continue
      const f = frituren[i]
      const screenA = map.geoToScreen({ lat: f.gps!.lat!, lng: f.gps!.lng! })!
      const members: Frituur[] = [f]
      assigned[i] = true

      for (let j = i + 1; j < frituren.length; j++) {
        if (assigned[j]) continue
        const g = frituren[j]
        const screenB = map.geoToScreen({ lat: g.gps!.lat!, lng: g.gps!.lng! })!
        const dx = screenA.x - screenB.x
        const dy = screenA.y - screenB.y
        if (Math.sqrt(dx * dx + dy * dy) < eps) {
          members.push(g)
          assigned[j] = true
        }
      }

      const lat = members.reduce((s, m) => s + m.gps!.lat!, 0) / members.length
      const lng = members.reduce((s, m) => s + m.gps!.lng!, 0) / members.length
      clusters.push({ lat, lng, members })
    }

    return clusters
  }

  const markerSvg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#bb2025" stroke="#1a1208" stroke-width="3"/>
    <text x="20" y="26" text-anchor="middle" fill="white"
          font-family="'Barlow Condensed',sans-serif" font-size="16" font-weight="900">J</text>
  </svg>`

  function clusterSvg(count: number) {
    return `<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="21" fill="#bb2025" stroke="#1a1208" stroke-width="3"/>
      <circle cx="24" cy="24" r="14" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/>
      <text x="24" y="29" text-anchor="middle" fill="white"
            font-family="'Barlow Condensed',sans-serif" font-size="14" font-weight="900">${count}</text>
    </svg>`
  }

  onMount(() => {
    if (!browser || !mapEl) return

    const apiKey = env.PUBLIC_HERE_API_KEY
    if (!apiKey) {
      console.warn('Map block: PUBLIC_HERE_API_KEY is not set.')
      return
    }

    let map: H.Map | null = null
    let scrollHintTimer: ReturnType<typeof setTimeout> | null = null
    let popupInstances: ReturnType<typeof mount>[] = []

    isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
    function onWheel(e: WheelEvent) {
      if (!(isMac ? e.metaKey : e.ctrlKey)) {
        e.stopPropagation()
        showScrollHint = true
        if (scrollHintTimer) clearTimeout(scrollHintTimer)
        scrollHintTimer = setTimeout(() => {
          showScrollHint = false
        }, 1500)
      }
    }
    mapEl.addEventListener('wheel', onWheel, true)

    const base = 'https://js.api.here.com/v3/3.1'
    loadStyle(`${base}/mapsjs-ui.css`)

    const init = async () => {
      await loadScript(`${base}/mapsjs-core.js`)
      await loadScript(`${base}/mapsjs-service.js`)
      await loadScript(`${base}/mapsjs-ui.js`)
      await loadScript(`${base}/mapsjs-mapevents.js`)

      if (!mapEl) return

      const platform = new H.service.Platform({ apikey: apiKey })
      const defaultLayers = platform.createDefaultLayers()

      map = new H.Map(mapEl, defaultLayers.vector.normal.map, {
        zoom: 8,
        center: { lat: 50.85, lng: 4.35 }
      })

      const mapEvents = new H.mapevents.MapEvents(map)
      new H.mapevents.Behavior(mapEvents)
      const ui = H.ui.UI.createDefault(map, defaultLayers)
      ui.getControl('mapsettings')?.setVisibility(false)

      const frituren = await fetchFrituren()

      const noiseIcon = new H.map.Icon(
        `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`,
        { size: { w: 40, h: 40 }, anchor: { x: 20, y: 20 } }
      )

      const markersGroup = new H.map.Group()
      map.addObject(markersGroup)

      function renderMarkers() {
        markersGroup.removeAll()

        for (const cluster of computeClusters(frituren, map!)) {
          let marker: H.map.Marker

          if (cluster.members.length > 1) {
            const icon = new H.map.Icon(
              `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(clusterSvg(cluster.members.length))}`,
              { size: { w: 48, h: 48 }, anchor: { x: 24, y: 24 } }
            )
            marker = new H.map.Marker({ lat: cluster.lat, lng: cluster.lng }, { icon })
            marker.setData({ type: 'cluster', cluster })
          } else {
            const f = cluster.members[0]
            marker = new H.map.Marker({ lat: f.gps!.lat!, lng: f.gps!.lng! }, { icon: noiseIcon })
            marker.setData({ type: 'noise', frituur: f })
          }

          markersGroup.addObject(marker)
        }
      }

      // Re-cluster on every zoom/pan end
      map.addEventListener('mapviewchangeend', renderMarkers)

      markersGroup.addEventListener('tap', (evt: H.util.Event) => {
        const target = evt.target as H.map.Marker
        const data = target?.getData?.() as
          | { type: 'cluster'; cluster: Cluster }
          | { type: 'noise'; frituur: Frituur }
          | undefined
        if (!data) return

        if (data.type === 'cluster') {
          const { lat, lng } = data.cluster
          map!
            .getViewModel()
            .setLookAtData(
              { position: { lat, lng }, zoom: Math.min(map!.getZoom() + 3, 16) },
              false
            )
        } else {
          const f = data.frituur
          ui.getBubbles().forEach((b) => ui.removeBubble(b))
          popupInstances.forEach((i) => unmount(i))
          popupInstances = []

          const el = document.createElement('div')
          const instance = mount(FrituurPopup, {
            target: el,
            props: f
          })
          popupInstances.push(instance)
          ui.addBubble(new H.ui.InfoBubble({ lat: f.gps!.lat!, lng: f.gps!.lng! }, { content: el }))
        }
      })

      // cursor: pointer on any marker
      const viewportEl = map.getViewPort().element as HTMLElement
      map.addEventListener('pointermove', (evt: H.util.Event) => {
        const target = evt.target as H.map.Object | null
        viewportEl.style.cursor = target instanceof H.map.AbstractMarker ? 'pointer' : ''
      })

      // Fit initial viewport to all markers, then zoom out half a step so
      // markers at the edges aren't clipped by their own icon size.
      if (frituren.length > 1) {
        const boundsGroup = new H.map.Group()
        frituren.forEach((f) =>
          boundsGroup.addObject(new H.map.Marker({ lat: f.gps!.lat!, lng: f.gps!.lng! }))
        )
        map.addObject(boundsGroup)
        map.getViewModel().setLookAtData({ bounds: boundsGroup.getBoundingBox()! }, false)
        map.removeObject(boundsGroup)
      }

      renderMarkers()

      mapReady = true
    }

    init()

    return () => {
      popupInstances.forEach((i) => unmount(i))
      mapEl?.removeEventListener('wheel', onWheel, true)
      map?.dispose()
    }
  })
</script>

<Section id={block.sectionId ?? ''}>
  <SectionTitle {...block} />
  {#if block.description}
    <Description>
      {block.description}
    </Description>
  {/if}

  <div class="relative">
    <HardShadowFrame
      shadow="lg"
      class="w-full h-135"
      style="opacity: {mapReady ? 1 : 0}; transition: opacity 0.3s"
    >
      <div bind:this={mapEl} class="w-full h-full"></div>
    </HardShadowFrame>
    {#if showScrollHint}
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="bg-black/70 text-white font-display text-sm px-4 py-2 select-none">
          {isMac ? 'Hold ⌘ to zoom the map' : 'Hold Ctrl to zoom the map'}
        </div>
      </div>
    {/if}
  </div>
</Section>
