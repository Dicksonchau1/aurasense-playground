
from fastapi import APIRouter, Depends, HTTPException, Request
from ..services.atlas_inference import handle_atlas_inference
from ..core.logger import get_logger

router = APIRouter(prefix="/api/nepa/v1/atlas", tags=["atlas"])

logger = get_logger("aurasense.api.atlas")

@router.post("/inference")
async def atlas_inference(request: Request):
    body = await request.json()
    request_id = getattr(request.state, "request_id", None)
    try:
        logger.info(f"atlas_inference called", extra={"request_id": request_id})
        result = await handle_atlas_inference(body)
        return {**result, "request_id": request_id}
    except Exception as e:
        logger.error(f"atlas_inference error: {e}", extra={"request_id": request_id})
        raise HTTPException(status_code=500, detail=str(e))
