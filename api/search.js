const API_URL = 'https://captain.sapimu.au/melolo/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9'
}

export default async function handler(req, res) {
  const { q, lang = 'id' } = req.query
  if (!q) return res.json({ data: [] })
  try {
    const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(q)}&lang=${lang}`, { headers: HEADERS })
    const json = await response.json()
    const items = json.items || []
    const dramas = items.filter(i => i.cover).map(i => ({
      id: i.book_id,
      title: i.title,
      cover: `/api/img?url=${encodeURIComponent(i.cover)}`,
      episodes: 0
    }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
