# NavBar SSE patch — add live anomaly subscription

Add this useEffect inside NavBar() (after the existing frame-handler effect):

```tsx
// Live anomaly stream from /api/nepa/anomalies/live (Server-Sent Events)
useEffect(() => {
  let es: EventSource | null = null
  let retry = 0
  let cancelled = false

  function connect() {
    if (cancelled) return
    es = new EventSource('/api/nepa/anomalies/live')
    es.addEventListener('hello', (e: any) => {
      try {
        const d = JSON.parse(e.data)
        console.log('[NEPA SSE] connected · runtime:', d.runtime)
      } catch {}
    })
    es.addEventListener('anomaly', (e: any) => {
      try {
        const a = JSON.parse(e.data)
        setMessages(prev => [...prev, {
          id: a.id,
          role: 'agent',
          text: `⚠ Anomaly · ${a.region} · pred-err ${a.pred_err.toFixed?.(3) ?? a.pred_err} · score ${(a.score*100|0)}%`,
          endpoint: '/api/nepa/anomalies/live',
          ts: new Date(a.ts_ms).toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }),
        }])
        setOpen(true)
      } catch {}
    })
    es.onerror = () => {
      es?.close()
      if (cancelled) return
      retry = Math.min(retry + 1, 6)
      setTimeout(connect, 1000 * Math.pow(2, retry))
    }
  }
  connect()
  return () => { cancelled = true; es?.close() }
}, [])
```

Also add a small "LIVE STREAM" badge in the drawer header next to the existing LIVE pill if you want explicit feedback that SSE is connected.
