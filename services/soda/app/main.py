from fastapi import FastAPI
from .routers.audit import router as audit_router
from .core.request_id_middleware import RequestIDMiddleware
from .core.logger import get_logger

app = FastAPI()

app.add_middleware(RequestIDMiddleware)
logger = get_logger("aurasense.soda.api")

app.include_router(audit_router)

# ...existing code for other routers, middleware, startup, etc.
