<script lang="ts">
  type Variant = 'red' | 'yellow' | 'black'

  type Props = {
    variant?: Variant
    class?: string
  }

  let { variant = 'red', class: className = '' }: Props = $props()

  const variantClass: Record<Variant, string> = {
    red:    'checker-red',
    yellow: 'checker-yellow',
    black:  'checker-black',
  }
</script>

<div class="{variantClass[variant]} {className}" role="presentation" aria-hidden="true"></div>
