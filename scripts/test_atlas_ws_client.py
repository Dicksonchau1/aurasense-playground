import asyncio
import websockets

async def test_ws():
    uri = "ws://localhost:8765/ws/atlas/detections/test-session"
    print(f"Connecting to {uri} ...")
    async with websockets.connect(uri) as ws:
        print("Connected! Waiting for messages...")
        try:
            while True:
                msg = await ws.recv()
                print(f"Received: {msg}")
        except websockets.ConnectionClosed:
            print("Connection closed.")

if __name__ == "__main__":
    asyncio.run(test_ws())
