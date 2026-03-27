<script lang="ts">
  type Variant = "red" | "black" | "yellow";

  type Props = {
    variant?: Variant;
    items: string[];
    class?: string;
  };

  let { variant = "red", items, class: className = "" }: Props = $props();

  const bgClass: Record<Variant, string> = {
    red: "bg-brand-red",
    black: "bg-brand-dark",
    yellow: "bg-brand-yellow",
  };
</script>

<!--
  Ticker/marquee banner. Items are rendered 3× side-by-side so the strip
  loops seamlessly: when the first copy has scrolled fully out of view
  (−33.333%), the animation resets to 0 and the loop is invisible.
-->
<div
  class="overflow-hidden h-10 flex items-center {bgClass[variant]} {className}"
  role="marquee"
  aria-label="Ticker"
>
  <div
    class="flex items-center gap-0 shrink-0 whitespace-nowrap"
    style="animation: ticker-scroll 60s linear infinite;"
  >
    {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as _}
      <span
        class={`flex items-center font-display font-black italic  uppercase tracking-[3px] text-xs ${variant === "yellow" ? "text-brand-dark" : "text-brand-cream"}`}
      >
        {#each items as item, i}
          {#if i > 0}
            <span class=" mx-8" aria-hidden="true">✦</span>
          {/if}
          {item}
        {/each}
        <!-- separator between repetitions -->
        <span class=" mx-8" aria-hidden="true">✦</span>
      </span>
    {/each}
  </div>
</div>
