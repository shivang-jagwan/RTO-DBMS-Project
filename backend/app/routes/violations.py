from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime, timedelta
import pandas as pd

from app.models.violation import ViolationInDB, ViolationCreate, ViolationType, VehicleType
from app.services.data_service import DataService

router = APIRouter()

# Initialize data service
DATA_PATH = "data/Indian_Traffic_Violations.csv"
data_service = DataService(DATA_PATH)

@router.get("/", response_model=List[dict])
async def read_violations(
    skip: int = 0,
    limit: int = 100,
    violation_type: Optional[str] = None,
    vehicle_type: Optional[str] = None,
    location: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Retrieve a list of traffic violations with optional filtering.
    """
    violations = data_service.get_violations(limit=limit, offset=skip)
    
    # Apply filters
    filtered_violations = violations
    if violation_type:
        filtered_violations = [v for v in filtered_violations if v.get('Violation_Type') == violation_type]
    if vehicle_type:
        filtered_violations = [v for v in filtered_violations if v.get('Vehicle_Type') == vehicle_type]
    if location:
        filtered_violations = [v for v in filtered_violations 
                             if location.lower() in v.get('Location', '').lower()]
    if start_date:
        try:
            start_dt = pd.to_datetime(start_date)
            filtered_violations = [v for v in filtered_violations 
                                 if pd.to_datetime(v.get('Date', '')) >= start_dt]
        except:
            pass
    if end_date:
        try:
            end_dt = pd.to_datetime(end_date)
            filtered_violations = [v for v in filtered_violations 
                                 if pd.to_datetime(v.get('Date', '')) <= end_dt]
        except:
            pass
    
    return filtered_violations

@router.get("/stats")
async def get_statistics():
    """
    Get statistics about traffic violations.
    """
    return data_service.get_violation_stats()

@router.get("/hotspots")
async def get_hotspots(
    eps: float = Query(0.1, description="DBSCAN epsilon parameter"),
    min_samples: int = Query(5, description="Minimum samples for DBSCAN")
):
    """
    Get traffic violation hotspots using DBSCAN clustering.
    """
    return data_service.get_hotspots(eps=eps, min_samples=min_samples)

@router.get("/repeat-offenders")
async def get_repeat_offenders(
    min_violations: int = Query(3, description="Minimum number of violations to be considered a repeat offender")
):
    """
    Get a list of repeat offenders.
    """
    return data_service.get_repeat_offenders(min_violations=min_violations)

@router.get("/trends")
async def get_trends(
    time_period: str = Query("monthly", description="Time period for trends: daily, weekly, or monthly")
):
    """
    Get violation trends over time.
    """
    if time_period not in ["daily", "weekly", "monthly"]:
        raise HTTPException(status_code=400, 
                          detail="Invalid time period. Must be 'daily', 'weekly', or 'monthly'")
    
    return data_service.get_violation_trends(time_period=time_period)

@router.get("/{violation_id}")
async def read_violation(violation_id: str):
    """
    Get a specific violation by ID.
    """
    violations = data_service.get_violations(limit=10000)  # Adjust limit as needed
    for violation in violations:
        if str(violation.get('Violation_ID', '')).lower() == violation_id.lower():
            return violation
    raise HTTPException(status_code=404, detail="Violation not found")
