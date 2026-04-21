<script lang="ts">
  type Props = { title: string; subtitle?: string | null; variant?: 'light' | 'dark'; [key: string]: unknown }
  let { title, subtitle, variant = 'light' }: Props = $props()
</script>

<div class="flex flex-col gap-1 w-full">
  {#if subtitle}
    <p
      class="font-display font-black {variant === 'light'
        ? 'text-brand-red'
        : 'text-brand-yellow'} text-4 tracking-[5px] uppercase"
    >
      ✦ {subtitle}
    </p>
  {/if}
  <h2
    class="font-script {variant === 'light'
      ? 'text-brand-dark'
      : 'text-brand-cream'} uppercase text-5xl whitespace-pre-line leading-normal"
  >
    {title}
  </h2>
</div>
