
from fastapi import APIRouter, Depends, HTTPException, Request
from ..services.fleet_inference import handle_fleet_inference
from ..core.logger import get_logger

router = APIRouter(prefix="/api/nepa/v1/fleet", tags=["fleet"])

logger = get_logger("aurasense.api.fleet")

@router.post("/inference")
async def fleet_inference(request: Request):
    body = await request.json()
    request_id = getattr(request.state, "request_id", None)
    try:
        logger.info(f"fleet_inference called", extra={"request_id": request_id})
        result = await handle_fleet_inference(body)
        return {**result, "request_id": request_id}
    except Exception as e:
        logger.error(f"fleet_inference error: {e}", extra={"request_id": request_id})
        raise HTTPException(status_code=500, detail=str(e))
