# NavBar patch (one-time, manual)

In `src/components/nav-bar.tsx`, REPLACE the existing block:

```tsx
useEffect(() => {
  registerFrameCapture((region) => { ... })
}, [])
```

WITH:

```tsx
useEffect(() => {
  let mounted = true
  import('@/lib/nepa-bus').then(({ registerFrameHandler }) => {
    if (!mounted) return
    registerFrameHandler(async (frame, source) => {
      setOpen(true); setView('chat')
      const label = frame.region?.label ?? 'FULL'
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: `Analyse frame · ${source} · ${label} · ${frame.width}×${frame.height}`,
        frame: `${source}:${label}`,
        attachment: frame.dataUrl,
        ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, userMsg])

      const fd = new FormData()
      fd.append('image', frame.blob, `frame_${frame.ts}.jpg`)
      fd.append('source', source)
      fd.append('region', label)
      try {
        const res = await fetch('/api/nepa/inference/frame', { method: 'POST', body: fd })
        const json = await res.json()
        const d = json?.data ?? {}
        const top = (d.detections ?? []).slice(0, 3)
          .map((x: any) => `${x.class}(${(x.score*100|0)}%)`).join(', ')
        setMessages(prev => [...prev, {
          id: Date.now() + '_a' as any,
          role: 'agent',
          text: `Inference complete · ${d.detections?.length ?? 0} signals · ${top || 'no anomalies'} · pred-err ${d.world_model?.prediction_error ?? '—'}`,
          endpoint: '/api/nepa/inference/frame',
          ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }),
        }])
      } catch {
        setMessages(prev => [...prev, {
          id: Date.now() + '_e' as any, role: 'agent',
          text: 'Inference failed — endpoint unreachable.',
          ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }),
        }])
      }
    })
  })
  return () => { mounted = false }
}, [])
```

ALSO update the message render (around `m.attachment`) to render real images:

```tsx
{m.attachment && (m.attachment.startsWith('data:image')
  ? <img src={m.attachment} alt="frame"
      className="mb-1.5 rounded-md block"
      style={{ maxWidth: '180px', border: '1px solid rgba(16,185,129,0.25)' }} />
  : <div className="mb-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
      style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>
      <Upload className="w-2.5 h-2.5" /> {m.attachment}
    </div>
)}
```
