# Minimal placeholder for ingest_signed_event

async def ingest_signed_event(event: dict):
    # In production, this would sign, store, and emit the event
    # Here, just echo the event with fake hashes/IDs for testing
    return {
        "status": "ok",
        "event_id": "test-event-id",
        "event_hash": "deadbeef" * 8,
        "receipt_id": "test-receipt-id",
        "chained_to": None,
        "verified": True,
        "echo": event
    }
