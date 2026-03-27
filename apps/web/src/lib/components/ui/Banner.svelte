<script lang="ts">
  type Variant = 'red' | 'yellow' | 'black' | 'red-yellow'

  type Props = {
    variant?: Variant
    class?: string
  }

  let { variant = 'red', class: className = '' }: Props = $props()

  const variantClass: Record<Variant, string> = {
    red: 'checker-red',
    yellow: 'checker-yellow',
    black: 'checker-black',
    'red-yellow': 'checker-red-yellow'
  }
</script>

<div class="{variantClass[variant]} {className}" role="presentation" aria-hidden="true"></div>
