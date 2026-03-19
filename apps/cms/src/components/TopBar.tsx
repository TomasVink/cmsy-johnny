'use client'

import { useEffect, useState } from 'react'

interface Project {
  name: string
  slug: string
  payload_url: string
}

interface TopBarData {
  email: string
  projects: Project[]
  currentProject: { name: string; payload_url: string } | null
}

const PLATFORM_URL = process.env.NEXT_PUBLIC_CMS_PLATFORM_URL

export default function TopBar() {
  const [data, setData] = useState<TopBarData | null>(null)

  useEffect(() => {
    fetch('/api/users/topbar')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setData(d))
      .catch(() => {})
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        width: '100vw',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 40,
        background: '#111827',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
    >
      {data && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {PLATFORM_URL && (
              <a href={PLATFORM_URL} style={{ color: '#9ca3af', textDecoration: 'none' }}>
                ← All projects
              </a>
            )}
            {data.currentProject && (
              <>
                <span style={{ color: '#4b5563' }}>/</span>
                <span>{data.currentProject.name}</span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {data.projects.length > 1 && (
              <select
                defaultValue={data.currentProject?.payload_url ?? ''}
                onChange={(e) => {
                  window.location.href = e.target.value
                }}
                style={{
                  background: '#1f2937',
                  color: '#fff',
                  border: '1px solid #374151',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {data.projects.map((p) => (
                  <option key={p.slug} value={p.payload_url}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
            <span style={{ color: '#9ca3af' }}>{data.email}</span>
          </div>
        </>
      )}
    </div>
  )
}
