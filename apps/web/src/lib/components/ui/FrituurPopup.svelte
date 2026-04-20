<script lang="ts">
  import type { FrituurApplication } from '@repo/payload-types'
  import SocialIcon from './SocialIcon.svelte'

  let {
    frituurName,
    address,
    postcode,
    city,
    url,
    urlType,
    handle
  }: Pick<
    FrituurApplication,
    'frituurName' | 'address' | 'postcode' | 'city' | 'email' | 'urlType' | 'url' | 'handle'
  > = $props()

  const linkText = $derived(handle || url)
</script>

<div class="font-display min-w-44 p-1 space-y-0.5">
  <p class="text-2xl font-black uppercase text-brand-dark">{frituurName}</p>
  <p class="text-lg text-brand-muted">{address}</p>
  <p class="text-lg text-brand-muted">{postcode} {city}</p>
  {#if url && linkText}
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-1 text-lg text-brand-red hover:text-brand-dark transition-colors mt-4"
    >
      <SocialIcon platform={urlType ?? 'website'} class="w-6" />
      <span>{linkText}</span>
    </a>
  {/if}
</div>
