<script lang="ts">
  import { socialIcons, type SocialPlatform } from '$lib/utils/socialIcons'

  type Props = { platform: SocialPlatform | string; class?: string }
  let { platform, class: className = '' }: Props = $props()
</script>

<span class={className}>
  {@html socialIcons[platform as SocialPlatform] ?? socialIcons.website}
</span>
