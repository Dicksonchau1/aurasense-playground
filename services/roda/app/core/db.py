from contextlib import asynccontextmanager

class DummySession:
    async def fetch_all(self, query):
        # Return dummy data for status endpoint
        return []
    async def __aenter__(self):
        return self
    async def __aexit__(self, exc_type, exc, tb):
        pass

@asynccontextmanager
async def get_session():
    session = DummySession()
    try:
        yield session
    finally:
        pass
