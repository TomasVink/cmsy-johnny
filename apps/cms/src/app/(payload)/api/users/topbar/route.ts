import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyJwt } from '../../../../../lib/verifyJwt'

interface OrgCustomData {
  payload_url?: string
  frontend_url?: string
}

interface LogtoOrg {
  id: string
  name: string
  customData: OrgCustomData
}

async function getManagementToken(): Promise<string> {
  const res = await fetch(`${process.env.LOGTO_ENDPOINT}/oidc/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.LOGTO_M2M_APP_ID!,
      client_secret: process.env.LOGTO_M2M_APP_SECRET!,
      resource: 'https://default.logto.app/api',
      scope: 'all',
    }),
  })
  const data = await res.json()
  return data.access_token as string
}

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return NextResponse.json(null, { status: 401 })

  const payload = await getPayload({ config })
  const claims = verifyJwt(token, payload.secret)
  if (!claims?.email) return NextResponse.json(null, { status: 401 })

  const email = claims.email as string
  const logtoSub = claims.logtoSub as string | undefined

  // If M2M credentials or logtoSub are missing, return minimal data (no projects)
  if (!logtoSub || !process.env.LOGTO_M2M_APP_ID || !process.env.LOGTO_M2M_APP_SECRET) {
    return NextResponse.json({ email, projects: [], currentProject: null })
  }

  try {
    const mgmtToken = await getManagementToken()
    const res = await fetch(
      `${process.env.LOGTO_ENDPOINT}/api/users/${logtoSub}/organizations?page_size=100`,
      { headers: { Authorization: `Bearer ${mgmtToken}` } },
    )
    if (!res.ok) return NextResponse.json({ email, projects: [], currentProject: null })

    const orgs = (await res.json()) as LogtoOrg[]
    const projects = orgs
      .filter(org => org.customData?.payload_url)
      .map(org => ({
        name: org.name,
        slug: org.name.toLowerCase().replace(/\s+/g, '-'),
        payload_url: org.customData.payload_url!,
        frontend_url: org.customData.frontend_url,
      }))

    const currentServerUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
    const currentProject = projects.find(p => p.payload_url.replace(/\/$/, '') === currentServerUrl) ?? null

    return NextResponse.json({ email, projects, currentProject })
  } catch {
    return NextResponse.json({ email, projects: [], currentProject: null })
  }
}
