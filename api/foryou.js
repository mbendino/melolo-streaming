const API_URL = 'https://captain.sapimu.au/melolo/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9'
}

export default async function handler(req, res) {
  const { lang = 'id', page = '1' } = req.query
  try {
    const response = await fetch(`${API_URL}/bookmall?lang=${lang}&page=${page}`, { headers: HEADERS })
    const json = await response.json()
    const books = json.cell?.books || []
    const dramas = books.map(i => ({
      id: i.book_id,
      title: i.book_name,
      cover: `/api/img?url=${encodeURIComponent(i.thumb_url)}`,
      episodes: parseInt(i.last_chapter_index) || 0
    }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
