export default async function handler(req, res) {
  try {
    const endpoints = [
      'https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=1d&limit=150',
      'https://api1.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=1d&limit=150',
      'https://api2.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=1d&limit=150',
    ];

    let data = null;
    for (const url of endpoints) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          data = await response.json();
          break;
        }
      } catch (_) { /* try next */ }
    }

    if (!data) throw new Error('All Binance endpoints failed');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
