<script lang="ts">
  import type { HTMLInputAttributes, HTMLAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'

  type Props = HTMLInputAttributes & {
    label: string
    id: string
    error?: boolean
    el?: HTMLInputElement
    class?: HTMLAttributes<HTMLDivElement>['class']
    children?: Snippet
  }

  let {
    label,
    id,
    error = false,
    el = $bindable(),
    value = $bindable(),
    children,
    class: className = '',
    ...rest
  }: Props = $props()
</script>

<div class={className}>
  <label class="block font-display text-xs uppercase tracking-widest mb-1" for={id}>
    {label}
  </label>
  <div class="relative">
    <input
      {id}
      bind:value
      bind:this={el}
      class="w-full border rounded-lg px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-red
             {error ? 'border-brand-red' : 'border-brand-dark/20'}"
      {...rest}
    />
    {@render children?.()}
  </div>
  {#if error}
    <p class="text-brand-red font-body text-xs mt-1">verplicht veld</p>
  {/if}
</div>
