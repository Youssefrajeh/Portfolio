// Server-side radio helper.
// 1) Station lists: tries the Radio Browser directory first, then falls back to TuneIn search.
//    (Radio Browser blocks direct browser requests, and both are called from here instead.)
// 2) ?tune=<TuneIn id>: resolves a TuneIn station to its direct HTTPS stream URL at play time.
const dns = require('dns').promises;
const UA = { 'User-Agent': 'Nagham/1.0 (personal music player)' };
const FALLBACK = ['de1.api.radio-browser.info', 'de2.api.radio-browser.info', 'fi1.api.radio-browser.info'];
const ALLOWED = ['name', 'language', 'countrycode', 'tag', 'limit', 'order', 'reverse', 'hidebroken', 'offset'];
const COUNTRY = { SY: 'Syria', LB: 'Lebanon', EG: 'Egypt', SA: 'Saudi Arabia', AE: 'UAE', JO: 'Jordan', IQ: 'Iraq', PS: 'Palestine', KW: 'Kuwait', QA: 'Qatar', MA: 'Morocco', DZ: 'Algeria', TN: 'Tunisia' };

async function rbHosts() {
  let names = [];
  try { names = (await dns.resolveSrv('_api._tcp.radio-browser.info')).map(r => r.name); } catch (e) {}
  return [...new Set([...names.sort(() => Math.random() - 0.5), ...FALLBACK])].map(n => 'https://' + n);
}

async function fromRadioBrowser(query, errors) {
  const q = new URLSearchParams();
  for (const k of ALLOWED) if (query[k] != null) q.set(k, String(query[k]).slice(0, 100));
  for (const host of await rbHosts()) {
    try {
      const r = await fetch(`${host}/json/stations/search?${q}`, { headers: UA, signal: AbortSignal.timeout(4000) });
      if (!r.ok) { errors.push(`${host} ${r.status}`); continue; }
      const data = await r.json();
      return data.map(s => ({
        stationuuid: s.stationuuid, name: s.name, country: s.country, tags: s.tags,
        favicon: s.favicon, url_resolved: s.url_resolved, hls: s.hls
      }));
    } catch (e) { errors.push(`${host} ${e.name}`); }
  }
  return null;
}

async function fromTuneIn(query, errors) {
  // TuneIn has no language/country filter in search, so turn the request into a search phrase.
  let term = query.name || (query.countrycode && (COUNTRY[query.countrycode] || query.countrycode) + ' arabic') || 'arabic music';
  try {
    const r = await fetch(`https://opml.radiotime.com/Search.ashx?query=${encodeURIComponent(term)}&types=station&render=json`, { headers: UA, signal: AbortSignal.timeout(6000) });
    if (!r.ok) { errors.push(`tunein ${r.status}`); return null; }
    const data = await r.json();
    return (data.body || [])
      .filter(s => s.type === 'audio' && s.guide_id && s.item === 'station')
      .map(s => ({
        stationuuid: 'tunein-' + s.guide_id, tune: s.guide_id, name: s.text, country: s.subtext || '',
        tags: s.genre_id ? '' : '', favicon: (s.image || '').replace(/^http:/, 'https:'), url_resolved: null, hls: 0
      }));
  } catch (e) { errors.push(`tunein ${e.name}`); return null; }
}

async function tune(id) {
  const r = await fetch(`https://opml.radiotime.com/Tune.ashx?id=${encodeURIComponent(id)}&render=json&formats=mp3,aac,ogg,hls`, { headers: UA, signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error('tune ' + r.status);
  const data = await r.json();
  const streams = (data.body || []).map(b => b.url).filter(Boolean);
  // Browsers block insecure (http) audio on an https page, so only https streams are usable.
  return streams.filter(u => u.startsWith('https://'));
}

module.exports = async (req, res) => {
  try {
    if (req.query.tune) {
      if (!/^s\d+$/.test(req.query.tune)) return res.status(400).json({ error: 'bad id' });
      const urls = await tune(req.query.tune);
      res.setHeader('Cache-Control', 's-maxage=3600');
      return res.status(urls.length ? 200 : 404).json({ urls });
    }
    const errors = [];
    let list = await fromRadioBrowser(req.query, errors);
    let source = 'radio-browser';
    if (!list) { list = await fromTuneIn(req.query, errors); source = 'tunein'; }
    if (!list) return res.status(502).json({ error: 'radio directory unavailable', details: errors });
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400');
    res.setHeader('X-Radio-Source', source);
    return res.status(200).json(list);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
