
from fastapi import APIRouter, Depends, HTTPException, Request
from ..services.drone_inference import handle_drone_inference
from ..core.logger import get_logger

router = APIRouter(prefix="/api/nepa/v1/drone", tags=["drone"])

logger = get_logger("aurasense.api.drone")

@router.post("/inference")
async def drone_inference(request: Request):
    body = await request.json()
    request_id = getattr(request.state, "request_id", None)
    try:
        logger.info(f"drone_inference called", extra={"request_id": request_id})
        result = await handle_drone_inference(body)
        return {**result, "request_id": request_id}
    except Exception as e:
        logger.error(f"drone_inference error: {e}", extra={"request_id": request_id})
        raise HTTPException(status_code=500, detail=str(e))
