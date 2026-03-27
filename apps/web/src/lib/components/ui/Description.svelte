<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = { children: Snippet };

  let { children }: Props = $props();
</script>

<p
  class="font-display font-bold text-brand-muted text-4.2 leading-[27.72px] mb-4"
>
  {@render children()}
</p>
