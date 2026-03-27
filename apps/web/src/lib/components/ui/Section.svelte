<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    id: string
    children: Snippet
    class?: string
  }

  let { id, children, class: className = 'my-16' }: Props = $props()
</script>

<section {id} class={className}>
  <div class="px-4 max-w-5xl mx-auto">
    {@render children()}
  </div>
</section>
