import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'
import { writeFileSync, readFileSync, unlinkSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3005

const API_URL = 'https://captain.sapimu.au/melolo/api/v1'
const TOKEN = process.env.AUTH_TOKEN || '61b1a024457f073e6d6b480de88aed5c135c8e7c5baf85d8a234c2fa75f380ed'
const HEADERS = { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }

async function fetchImg(url) {
  if (!url) return null
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const buffer = Buffer.from(await r.arrayBuffer())
    if (url.includes('.heic')) {
      const tmp = `/tmp/img_${Date.now()}_${Math.random().toString(36).slice(2)}`
      writeFileSync(`${tmp}.heic`, buffer)
      execSync(`convert ${tmp}.heic ${tmp}.jpg`)
      const jpg = readFileSync(`${tmp}.jpg`)
      unlinkSync(`${tmp}.heic`)
      unlinkSync(`${tmp}.jpg`)
      return `data:image/jpeg;base64,${jpg.toString('base64')}`
    }
    return `data:image/jpeg;base64,${buffer.toString('base64')}`
  } catch { return null }
}

app.get('/api/foryou', async (req, res) => {
  const { lang = 'id', page = '1' } = req.query
  try {
    const r = await fetch(`${API_URL}/bookmall?lang=${lang}&page=${page}`, { headers: HEADERS })
    const json = await r.json()
    const books = json.cell?.books || []
    const data = await Promise.all(books.map(async i => ({
      id: i.book_id, title: i.book_name, cover: await fetchImg(i.thumb_url), episodes: parseInt(i.last_chapter_index) || 0
    })))
    res.json({ data })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/search', async (req, res) => {
  const { q, lang = 'id' } = req.query
  if (!q) return res.json({ data: [] })
  try {
    const r = await fetch(`${API_URL}/search?query=${encodeURIComponent(q)}&lang=${lang}`, { headers: HEADERS })
    const json = await r.json()
    const items = (json.items || []).filter(i => i.cover)
    const data = await Promise.all(items.map(async i => ({
      id: i.book_id, title: i.title, cover: await fetchImg(i.cover), episodes: 0
    })))
    res.json({ data })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/book', async (req, res) => {
  const { id, lang = 'id' } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const r = await fetch(`${API_URL}/series?series_id=${id}&lang=${lang}`, { headers: HEADERS })
    const json = await r.json()
    const s = json.series || {}
    res.json({ data: { id: String(s.series_id), title: s.title, cover: await fetchImg(s.cover), description: s.intro, episodes: s.episode_count } })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/chapters', async (req, res) => {
  const { id, lang = 'id' } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const r = await fetch(`${API_URL}/series?series_id=${id}&lang=${lang}`, { headers: HEADERS })
    const json = await r.json()
    res.json({ data: { chapters: (json.episodes || []).map(e => ({ id: e.vid, index: e.index })) } })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/video', async (req, res) => {
  const { vid, lang = 'id' } = req.query
  if (!vid) return res.status(400).json({ error: 'Missing vid' })
  try {
    const r = await fetch(`${API_URL}/video?video_id=${vid}&lang=${lang}`, { headers: HEADERS })
    const json = await r.json()
    const videos = json.parsed?.videos || {}
    let best = null
    for (const key of Object.keys(videos).reverse()) {
      if (videos[key].codec === 'h264') { best = videos[key]; break }
    }
    res.json({ data: { url: best?.main_url || json.main_url } })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/img', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url')
  try {
    const r = await fetch(`${API_URL}/img?url=${encodeURIComponent(url)}`, { headers: HEADERS })
    const buffer = Buffer.from(await r.arrayBuffer())
    res.set('Content-Type', r.headers.get('content-type') || 'image/jpeg')
    res.set('Cache-Control', 'public, max-age=86400')
    res.send(buffer)
  } catch (e) { res.status(500).send(e.message) }
})

app.get('/api/proxy', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url')
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    res.set('Content-Type', r.headers.get('content-type'))
    res.set('Access-Control-Allow-Origin', '*')
    const buffer = await r.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (e) { res.status(500).send(e.message) }
})

app.use(express.static(join(__dirname, 'dist')))
app.get('/{*path}', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')))

app.listen(PORT, () => console.log(`Melolo running on http://localhost:${PORT}`))
