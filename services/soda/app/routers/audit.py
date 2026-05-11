from fastapi import APIRouter, Depends
from ..security.service_token import require_service_token

router = APIRouter(
    prefix="/api/soda/v1/audit",
    tags=["audit"],
    dependencies=[Depends(require_service_token)],
)

@router.get("/recent")
async def recent(kind: str | None = None, limit: int = 50):
    return await query_recent_events(kind=kind, limit=limit)
