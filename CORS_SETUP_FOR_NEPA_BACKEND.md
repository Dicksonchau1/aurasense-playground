# CORS setup for NEPA backend (FastAPI example)

# In your NEPA FastAPI backend, add this to main.py:

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Adjust allow_origins as needed for your deployment.
