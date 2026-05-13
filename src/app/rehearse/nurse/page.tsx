
  return (
    <main style={{ minHeight: '100vh', background: '#070e1a', color: '#e6edf3', padding: 24, fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: 3, color: '#34d399', textTransform: 'uppercase', margin: 0 }}>AuraSense · Nurse Rehearse</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: '4px 0 0' }}>Nursing Practice Dashboard</h1>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '4px 0 0' }}>Private · 100% in-browser video · HK Nursing Council aware</p>
        </div>
        <select value={specialty} onChange={e => setSpecialty(e.target.value as Specialty)} style={{ background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', padding: '8px 12px', borderRadius: 6, fontSize: 13 }}>
          {(Object.keys(SPECIALTY_LABEL) as Specialty[]).map(s => <option key={s} value={s}>{SPECIALTY_LABEL[s]}</option>)}
        </select>
      </header>

      {/* Scenario/module list */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Practice Scenarios</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={() => startScenario('handwash')} style={{ flex: 1, minWidth: 180, background: '#10b981', color: '#062017', border: 'none', borderRadius: 8, fontWeight: 700, padding: '16px 0', fontSize: 15, cursor: 'pointer' }}>🧼 Handwash</button>
          <button onClick={() => startScenario('wound')} style={{ flex: 1, minWidth: 180, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, padding: '16px 0', fontSize: 15, cursor: 'pointer' }}>🩹 Wound Dressing</button>
          <button onClick={() => startScenario('fall')} style={{ flex: 1, minWidth: 180, background: '#f59e42', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, padding: '16px 0', fontSize: 15, cursor: 'pointer' }}>🪜 Fall Risk</button>
        </div>
      </section>

      {/* Session history/upcoming sessions */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Session History</h2>
        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: 16, minHeight: 60 }}>
          {/* TODO: Wire to real session history data */}
          <span style={{ color: '#8b949e', fontSize: 13 }}>No sessions yet. Start a scenario to see history here.</span>
        </div>
      </section>

      {/* Tutor/Educator access */}
      <section style={{ marginBottom: 24 }}>
        <button onClick={goToTutorDashboard} style={{ background: '#a78bfa', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, padding: '12px 24px', fontSize: 15, cursor: 'pointer' }}>👩‍🏫 Tutor/Educator Portal</button>
      </section>

      {/* Return to Playground navigation */}
      <section style={{ marginBottom: 24 }}>
        <button onClick={() => window.location.href = '/playground'} style={{ background: '#262626', color: '#10b981', border: 'none', borderRadius: 8, fontWeight: 700, padding: '12px 24px', fontSize: 15, cursor: 'pointer' }}>← Return to Playground</button>
      </section>

      {/* Existing session/live panel (hidden unless in session) */}
      {sessionActive && (
        <section style={{ marginTop: 16, background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b949e', letterSpacing: 1, margin: '0 0 12px' }}>AI FEEDBACK {feedback?.mock ? '· MOCK' : ''}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <h4 style={{ fontSize: 12, margin: '0 0 8px' }}>5-axis scoring</h4>
              {feedback?.scores ? Object.entries(feedback.scores).map(([k, v]) => (
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
              {feedback?.verdict ? <p style={{ fontSize: 12, color: '#34d399', marginTop: 10, fontStyle: 'italic' }}>&quot;{feedback.verdict}&quot;</p> : null}
            </div>
            <div>
              {feedback?.strengths?.length ? (
                <div>
                  <h4 style={{ fontSize: 12, color: '#34d399', margin: '0 0 6px' }}>Strengths</h4>
                  <ul style={{ fontSize: 12, color: '#8b949e', paddingLeft: 18, margin: '0 0 12px' }}>
                    {feedback.strengths.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {feedback?.improvements?.length ? (
                <div>
                  <h4 style={{ fontSize: 12, color: '#f59e0b', margin: '0 0 6px' }}>Improve</h4>
                  <ul style={{ fontSize: 12, color: '#8b949e', paddingLeft: 18, margin: 0 }}>
                    {feedback.improvements.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
          {transcript && (
            <details style={{ marginTop: 16 }}>
              <summary style={{ fontSize: 11, color: '#8b949e', cursor: 'pointer', fontFamily: 'monospace' }}>TRANSCRIPT</summary>
              <p style={{ fontSize: 12, color: '#e6edf3', marginTop: 8, padding: 10, background: '#161b22', borderRadius: 6, lineHeight: 1.5 }}>{transcript}</p>
            </details>
          )}
        </section>
      )}
    </main>