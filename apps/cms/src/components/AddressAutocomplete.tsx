'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY

type Suggestion = { id: string; label: string }

const AddressAutocomplete: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  const { setValue: setPostcode } = useField<string>({ path: 'postcode' })
  const { setValue: setCity } = useField<string>({ path: 'city' })

  const [query, setQuery] = useState(value ?? '')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(value ?? '')
  }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!HERE_API_KEY || q.length < 3) {
      setSuggestions([])
      return
    }
    try {
      const res = await fetch(
        `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(q)}&apiKey=${HERE_API_KEY}&lang=nl&limit=5`
      )
      const json = await res.json()
      setSuggestions(
        (json.items ?? []).map(
          (item: { id: string; address?: { label?: string }; title?: string }) => ({
            id: item.id,
            label: item.address?.label ?? item.title ?? ''
          })
        )
      )
      setOpen(true)
    } catch {
      setSuggestions([])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    setValue(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 300)
  }

  const handleSelect = async (suggestion: Suggestion) => {
    setOpen(false)
    setSuggestions([])
    if (!HERE_API_KEY) return
    try {
      const res = await fetch(
        `https://lookup.search.hereapi.com/v1/lookup?id=${encodeURIComponent(suggestion.id)}&apiKey=${HERE_API_KEY}`
      )
      const json = await res.json()
      const addr = json.address ?? {}
      const street = [addr.street, addr.houseNumber].filter(Boolean).join(' ')
      const postcode = addr.postalCode ?? ''
      const city = addr.city ?? ''

      setQuery(street)
      setValue(street)
      setPostcode(postcode)
      setCity(city)
    } catch {}
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }} className="field-type text">
      <label
        style={{
          display: 'block',
          marginBottom: 'var(--spacing-1)',
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--theme-text)'
        }}
      >
        Street + number
      </label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: 4,
          fontSize: 14,
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
          boxSizing: 'border-box'
        }}
      />
      {open && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'var(--theme-bg)',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 4,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {suggestions.map((s) => (
            <li
              key={s.id}
              onMouseDown={() => handleSelect(s)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: 14,
                borderBottom: '1px solid var(--theme-elevation-100)'
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'var(--theme-elevation-50)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AddressAutocomplete
