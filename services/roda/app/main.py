from fastapi import FastAPI
from .routers.atlas import router as atlas_router
from .routers.fleet import router as fleet_router
from .routers.drone import router as drone_router
from .routers.status import router as status_router

app = FastAPI()

app.include_router(atlas_router)
app.include_router(fleet_router)
app.include_router(drone_router)
app.include_router(status_router)

# ...existing code for other routers, middleware, startup, etc.
