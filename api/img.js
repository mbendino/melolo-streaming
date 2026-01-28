import convert from 'heic-convert'

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url')
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    let buffer = Buffer.from(await r.arrayBuffer())
    if (url.includes('.heic')) {
      buffer = Buffer.from(await convert({ buffer, format: 'JPEG', quality: 0.8 }))
    }
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.send(buffer)
  } catch (err) { res.status(500).send(err.message) }
}
