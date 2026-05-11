from fastapi import APIRouter, Depends, HTTPException
from ..services.fleet_inference import handle_fleet_inference

router = APIRouter(prefix="/api/nepa/v1/fleet", tags=["fleet"])

@router.post("/inference")
async def fleet_inference(request: dict):
    try:
        return await handle_fleet_inference(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
