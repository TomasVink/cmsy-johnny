<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    id: string;
    children: Snippet;
    class?: string;
  };

  let { id, children, class: className = "" }: Props = $props();
</script>

<section {id} class={`px-8 my-16 max-w-273.5 mx-auto flex gap-4 ${className}`}>
  {@render children()}
</section>
