from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
import pandas as pd
import os
from pathlib import Path
from datetime import datetime

router = APIRouter()

# Path to your data file (using absolute path to be safe)
PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_FILE = PROJECT_ROOT / ".." / "Indian_Traffic_Violations.csv"

@router.get("/dashboard")
async def get_dashboard_data() -> Dict[str, Any]:
    try:
        # Check if data file exists
        if not DATA_FILE.exists():
            return {
                "totalViolations": 0,
                "lastUpdated": None,
                "violationTypes": {},
                "topLocations": {},
                "vehicleTypes": {},
                "fineStats": {"total": 0, "average": 0, "max": 0, "min": 0},
                "message": f"Data file not found at {DATA_FILE.absolute()}"
            }
        
        # Load the data
        df = pd.read_csv(DATA_FILE)
        
        # Convert date column to datetime if it exists
        if 'Date' in df.columns:
            df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        
        # Calculate basic statistics with explicit type conversion
        total_violations = len(df)
        
        return {
            "totalViolations": int(total_violations),
            "lastUpdated": "2025-11-18", # Static for now
            "violationTypes": {"Speeding": 50, "Parking": 30, "Signal": 20},  # Mock data
            "topLocations": {"Location 1": 25, "Location 2": 15, "Location 3": 10},  # Mock data
            "vehicleTypes": {"Car": 60, "Bike": 25, "Truck": 15},  # Mock data
            "fineStats": {
                "total": 50000.0,
                "average": 1500.0,
                "max": 5000.0,
                "min": 500.0
            },
            "message": f"Data loaded successfully - {total_violations} violations found"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
