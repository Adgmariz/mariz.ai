/**
 * Cloudflare Worker: waitlist Vibeflow
 * POST /waitlist com body JSON: { "email": "user@example.com" }
 * Armazena em KV e responde no formato esperado pela landing.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // em produção, use ALLOWED_ORIGINS ou domínio fixo
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minuto
const RATE_LIMIT_MAX = 5
const ipSubmissions = new Map()

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false
  const trimmed = email.trim()
  return trimmed.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
}

function rateLimit(ip) {
  const now = Date.now()
  if (!ipSubmissions.has(ip)) ipSubmissions.set(ip, [])
  const times = ipSubmissions.get(ip).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (times.length >= RATE_LIMIT_MAX) return true
  times.push(now)
  ipSubmissions.set(ip, times)
  return false
}

export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (request.method !== 'POST') {
      return json({ message: 'Method not allowed' }, 405)
    }

    const url = new URL(request.url)
    if (url.pathname !== '/waitlist') {
      return json({ message: 'Not found' }, 404)
    }

    const ip =
      request.headers.get('CF-Connecting-IP') ||
      request.headers.get('X-Forwarded-For') ||
      'unknown'

    if (rateLimit(ip)) {
      return json({ message: 'Too many requests. Try again later.' }, 429)
    }

    let data
    try {
      data = await request.json()
    } catch {
      return json({ message: 'Invalid JSON' }, 400)
    }

    const email = typeof data.email === 'string' ? data.email.trim() : ''
    if (!isValidEmail(email)) {
      return json({ message: 'Enter your email.' }, 400)
    }

    const key = `email:${email.toLowerCase()}`
    const value = JSON.stringify({
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      ip,
    })

    try {
      await env.WAITLIST.put(key, value, {
        metadata: { subscribedAt: new Date().toISOString() },
      })
    } catch (err) {
      console.error('KV put error:', err)
      return json({ message: 'Something went wrong. Try again.' }, 500)
    }

    return json({ message: "You're on the list!" }, 200)
  },
}
