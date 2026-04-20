<script lang="ts">
  import type { SocialBlock } from '$lib/payload'
  import Section from '../ui/Section.svelte'
  import SectionTitle from '../ui/SectionTitle.svelte'
  import { socialIcons } from '$lib/utils/socialIcons'

  type Props = { block: SocialBlock }
  let { block }: Props = $props()

  const platformLabels: Record<string, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
    twitter: 'Twitter / X',
    youtube: 'YouTube'
  }
</script>

<Section id={block.sectionId ?? 'social'} class="bg-brand-red py-20 px-4">
  <SectionTitle {...block} variant="dark" />
  <!-- Header -->
  {#if block.description}
    <p class="text-white/60 my-4 font-bold text-2xl">{block.description}</p>
  {/if}

  <!-- Social cards -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each block.accounts ?? [] as account}
      <a
        href={account.url}
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10
                 border border-white/10 rounded-2xl p-6 transition-colors group"
      >
        <div class="w-10 h-10 text-white group-hover:text-brand-yellow transition-colors">
          {@html socialIcons[account.platform as keyof typeof socialIcons] ?? ''}
        </div>
        <div class="text-center">
          <p class="font-display text-white text-3xl font-bold uppercase">
            {platformLabels[account.platform] ?? account.platform}
          </p>
          <p class="text-white/50 font-semibold text-xl mt-0.5">{account.handle}</p>
        </div>
      </a>
    {/each}
  </div>
</Section>
