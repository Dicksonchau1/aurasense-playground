import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory event store (for demo/dev only; replace with DB for production)
let events: Array<{ event: string; details?: any; ts: string }> = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { event, details, ts } = req.body || {};
      if (!event || !ts) {
        return res.status(400).json({ error: 'Missing event or timestamp' });
      }
      // Store event
      events.push({ event, details, ts });
      // Limit memory usage
      if (events.length > 1000) events = events.slice(-1000);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to store event' });
    }
  } else if (req.method === 'GET') {
    // Return all events (for debugging/demo)
    return res.status(200).json({ events });
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}