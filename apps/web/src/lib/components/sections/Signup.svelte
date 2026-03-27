<script lang="ts">
  import { env } from '$env/dynamic/public'
  import type { SignupBlock } from '$lib/payload'
  import type { FrituurApplication, Media } from '@repo/payload-types'
  import Section from '../ui/Section.svelte'
  import SectionTitle from '../ui/SectionTitle.svelte'
  import Description from '../ui/Description.svelte'
  import FormField from '../ui/FormField.svelte'

  type Props = { block: SignupBlock }
  let { block }: Props = $props()

  type FormData = Pick<
    FrituurApplication,
    'frituurName' | 'name' | 'address' | 'postcode' | 'city' | 'gps' | 'phone' | 'email'
  >

  const initialValues = {
    frituurName: '',
    name: '',
    address: '',
    postcode: '',
    city: '',
    gps: { lat: null, lng: null },
    phone: '',
    email: ''
  } satisfies FormData

  let form = $state<FormData>(initialValues)

  let status: 'idle' | 'loading' | 'success' | 'error' = $state('idle')
  let errorMessage = $state('')

  type ErrorFields = keyof Omit<FormData, 'gps'>
  const errorFields: ErrorFields[] = [
    'frituurName',
    'name',
    'address',
    'postcode',
    'city',
    'phone',
    'email'
  ]

  let submitted = $state(false)
  const errors = $derived(
    submitted
      ? (Object.fromEntries(errorFields.map((f) => [f, !form[f]?.toString().trim()])) as Record<
          ErrorFields,
          boolean
        >)
      : ({} as Record<ErrorFields, boolean>)
  )

  function validate(): boolean {
    submitted = true
    return errorFields.every((f) => form[f]?.toString().trim())
  }

  // HERE autocomplete state
  let suggestions: HereSuggestion[] = $state([])
  let showSuggestions = $state(false)
  let addressInputEl: HTMLInputElement | undefined = $state()
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  type HereSuggestion = {
    title: string
    id: string
    address: {
      label: string
      postalCode?: string
      street?: string
      houseNumber?: string
      city?: string
    }
  }

  function onAddressInput(e: Event) {
    const value = (e.target as HTMLInputElement).value
    form.address = value
    form.gps = { lat: null, lng: null }

    clearTimeout(debounceTimer)
    if (value.length < 3) {
      suggestions = []
      showSuggestions = false
      return
    }

    debounceTimer = setTimeout(() => fetchSuggestions(value), 300)
  }

  async function fetchSuggestions(q: string) {
    const apiKey = env.PUBLIC_HERE_API_KEY
    if (!apiKey) return

    try {
      const res = await fetch(
        `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(q)}&lang=nl&in=countryCode:BEL&apiKey=${apiKey}&limit=5&types=houseNumber,street`
      )
      if (!res.ok) return
      const data = await res.json()
      suggestions = data.items ?? []
      showSuggestions = suggestions.length > 0
    } catch {
      // silently ignore autocomplete errors
    }
  }

  async function selectSuggestion(suggestion: HereSuggestion) {
    const street = suggestion.address.street ?? ''
    const houseNumber = suggestion.address.houseNumber ?? ''
    form.address = houseNumber ? `${street} ${houseNumber}` : street
    form.postcode = suggestion.address.postalCode ?? form.postcode
    form.city = suggestion.address.city ?? form.city
    suggestions = []
    showSuggestions = false

    // Look up coordinates
    const apiKey = env.PUBLIC_HERE_API_KEY
    if (!apiKey) return

    try {
      const res = await fetch(
        `https://lookup.search.hereapi.com/v1/lookup?id=${encodeURIComponent(suggestion.id)}&apiKey=${apiKey}`
      )
      if (!res.ok) return
      const data = await res.json()
      if (data.position) {
        form.gps = { lat: data.position.lat, lng: data.position.lng }
      }
    } catch {
      // coordinates are optional — don't block the form
    }
  }

  function onAddressKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      showSuggestions = false
    }
  }

  function onAddressBlur() {
    // Delay so click on suggestion registers first
    setTimeout(() => {
      showSuggestions = false
    }, 150)
  }

  async function handleSubmit(e: Event) {
    e.preventDefault()
    if (!validate()) return
    status = 'loading'
    errorMessage = ''

    try {
      const res = await fetch(`${env.PUBLIC_PAYLOAD_URL}/api/frituur-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message ?? 'Er is iets misgegaan.')
      }

      status = 'success'
      form = initialValues
    } catch (err) {
      status = 'error'
      errorMessage = err instanceof Error ? err.message : 'Er is iets misgegaan.'
    }
  }

  function imageUrl(img: number | Media | null | undefined): string | null {
    if (!img || typeof img === 'number') return null
    if (img.url) return img.url.startsWith('http') ? img.url : `${env.PUBLIC_PAYLOAD_URL}${img.url}`
    if (img.filename) return `${env.PUBLIC_PAYLOAD_URL}/api/media/file/${img.filename}`
    return null
  }

  const imgSrc = $derived(imageUrl(block.image))
  const altText = $derived(typeof block.image === 'object' && block.image ? block.image.alt : '')
</script>

<Section id={block.sectionId ?? ''}>
  <SectionTitle {...block} />

  <div class="flex gap-12">
    <!-- Image -->
    {#if imgSrc}
      <div class="hidden md:block flex-1">
        <img src={imgSrc} alt={altText} class="w-full object-cover rounded-2xl" />
      </div>
    {/if}

    <!-- Form -->
    <div class="flex-1">
      <Description>
        {block.description}
      </Description>
      {#if status === 'success'}
        <div class="bg-brand-dark text-white p-4 text-center">
          {block.thankYou}
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="space-y-4" novalidate>
          <div class="grid grid-cols-2 gap-4">
            <FormField
              id="frituurName"
              label="Naam frituur"
              type="text"
              bind:value={form.frituurName}
              placeholder="Naam frituur"
              error={errors.frituurName}
            />

            <FormField
              id="name"
              label="Naam"
              type="text"
              bind:value={form.name}
              placeholder="Voor- en familienaam"
              error={errors.name}
            />

            <FormField
              id="address"
              label="Adres"
              type="text"
              bind:el={addressInputEl}
              value={form.address}
              oninput={onAddressInput}
              onkeydown={onAddressKeydown}
              onblur={onAddressBlur}
              placeholder="Straat en nummer"
              autocomplete="off"
              error={errors.address}
              class="col-span-2"
            >
              {#if showSuggestions}
                <ul
                  class="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-brand-dark/20
                         rounded-lg shadow-lg overflow-hidden"
                >
                  {#each suggestions as suggestion}
                    <li>
                      <button
                        type="button"
                        class="w-full text-left px-4 py-2 font-body text-sm hover:bg-brand-red/10
                               transition-colors truncate"
                        onmousedown={() => selectSuggestion(suggestion)}
                      >
                        {suggestion.address.label}
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </FormField>

            <FormField
              id="postcode"
              label="Postcode"
              type="text"
              bind:value={form.postcode}
              placeholder="Postcode"
              error={errors.postcode}
            />

            <FormField
              id="city"
              label="Gemeente"
              type="text"
              bind:value={form.city}
              placeholder="Gemeente"
              error={errors.city}
            />

            <FormField
              id="phone"
              label="Telefoonnummer"
              type="tel"
              bind:value={form.phone}
              placeholder="+32 ..."
              error={errors.phone}
            />

            <FormField
              id="email"
              label="E-mailadres"
              type="email"
              bind:value={form.email}
              placeholder="jouw@email.be"
              error={errors.email}
            />
          </div>

          {#if status === 'error'}
            <p class="text-brand-red font-body text-sm">{errorMessage}</p>
          {/if}

          <button
            type="submit"
            disabled={status === 'loading'}
            class="w-full bg-brand-red text-white font-display text-sm font-bold uppercase
                   tracking-widest py-4 hover:bg-brand-red transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === 'loading'
              ? 'Even geduld…'
              : (block.ctaLabel ?? 'Ik wil een Johnny schrijven')}
          </button>

          <p class="text-brand-muted text-center font-bold text-sm">
            {block.disclaimer}
          </p>
        </form>
      {/if}
    </div>
  </div>
</Section>
