
from fastapi import APIRouter, Request
from ..core.db import get_session
from ..core.logger import get_logger

router = APIRouter(prefix="/api/nepa/v1/status", tags=["status"])

logger = get_logger("aurasense.api.status")

@router.get("/surfaces")
async def surfaces(request: Request):
    request_id = getattr(request.state, "request_id", None)
    async with get_session() as session:
        rows = await session.fetch_all("""
            select
              product,
              count(*) as events_24h,
              count(receipt_id) as receipts_24h,
              max(created_at)::text as last_event_at
            from audit_events
            where created_at > now() - interval '24 hours'
            group by product
            order by product
        """)
    logger.info("surfaces endpoint called", extra={"request_id": request_id})
    return {"surfaces": [dict(r) for r in rows], "request_id": request_id}
