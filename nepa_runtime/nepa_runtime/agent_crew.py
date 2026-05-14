"""AuraSense Agent Crew — minimal version that always loads."""
import time, requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

WM_URL = "http://localhost:8766"
app = FastAPI(title="AuraSense Agent Crew")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

try:
    from crewai import Agent, Task, Crew
    HAS_CREWAI = True
except Exception:
    HAS_CREWAI = False

def _fetch_world():
    try:
        return requests.get(f"{WM_URL}/wm/state", timeout=2).json()
    except Exception as e:
        return {"error": str(e)}

def mini_crew(world):
    skill = world.get("skill_belief", [0.5]*7)
    fatigue = world.get("fatigue", 0.0)
    eng = world.get("engagement", 1.0)
    weak = [i for i,s in enumerate(skill) if s < 0.55]
    if eng < 0.4:        coach = "You seem disengaged. Take a deep breath and continue."
    elif fatigue > 0.7:  coach = "Fatigue rising. Slow down and focus on quality."
    elif weak:           coach = f"Focus extra attention on step {weak[0]+1}."
    else:                coach = "Excellent rhythm — keep this consistency."
    avg = sum(skill)/len(skill) if skill else 0
    verdict = "PASS" if avg >= 0.6 else "RETRY"
    if verdict == "PASS" and fatigue < 0.5: nxt = "advance_to_aseptic_module"
    elif verdict == "RETRY" and weak:       nxt = f"repeat_step_{weak[0]+1}"
    else:                                   nxt = "rest_then_repeat"
    return {
        "coach": coach,
        "examiner": {"verdict": verdict, "confidence": round(avg,3)},
        "curriculum": {"next_action": nxt, "weak_steps": weak},
        "engine": "mini-crew (rules-based)"
    }

@app.get("/health")
async def health():
    return {"status":"ok","module":"agent_crew","engine":"crewai" if HAS_CREWAI else "mini"}

@app.get("/agents/decide")
async def decide():
    world = _fetch_world()
    if "error" in world: return JSONResponse({"error": world["error"]}, status_code=502)
    return mini_crew(world)
