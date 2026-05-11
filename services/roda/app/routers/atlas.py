from fastapi import APIRouter, Depends, HTTPException
from ..services.atlas_inference import handle_atlas_inference

router = APIRouter(prefix="/api/nepa/v1/atlas", tags=["atlas"])

@router.post("/inference")
async def atlas_inference(request: dict):
    try:
        return await handle_atlas_inference(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
