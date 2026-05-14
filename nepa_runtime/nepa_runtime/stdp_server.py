"""
AuraSense STDP HTTP server (standalone).
Exposes:
  GET  /health
  GET  /nepa/weights
  POST /nepa/update
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from nepa_runtime.stdp_hybrid_loop import get_loop

app = FastAPI(title="AuraSense STDP Hybrid Loop")

# Allow browser at :3010 (and any localhost dev port) to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/nepa/weights")
async def nepa_weights():
    return JSONResponse(get_loop().get_weights_snapshot())

@app.post("/nepa/update")
async def nepa_update(req: Request):
    body = await req.json()
    result = get_loop().update(
        step_idx        = int(body.get("step", 0)),
        multi_landmarks = body.get("landmarks", []),
        multi_handedness= body.get("handedness", []),
        confidence      = float(body.get("confidence", 0.0)),
    )
    return JSONResponse(result)
