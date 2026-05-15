import os, json, hashlib, socket, time
from pathlib import Path
try:
    from supabase import create_client
except Exception:
    create_client = None

BASE = Path(__file__).parent
CKPT = BASE / "checkpoints" / "nepa_hh.pt"
META = BASE / "checkpoints" / "nepa_hh.meta.json"
ENV  = BASE / ".env"

def _load_env():
    if not ENV.exists(): return {}
    out = {}
    for line in ENV.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line: continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip()
    return out

_ENV         = _load_env()
SUPABASE_URL = _ENV.get("SUPABASE_URL")            or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = _ENV.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
VERSION_TAG  = _ENV.get("NEPA_VERSION_TAG")        or os.environ.get("NEPA_VERSION_TAG") or ""

def checkpoint_sha():
    if not CKPT.exists(): return None
    h = hashlib.sha256()
    with open(CKPT, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()[:16]

def checkpoint_meta():
    if not META.exists(): return {}
    try: return json.loads(META.read_text())
    except Exception: return {}

_state = {"sha": None, "release_id": None, "loaded_at": None, "meta": {}}

def current():
    return dict(_state)

def register_on_startup():
    sha  = checkpoint_sha()
    meta = checkpoint_meta()
    _state["sha"]       = sha
    _state["meta"]      = meta
    _state["loaded_at"] = time.time()
    if not sha:
        print("[registry] no checkpoint present, running in heuristic mode")
        return
    if not (SUPABASE_URL and SUPABASE_KEY and create_client):
        print("[registry] supabase env missing or client not installed; local-only mode")
        return
    try:
        sb = create_client(SUPABASE_URL, SUPABASE_KEY)
        payload = {
            "checkpoint_sha": sha,
            "version_tag":    VERSION_TAG or meta.get("version_tag") or f"nepa-hh-{sha}",
            "service":        "nepa-hh",
            "jetson_host":    socket.gethostname(),
            "arch":           meta.get("arch") or "NepaHHHead-256-256",
            "param_count":    meta.get("param_count"),
            "eval_metrics":   meta.get("eval_metrics") or {},
            "notes":          meta.get("notes"),
            "is_active":      True,
            "retired_at":     None,
        }
        res = sb.table("model_releases").upsert(payload, on_conflict="checkpoint_sha").execute()
        row = (res.data or [None])[0]
        if row:
            _state["release_id"] = row.get("id")
            sb.table("model_releases").update(
                {"is_active": False, "retired_at": "now()"}
            ).neq("checkpoint_sha", sha).execute()
            print(f"[registry] registered sha={sha} release_id={row.get('id')}")
        else:
            print("[registry] upsert returned no row")
    except Exception as e:
        print("[registry] upsert failed:", e)

if __name__ == "__main__":
    register_on_startup()
    print(json.dumps(current(), default=str, indent=2))
