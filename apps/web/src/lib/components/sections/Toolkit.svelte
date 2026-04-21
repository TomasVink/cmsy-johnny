<script lang="ts">
  import { env } from '$env/dynamic/public'
  import type { Media } from '@repo/payload-types'
  import type { ToolkitBlock } from '$lib/payload'
  import Section from '../ui/Section.svelte'
  import SectionTitle from '../ui/SectionTitle.svelte'
  import Description from '../ui/Description.svelte'

  type Props = { block: ToolkitBlock }
  let { block }: Props = $props()

  function fileUrl(file: number | Media): string | null {
    if (typeof file === 'number') return null
    if (file.url)
      return file.url.startsWith('http') ? file.url : `${env.PUBLIC_PAYLOAD_URL}${file.url}`
    if (file.filename) return `${env.PUBLIC_PAYLOAD_URL}/api/media/file/${file.filename}`
    return null
  }

  function isImage(file: number | Media): boolean {
    if (typeof file === 'number') return false
    return file.mimeType?.startsWith('image/') ?? false
  }

  function filename(file: number | Media): string {
    if (typeof file === 'number') return 'download'
    return file.filename ?? 'download'
  }

  async function handleDownload(e: MouseEvent, url: string, name: string) {
    e.preventDefault()
    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = name
    a.click()
    URL.revokeObjectURL(a.href)
  }
</script>

<Section id="toolkit">
  <SectionTitle {...block} />
  {#if block.description}
    <Description>
      {block.description}
    </Description>
  {/if}
  <ul class="flex flex-col gap-2 list-none p-0 m-0">
    {#each block.items as item}
      {@const url = fileUrl(item.file)}
      {#if url}
        <li>
          <a
            href={url}
            onclick={(e) => handleDownload(e, url, filename(item.file))}
            class="flex items-center gap-4 my-2 text-xl hover:underline hover:text-brand-red"
          >
            {#if isImage(item.file)}
              <img src={url} alt={item.title} class="w-24 h-24 object-cover rounded shrink-0" />
            {/if}
            <span>{item.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 3v13M7 11l5 5 5-5" />
              <path d="M5 20h14" />
            </svg>
          </a>
        </li>
      {/if}
    {/each}
  </ul>
</Section>
