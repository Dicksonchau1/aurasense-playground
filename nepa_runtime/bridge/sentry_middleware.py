import sentry_sdk
from aiohttp import web
import os

# Initialize Sentry as early as possible
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        traces_sample_rate=0.1,  # Adjust as needed
        environment=os.getenv("ENVIRONMENT", "development"),
    )

@web.middleware
def sentry_error_middleware(request, handler):
    try:
        return await handler(request)
    except Exception as exc:
        sentry_sdk.capture_exception(exc)
        # Optionally log or print here as well
        return web.json_response({"ok": False, "error": "internal server error"}, status=500)
