<script lang="ts">
  type Props = { title: string; subtitle: string };
  let { title, subtitle }: Props = $props();
</script>

<div class="flex flex-col gap-1 w-full">
  <p
    class="font-display font-black text-brand-red text-4 tracking-[5px] uppercase"
  >
    ✦ {subtitle}
  </p>
  <h2
    class="font-script text-brand-dark uppercase text-5xl whitespace-pre-line leading-normal"
  >
    {title}
  </h2>
</div>
