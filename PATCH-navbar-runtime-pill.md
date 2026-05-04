const [rtName, setRtName] = useState<string>('…')
const [rtOk,   setRtOk]   = useState<boolean>(true)

useEffect(() => {
  let alive = true
  async function ping() {
    try {
      const r = await fetch('/api/nepa/runtime/health').then(r => r.json())
      if (!alive) return
      setRtName(r.adapter ?? r.runtime ?? '?')
      setRtOk(!!r.ok)
    } catch { if (alive) setRtOk(false) }
  }
  ping()
  const t = setInterval(ping, 15_000)
  return () => { alive = false; clearInterval(t) }
}, [])
