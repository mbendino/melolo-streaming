const API_URL = 'https://captain.sapimu.au/melolo/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9'
}

export default async function handler(req, res) {
  const { vid, lang = 'id' } = req.query
  if (!vid) return res.status(400).json({ error: 'Missing vid' })
  try {
    const response = await fetch(`${API_URL}/video?video_id=${vid}&lang=${lang}`, { headers: HEADERS })
    const json = await response.json()
    // Get best quality h264 video
    const videos = json.parsed?.videos || {}
    let best = null
    for (const key of Object.keys(videos).reverse()) {
      const v = videos[key]
      if (v.codec === 'h264') { best = v; break }
    }
    res.json({ data: { url: best?.main_url || json.main_url } })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
