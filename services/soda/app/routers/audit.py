
from fastapi import APIRouter, Depends, Request
from ..security.service_token import require_service_token
from ..core.logger import get_logger

router = APIRouter(
    prefix="/api/soda/v1/audit",
    tags=["audit"],
    dependencies=[Depends(require_service_token)],
)

logger = get_logger("aurasense.soda.api.audit")

@router.get("/recent")
async def recent(request: Request, kind: str | None = None, limit: int = 50):
    request_id = getattr(request.state, "request_id", None)
    logger.info("recent endpoint called", extra={"request_id": request_id})
    result = await query_recent_events(kind=kind, limit=limit)
    return {"result": result, "request_id": request_id}
