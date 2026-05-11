ADD inside NavBar() — replace the existing useEffect that calls registerFrameCapture:

  useEffect(() => {
    import('@/lib/nepa-bus').then(({ registerFrameHandler }) => {
      registerFrameHandler(async (frame, source) => {
        setOpen(true); setView('chat')
        const label = frame.region?.label ?? 'FULL'
        const userMsg: Message = {
          id: Date.now().toString(),
          role: 'user',
          text: `Analyse frame from ${source} · region ${label} · ${frame.width}×${frame.height}`,
          frame: `${source}:${label}`,
          attachment: frame.dataUrl,           // <-- real image preview
          ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages(prev => [...prev, userMsg])

        // Fire real inference
        const fd = new FormData()
        fd.append('image', frame.blob, `frame_${frame.ts}.jpg`)
        fd.append('source', source)
        fd.append('region', label)
        try {
          const res = await fetch('/api/nepa/inference/frame', { method: 'POST', body: fd })
          const json = await res.json()
          const d = json?.data ?? {}
          const top = (d.detections ?? []).slice(0, 3).map((x: any) => `${x.class}(${(x.score*100|0)}%)`).join(', ')
          setMessages(prev => [...prev, {
            id: Date.now().toString() + '_a',
            role: 'agent',
            text: `Inference complete · ${d.detections?.length ?? 0} signals · ${top || 'no anomalies'} · prediction error ${d.prediction_error ?? '—'}`,
            endpoint: '/api/nepa/inference/frame',
            ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }),
          }])
        } catch (e) {
          setMessages(prev => [...prev, {
            id: Date.now().toString() + '_e',
            role: 'agent',
            text: 'Inference failed — endpoint unreachable.',
            ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }),
          }])
        }
      })
    })
  }, [])

ALSO update the message render so when m.attachment looks like a data URL it renders as <img> instead of plain text:

  {m.attachment && (m.attachment.startsWith('data:image')
    ? <img src={m.attachment} alt="frame" className="mb-1.5 rounded-md" style={{ maxWidth: '180px', border: '1px solid rgba(16,185,129,0.25)' }} />
    : <div className="mb-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
        style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>
        <Upload className="w-2.5 h-2.5" /> {m.attachment}
      </div>
  )}
