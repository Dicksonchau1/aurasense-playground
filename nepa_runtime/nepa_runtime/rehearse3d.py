"""
AuraSense Rehearse-3D + Facade Map.
Stores 3D scene metadata + SFSVC facade cell registry.
Persists to ~/aurasense-platform/data/rehearse_scene.json
"""
import os, json, time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="AuraSense Rehearse-3D")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

DATA = os.path.expanduser("~/aurasense-platform/data/rehearse_scene.json")
os.makedirs(os.path.dirname(DATA), exist_ok=True)

def _load():
    if os.path.exists(DATA):
        try: return json.load(open(DATA))
        except: pass
    # default scene: single 30-storey HK building, 10x10 facade grid
    return {
        "version": 1,
        "buildings": [{
            "id":"bldg-A",
            "name":"Demo Tower (Kowloon)",
            "footprint": {"x":0,"y":0,"w":40,"d":30},
            "h": 120,
            "facade_grid": {"rows":12,"cols":10,"cell_m":3.5},
            "cells": []
        }],
        "scene": {
            "ground": {"size":200, "tex":"asphalt"},
            "skybox": "hk_overcast"
        },
        "ts": time.time()
    }

_state = _load()
def _save():
    _state["ts"] = time.time()
    with open(DATA,"w") as f: json.dump(_state, f, indent=2)

@app.get("/health")
async def health(): return {"status":"ok","module":"rehearse3d","buildings":len(_state["buildings"])}

@app.get("/scene")
async def scene(): return JSONResponse(_state)

@app.post("/scene/cell/tag")
async def tag_cell(req: Request):
    """Body: {"building":"bldg-A","row":3,"col":5,"defect":"crack","severity":0.7}"""
    b = await req.json()
    bldg = next((x for x in _state["buildings"] if x["id"]==b.get("building","bldg-A")), None)
    if not bldg: return {"ok":False, "err":"no such building"}
    bldg["cells"].append({"row":b["row"],"col":b["col"],
                          "defect":b.get("defect","unknown"),
                          "severity":b.get("severity",0.5),
                          "ts":time.time()})
    _save()
    return {"ok":True, "count":len(bldg["cells"])}

@app.get("/scene/heatmap")
async def heatmap(building: str = "bldg-A"):
    bldg = next((x for x in _state["buildings"] if x["id"]==building), None)
    if not bldg: return {"err":"no such building"}
    rows, cols = bldg["facade_grid"]["rows"], bldg["facade_grid"]["cols"]
    grid = [[0.0]*cols for _ in range(rows)]
    for c in bldg["cells"]:
        if 0<=c["row"]<rows and 0<=c["col"]<cols:
            grid[c["row"]][c["col"]] = max(grid[c["row"]][c["col"]], c.get("severity",0.5))
    return {"building":building, "rows":rows, "cols":cols, "grid":grid}
