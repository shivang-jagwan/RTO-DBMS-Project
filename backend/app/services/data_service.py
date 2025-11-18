import pandas as pd
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
import json

from app.models.violation import ViolationInDB, ViolationCreate, ViolationType, VehicleType

class DataService:
    def __init__(self, data_path: str):
        """Initialize the DataService with the path to the CSV file."""
        self.data_path = Path(data_path)
        self.df = self._load_data()
        self._preprocess_data()
    
    def _load_data(self) -> pd.DataFrame:
        """Load and return the traffic violations data."""
        try:
            return pd.read_csv(self.data_path, low_memory=False)
        except Exception as e:
            print(f"Error loading data: {e}")
            return pd.DataFrame()
    
    def _preprocess_data(self):
        """Preprocess the data for analysis."""
        if self.df.empty:
            return
        
        # Convert date and time to datetime
        if 'Date' in self.df.columns and 'Time' in self.df.columns:
            self.df['datetime'] = pd.to_datetime(
                self.df['Date'] + ' ' + self.df['Time'],
                errors='coerce'
            )
            # Extract additional time features
            self.df['hour'] = self.df['datetime'].dt.hour
            self.df['day_of_week'] = self.df['datetime'].dt.day_name()
            self.df['month'] = self.df['datetime'].dt.month_name()
            self.df['year'] = self.df['datetime'].dt.year
        
        # Fill missing values
        self.df.fillna({
            'Violation_Type': 'Other',
            'Location': 'Unknown',
            'Vehicle_Type': 'Other',
            'Fine_Amount': 0,
            'Previous_Violations': 0,
            'Driver_Age': 0,
            'Recorded_Speed': 0,
            'Speed_Limit': 0
        }, inplace=True)
        
        # Convert numeric columns
        numeric_cols = ['Fine_Amount', 'Previous_Violations', 'Driver_Age', 'Recorded_Speed', 'Speed_Limit']
        for col in numeric_cols:
            if col in self.df.columns:
                self.df[col] = pd.to_numeric(self.df[col], errors='coerce').fillna(0)
    
    def get_violations(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Get paginated list of violations."""
        if self.df.empty:
            return []
        # Replace NaN values so JSON serialization does not fail
        window = self.df.iloc[offset:offset+limit].replace({np.nan: None})
        return window.to_dict('records')
    
    def get_violation_stats(self) -> Dict[str, Any]:
        """Get statistics about violations."""
        if self.df.empty:
            return {}
        
        stats = {
            "total_violations": len(self.df),
            "total_fines": float(self.df['Fine_Amount'].sum()),
            "avg_fine_amount": float(self.df['Fine_Amount'].mean()),
            "top_violations": self.df['Violation_Type'].value_counts().head(5).to_dict(),
            "top_locations": self.df['Location'].value_counts().head(5).to_dict(),
            "vehicle_types": self.df['Vehicle_Type'].value_counts().to_dict(),
            "violations_by_hour": self.df['hour'].value_counts().sort_index().to_dict() if 'hour' in self.df.columns else {},
            "violations_by_day": self.df['day_of_week'].value_counts().to_dict() if 'day_of_week' in self.df.columns else {},
            "violations_by_month": self.df['month'].value_counts().to_dict() if 'month' in self.df.columns else {},
        }
        
        return stats
    
    def get_hotspots(self, eps: float = 0.1, min_samples: int = 5) -> List[Dict[str, Any]]:
        """
        Detect hotspots using DBSCAN clustering.
        
        Args:
            eps: The maximum distance between two samples for one to be considered
                as in the neighborhood of the other.
            min_samples: The number of samples in a neighborhood for a point to be
                considered as a core point.
                
        Returns:
            List of dictionaries containing hotspot information.
        """
        if self.df.empty or 'Location' not in self.df.columns:
            return []
        
        # Get location frequencies
        location_counts = self.df['Location'].value_counts().reset_index()
        location_counts.columns = ['location', 'count']
        
        # For simplicity, we'll just return the top locations by count
        # In a real implementation, you would use geocoding to get coordinates
        # and then apply DBSCAN clustering
        hotspots = location_counts.nlargest(10, 'count').to_dict('records')
        
        return hotspots
    
    def get_repeat_offenders(self, min_violations: int = 3) -> List[Dict[str, Any]]:
        """Get repeat offenders with at least min_violations."""
        if self.df.empty:
            return []

        # Primary path: group by explicit driver license number when available
        if 'Driver_License_Number' in self.df.columns:
            offenders = self.df['Driver_License_Number'].value_counts()
            repeat_offenders = offenders[offenders >= min_violations].reset_index()
            repeat_offenders.columns = ['license_number', 'violation_count']

            result: List[Dict[str, Any]] = []
            for _, row in repeat_offenders.iterrows():
                offender_rows = self.df[self.df['Driver_License_Number'] == row['license_number']]
                offender_data = offender_rows.iloc[0]
                result.append({
                    'license_number': row['license_number'],
                    'violation_count': int(row['violation_count']),
                    'driver_name': offender_data.get('Driver_Name', 'Unknown'),
                    'driver_age': int(offender_data.get('Driver_Age', 0) or 0),
                    'driver_gender': offender_data.get('Driver_Gender', 'Unknown'),
                    'last_violation_date': offender_data.get('Date', 'Unknown'),
                    'total_fines': float(offender_rows.get('Fine_Amount', pd.Series(dtype=float)).sum())
                })
            return result

        # Fallback path: dataset without a unique driver identifier
        # Use Previous_Violations as proxy and flag rows meeting the threshold
        if 'Previous_Violations' in self.df.columns:
            candidates = self.df.copy()
            candidates['Previous_Violations'] = pd.to_numeric(candidates['Previous_Violations'], errors='coerce').fillna(0).astype(int)
            offenders_df = candidates[candidates['Previous_Violations'] >= int(min_violations)]

            # Build a consistent response shape expected by the frontend
            results: List[Dict[str, Any]] = []
            for _, r in offenders_df.iterrows():
                results.append({
                    'license_number': f"DRV-{r.get('Violation_ID', 'UNKNOWN')}",
                    'violation_count': int(r.get('Previous_Violations', 0) or 0),
                    'driver_name': r.get('Driver_Name', 'Unknown'),
                    'driver_age': int(r.get('Driver_Age', 0) or 0),
                    'driver_gender': r.get('Driver_Gender', 'Unknown'),
                    'last_violation_date': r.get('Date', 'Unknown'),
                    'total_fines': float(r.get('Fine_Amount', 0) or 0)
                })

            # Sort by violation_count desc, then fine amount desc
            results.sort(key=lambda x: (x['violation_count'], x['total_fines']), reverse=True)
            return results

        # If neither identifier nor proxy exists, return empty
        return []
    
    def get_violation_trends(self, time_period: str = 'monthly') -> Dict[str, Any]:
        """Get violation trends over time."""
        if self.df.empty or 'datetime' not in self.df.columns:
            return {}
        
        if time_period == 'daily':
            trends = self.df.resample('D', on='datetime').size()
        elif time_period == 'weekly':
            trends = self.df.resample('W', on='datetime').size()
        else:  # monthly
            trends = self.df.resample('M', on='datetime').size()
        
        return {
            'dates': trends.index.strftime('%Y-%m-%d').tolist(),
            'counts': trends.values.tolist()
        }
