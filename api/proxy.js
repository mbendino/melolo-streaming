export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url')
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const buffer = await r.arrayBuffer()
    res.setHeader('Content-Type', r.headers.get('content-type') || 'video/mp4')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(Buffer.from(buffer))
  } catch (err) { res.status(500).send(err.message) }
}
