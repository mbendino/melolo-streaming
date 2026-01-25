const API_URL = 'https://captain.sapimu.au/melolo/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9'
}

export default async function handler(req, res) {
  const { id, lang = 'id' } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const response = await fetch(`${API_URL}/series?series_id=${id}&lang=${lang}`, { headers: HEADERS })
    const json = await response.json()
    const s = json.series || {}
    res.json({
      data: {
        id: String(s.series_id),
        title: s.title,
        cover: `/api/img?url=${encodeURIComponent(s.cover)}`,
        description: s.intro,
        episodes: s.episode_count
      }
    })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
