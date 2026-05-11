# Local End-to-End Smoke Test Setup

## 1. Install, Typecheck, and Build
```
pnpm install
pnpm -r typecheck
pnpm -r build
```

## 2. Boot NEPA Services
Start each backend service in its own terminal:
```
cd services/roda && uvicorn app.main:app --reload --port 8000 &
cd services/soda && uvicorn app.main:app --reload --port 8001 &
cd services/neuro_rehab && uvicorn app.main:app --reload --port 8002 &
```
Test NEPA endpoint:
```
curl -s http://localhost:8000/api/nepa/v1/hri/open?session=test
# Expect: []
```

## 3. Boot Frontend
```
pnpm --filter @aurasense/www dev
```

## 4. Debug-fire Endpoint (for services/roda/app/routers/hri.py)
Add this endpoint if not present:
```python
@router.post("/debug/fire")
async def debug_fire(session_id: str, surface: str = "rehearse-nurse"):
    return await create_hri_request({
        "session_id": session_id,
        "surface": surface,
        "confidence": 0.32,
        "context": {"step": "WHO-3", "frame_id": "f_debug_001", "gust_mps": 11.0},
        "ttl": 120,
    })
```
Fire it:
```
SESSION=$(echo $RANDOM-$RANDOM-$RANDOM)
# In browser DevTools: sessionStorage.setItem('nepa.session_id', '<SESSION>'); location.reload()
curl -X POST "http://localhost:8000/api/nepa/v1/hri/debug/fire?session_id=$SESSION"
# Expected: popup appears within 2s, click closes it, audit chain grows by one.
```

## 5. Verify Audit Chain
```
curl -s "http://localhost:8001/api/soda/v1/audit/recent?kind=hri_interaction&limit=1" | jq
```

---

Follow these steps to verify local end-to-end functionality.
