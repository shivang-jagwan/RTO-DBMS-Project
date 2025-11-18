#!/usr/bin/env python3
"""
Simple CORS-enabled proxy server for development
This starts the FastAPI app with proper CORS handling
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Set environment variables
os.environ.setdefault('PYTHONPATH', str(current_dir))

from app.main import app
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting Traffic Violation API with CORS enabled...")
    print("📍 Server URL: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("⚠️  CORS is enabled for all origins (development mode)")
    print("🔄 Auto-reload enabled")
    print("=" * 60)
    
    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=False,  # Disable reload to prevent shutdown
            access_log=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        input("Press Enter to exit...")