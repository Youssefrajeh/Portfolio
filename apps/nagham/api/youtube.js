// YouTube search through the official YouTube Data API.
// The API key lives in the Vercel environment variable YT_KEY, never in the app's page.
module.exports = async (req, res) => {
  const key = process.env.YT_KEY;
  if (!key) return res.status(501).json({ error: 'NO_YT_KEY' });
  const q = String(req.query.q || '').trim().slice(0, 100);
  if (!q) return res.status(400).json({ error: 'missing q' });
  const params = new URLSearchParams({
    part: 'snippet', type: 'video', videoEmbeddable: 'true', videoCategoryId: '10',
    maxResults: '25', q, key, safeSearch: 'moderate'
  });
  try {
    const r = await fetch('https://www.googleapis.com/youtube/v3/search?' + params, { signal: AbortSignal.timeout(8000) });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error?.message || 'youtube error' });
    const items = (data.items || []).map(i => ({
      id: i.id.videoId,
      title: i.snippet.title,
      channel: i.snippet.channelTitle,
      thumb: i.snippet.thumbnails?.medium?.url || i.snippet.thumbnails?.default?.url || ''
    })).filter(i => i.id);
    // Same searches are served from Vercel's cache for a day, which saves the daily API quota.
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(items);
  } catch (e) {
    return res.status(502).json({ error: e.name });
  }
};
