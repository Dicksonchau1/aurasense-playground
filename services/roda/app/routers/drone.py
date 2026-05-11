from fastapi import APIRouter, Depends, HTTPException
from ..services.drone_inference import handle_drone_inference

router = APIRouter(prefix="/api/nepa/v1/drone", tags=["drone"])

@router.post("/inference")
async def drone_inference(request: dict):
    try:
        return await handle_drone_inference(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
