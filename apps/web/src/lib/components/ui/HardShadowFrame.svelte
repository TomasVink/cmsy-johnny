<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    shadow?: 'sm' | 'lg'
    class?: string
    style?: string
    children?: Snippet
  }

  let { shadow = 'sm', class: className = '', style = '', children }: Props = $props()
</script>

<div
  class="rounded-1 overflow-hidden border-2 border-brand-dark/15 {className}"
  style="box-shadow: var({shadow === 'sm' ? '--shadow-hard-sm' : '--shadow-hard'}); {style}"
>
  {@render children?.()}
</div>
