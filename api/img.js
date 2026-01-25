const API_URL = 'https://captain.sapimu.au/melolo/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url')
  try {
    const r = await fetch(`${API_URL}/img?url=${encodeURIComponent(url)}`, { headers: HEADERS })
    const buffer = await r.arrayBuffer()
    res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.send(Buffer.from(buffer))
  } catch (err) { res.status(500).send(err.message) }
}
