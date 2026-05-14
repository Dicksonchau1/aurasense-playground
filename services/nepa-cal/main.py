# Main entry point for NEPA Calibration Service
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from accel_cal import app as accel_app
from compass_cal import app as compass_app
from rc_cal import app as rc_app
from ws_bridge import router as ws_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/", accel_app)
app.mount("/", compass_app)
app.mount("/", rc_app)
app.include_router(ws_router)

# To run: uvicorn main:app --host 0.0.0.0 --port 8010 --reload
