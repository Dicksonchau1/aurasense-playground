from fastapi import APIRouter
from ..core.db import get_session

router = APIRouter(prefix="/api/nepa/v1/status", tags=["status"])

@router.get("/surfaces")
async def surfaces():
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
    return {"surfaces": [dict(r) for r in rows]}
