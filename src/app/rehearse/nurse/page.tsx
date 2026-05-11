  return (
    <main style={{ minHeight: '100vh', background: '#070e1a', color: '#e6edf3', padding: 24, fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: 3, color: '#34d399', textTransform: 'uppercase', margin: 0 }}>AuraSense · Nurse Rehearse</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: '4px 0 0' }}>Interview Practice Mirror</h1>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '4px 0 0' }}>Private · 100% in-browser video · HK Nursing Council aware</p>
        </div>
        <select value={specialty} onChange={e => setSpecialty(e.target.value as Specialty)} style={{ background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', padding: '8px 12px', borderRadius: 6, fontSize: 13 }}>
          {(Object.keys(SPECIALTY_LABEL) as Specialty[]).map(s => <option key={s} value={s}>{SPECIALTY_LABEL[s]}</option>)}
        </select>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div>
          <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
            <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} muted playsInline />
            {running ? (
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(248,81,73,0.9)', color: '#fff', padding: '4px 10px', borderRadius: 99, fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>
                ● REC {mm}:{ss}
              </div>
            ) : null}
            {busy ? (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,14,26,0.85)', display: 'grid', placeItems: 'center', fontSize: 14, color: '#34d399' }}>
                Analyzing session…
                              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {!running ? (
              <button onClick={start} disabled={busy || !q} style={{ flex: 1, padding: '10px 14px', background: '#10b981', color: '#062017', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>▶ Start Session</button>
            ) : (
              <button onClick={stop} style={{ flex: 1, padding: '10px 14px', background: '#f85149', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>⏹ Stop & Analyze</button>
            )}
            <button onClick={prevQ} disabled={running || qIdx === 0} style={{ padding: '10px 14px', background: 'transparent', color: '#e6edf3', border: '1px solid #30363d', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>◀ Prev</button>
            <button onClick={nextQ} disabled={running || qIdx >= questions.length - 1} style={{ padding: '10px 14px', background: 'transparent', color: '#e6edf3', border: '1px solid #30363d', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Next ▶</button>
          </div>

          {err ? <div style={{ marginTop: 12, padding: 10, background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 6, color: '#f85149', fontSize: 12 }}>{err}</div> : null}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#8b949e', letterSpacing: 1 }}>QUESTION {qIdx + 1} / {questions.length || 0}</span>
              <span style={{ fontSize: 12, color: '#f59e0b' }}>{stars}</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, margin: '8px 0' }}>{q?.prompt ?? 'Loading question bank…'}</p>
            {focuses.length ? (
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {focuses.map(f => (
                  <span key={f} style={{ fontSize: 10, padding: '3px 8px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', borderRadius: 99 }}>{f}</span>
                ))}
              </div>
            ) : null}
          </div>

          <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: 16 }}>
            <h3 style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b949e', letterSpacing: 1, margin: '0 0 12px' }}>LIVE METRICS</h3>
            {[
              { label: 'Posture', v: m.posture, display: `${m.posture.toFixed(0)}%` },
              { label: 'Framing', v: m.framing, display: `${m.framing.toFixed(0)}%` },
              { label: 'Gaze', v: m.gaze, display: `${m.gaze.toFixed(0)}%` },
              { label: 'Envelope', v: m.envelope, display: `${m.envelope.toFixed(0)}%` },
              { label: 'Consistency', v: m.consistency * 100, display: m.consistency.toFixed(2) },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: '#8b949e' }}>{row.label}</span>
                  <span style={{ fontFamily: 'monospace', color: '#e6edf3' }}>{row.display}</span>
                </div>
                <div style={{ height: 6, background: '#161b22', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={bar(row.v)} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {feedback ? (
        <section style={{ marginTop: 16, background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b949e', letterSpacing: 1, margin: '0 0 12px' }}>AI FEEDBACK {feedback.mock ? '· MOCK' : ''}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <h4 style={{ fontSize: 12, margin: '0 0 8px' }}>5-axis scoring</h4>
              {feedback.scores ? Object.entries(feedback.scores).map(([k, v]) => (
                <div key={k} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: '#8b949e' }}>{k.replace(/_/g, ' ')}</span>
                    <span style={{ fontFamily: 'monospace' }}>{Number(v).toFixed(0)}/10</span>
                  </div>
                  <div style={{ height: 5, background: '#161b22', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${(Number(v) / 10) * 100}%`, height: 5, background: '#a78bfa' }} />
                  </div>
                </div>
              )) : null}
              {feedback.verdict ? <p style={{ fontSize: 12, color: '#34d399', marginTop: 10, fontStyle: 'italic' }}>&quot;{feedback.verdict}&quot;</p> : null}
            </div>
            <div>
              {feedback.strengths?.length ? (
                <div>
                  <h4 style={{ fontSize: 12, color: '#34d399', margin: '0 0 6px' }}>Strengths</h4>
                  <ul style={{ fontSize: 12, color: '#8b949e', paddingLeft: 18, margin: '0 0 12px' }}>
                    {feedback.strengths.map((s: string, i: number) => (
                      >{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {feedback.improvements?.length ? (
                <div>
                  <h4 style={{ fontSize: 12, color: '#f59e0b', margin: '0 0 6px' }}>Improve</h4>
                  <ul style={{ fontSize: 12, color: '#8b949e', paddingLeft: 18, margin: 0 }}>
                    {feedback.improvements.map((s: string, i: number) => (
                      >{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
          {transcript ? (
            <details style={{ marginTop: 16 }}>
              <summary style={{ fontSize: 11, color: '#8b949e', cursor: 'pointer', fontFamily: 'monospace' }}>TRANSCRIPT</summary>
              <p style={{ fontSize: 12, color: '#e6edf3', marginTop: 8, padding: 10, background: '#161b22', borderRadius: 6, lineHeight: 1.5 }}>{transcript}</p>
            </details>
          ) : null}
        </section>
      ) : null}
    </main>
  )
}