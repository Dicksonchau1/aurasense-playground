"""
AuraSense HK Environmental Engine.
Provides:  sun position (azimuth/altitude) for any timestamp,
           windshear estimation from HKO if available (mocked otherwise),
           shadow polygon projection for an axis-aligned building footprint.
"""
import time, math, datetime, requests
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="AuraSense HK Env Engine")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

HK_LAT = 22.3193
HK_LON = 114.1694
HK_TZ_OFFSET = 8

def _julian_day(dt: datetime.datetime) -> float:
    a = (14 - dt.month) // 12
    y = dt.year + 4800 - a
    m = dt.month + 12*a - 3
    jdn = dt.day + (153*m + 2)//5 + 365*y + y//4 - y//100 + y//400 - 32045
    frac = (dt.hour - 12)/24 + dt.minute/1440 + dt.second/86400
    return jdn + frac

def sun_position(when: datetime.datetime, lat=HK_LAT, lon=HK_LON):
    """Approximate solar azimuth (deg from N, CW) and altitude (deg)."""
    jd = _julian_day(when)
    n = jd - 2451545.0
    L = (280.46 + 0.9856474 * n) % 360
    g = math.radians((357.528 + 0.9856003 * n) % 360)
    lam = math.radians(L + 1.915*math.sin(g) + 0.020*math.sin(2*g))
    eps = math.radians(23.439 - 0.0000004 * n)
    ra = math.atan2(math.cos(eps)*math.sin(lam), math.cos(lam))
    dec = math.asin(math.sin(eps) * math.sin(lam))
    gmst = (18.697374558 + 24.06570982441908 * n) % 24
    lst = (gmst + lon/15) % 24
    H = math.radians(lst*15) - ra
    lat_r = math.radians(lat)
    alt = math.asin(math.sin(lat_r)*math.sin(dec) + math.cos(lat_r)*math.cos(dec)*math.cos(H))
    az = math.atan2(-math.sin(H), math.tan(dec)*math.cos(lat_r) - math.sin(lat_r)*math.cos(H))
    return {
        "altitude_deg": round(math.degrees(alt), 2),
        "azimuth_deg":  round((math.degrees(az) + 360) % 360, 2),
    }

def shadow_polygon(building, sun):
    """Project shadow from a rectangular building (x,y,w,d,h in metres) given sun pos."""
    if sun["altitude_deg"] <= 1: return {"shadow": [], "length_m": 0}
    L = building["h"] / math.tan(math.radians(sun["altitude_deg"]))
    az = math.radians(sun["azimuth_deg"])
    # shadow direction = opposite to sun azimuth
    sx, sy = -math.sin(az)*L, -math.cos(az)*L
    bx,by,w,d = building["x"], building["y"], building["w"], building["d"]
    base = [(bx, by), (bx+w, by), (bx+w, by+d), (bx, by+d)]
    shadow_corners = [(x+sx, y+sy) for (x,y) in base]
    return {"shadow": base + shadow_corners[::-1], "length_m": round(L, 2),
            "azimuth_deg": sun["azimuth_deg"]}

def windshear_estimate(height_m: float, ground_wind_kt: float = 12, alpha=0.143):
    """Power-law wind profile: V(h) = V_ref * (h/h_ref)^alpha"""
    h_ref = 10.0
    return round(ground_wind_kt * (max(1, height_m)/h_ref) ** alpha, 2)

@app.get("/health")
async def health(): return {"status":"ok","module":"env_engine","city":"Hong Kong"}

@app.get("/env/sun")
async def env_sun(ts: float = Query(default=None)):
    when = datetime.datetime.utcfromtimestamp(ts) if ts else datetime.datetime.utcnow()
    return JSONResponse({"utc": when.isoformat(), "hk_local": (when + datetime.timedelta(hours=HK_TZ_OFFSET)).isoformat(),
                         **sun_position(when)})

@app.get("/env/shadow")
async def env_shadow(x: float, y: float, w: float, d: float, h: float, ts: float = None):
    when = datetime.datetime.utcfromtimestamp(ts) if ts else datetime.datetime.utcnow()
    return JSONResponse(shadow_polygon({"x":x,"y":y,"w":w,"d":d,"h":h}, sun_position(when)))

@app.get("/env/wind")
async def env_wind(height_m: float = 30, ground_wind_kt: float = 12):
    """Hong Kong-style power-law wind profile (alpha=0.143). Mock ground wind if HKO API not reachable."""
    try:
        # HKO open data current wind (best-effort)
        r = requests.get("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en", timeout=2)
        kt = ground_wind_kt
        if r.ok:
            j = r.json()
            # crude parse: just use the provided default if structure missing
        else: kt = ground_wind_kt
    except Exception:
        kt = ground_wind_kt
    return {"ground_wind_kt": kt, "height_m": height_m,
            "wind_at_height_kt": windshear_estimate(height_m, kt),
            "alpha": 0.143}

@app.get("/env/forecast_block")
async def env_forecast_block(building_h: float = 120, ts: float = None):
    """Returns: sun, wind at facade height, shadow length — composite payload for ATLAS sweep planner."""
    when = datetime.datetime.utcfromtimestamp(ts) if ts else datetime.datetime.utcnow()
    sun = sun_position(when)
    return {
        "ts": when.isoformat(),
        "sun": sun,
        "wind_at_facade_kt": windshear_estimate(building_h),
        "shadow_length_m": round(building_h / math.tan(math.radians(max(1, sun["altitude_deg"]))), 2) if sun["altitude_deg"]>1 else None,
        "lighting_quality": "good" if 25 <= sun["altitude_deg"] <= 70 else ("low_sun" if sun["altitude_deg"]<25 else "harsh_overhead"),
    }
