import pytest
from aiohttp import web
from nepa_runtime.bridge.http_bridge import make_app

@pytest.fixture
def cli(loop, aiohttp_client):
    app = make_app()
    return loop.run_until_complete(aiohttp_client(app))

async def test_health_endpoint(cli):
    resp = await cli.get("/health")
    assert resp.status == 200
    data = await resp.json()
    assert data["ok"] is True

async def test_ready_endpoint(cli):
    resp = await cli.get("/ready")
    assert resp.status in (200, 503)
    data = await resp.json()
    assert "ok" in data
