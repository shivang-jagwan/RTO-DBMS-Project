from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app.routes import violations, dashboard, alerts

# Create the data directory if it doesn't exist
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title="Traffic Violation Analytics API",
    description="API for analyzing traffic violations and detecting hotspots",
    version="1.0.0"
)

# Add CORS middleware with more permissive settings for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Set to False when using wildcard origins
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
# Include routers
app.include_router(
    violations.router,
    prefix="/api/violations",
    tags=["violations"]
)

app.include_router(
    dashboard.router,
    prefix="/api",
    tags=["dashboard"]
)

app.include_router(
    alerts.router,
    tags=["alerts"]
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Traffic Violation Analytics API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Traffic Violation API Server...")
    print("📍 Server will run at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        access_log=True,
        log_level="info"
    )
