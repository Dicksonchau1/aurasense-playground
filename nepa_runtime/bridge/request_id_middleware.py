import uuid
from aiohttp import web

@web.middleware
def request_id_middleware(request, handler):
    # Extract or generate request ID
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    request["request_id"] = request_id
    response = await handler(request)
    response.headers["x-request-id"] = request_id
    return response
