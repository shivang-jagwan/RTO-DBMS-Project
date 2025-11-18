from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ViolationType(str, Enum):
    SPEEDING = "Speeding"
    RED_LIGHT = "Red Light Violation"
    NO_SEATBELT = "No Seatbelt"
    MOBILE_USE = "Mobile Use While Driving"
    DRUNK_DRIVING = "Drunk Driving"
    OVERLOADING = "Overloading"
    NO_LICENSE = "Driving Without License"
    OTHER = "Other"

class VehicleType(str, Enum):
    CAR = "Car"
    BIKE = "Bike"
    TRUCK = "Truck"
    BUS = "Bus"
    AUTO = "Auto Rickshaw"
    OTHER = "Other"

class ViolationBase(BaseModel):
    violation_id: str = Field(..., alias="Violation_ID")
    violation_type: ViolationType = Field(..., alias="Violation_Type")
    fine_amount: float = Field(..., alias="Fine_Amount")
    location: str = Field(..., alias="Location")
    date: str = Field(..., alias="Date")
    time: str = Field(..., alias="Time")
    vehicle_type: VehicleType = Field(..., alias="Vehicle_Type")
    vehicle_color: Optional[str] = Field(None, alias="Vehicle_Color")
    vehicle_model_year: Optional[int] = Field(None, alias="Vehicle_Model_Year")
    registration_state: Optional[str] = Field(None, alias="Registration_State")
    driver_age: Optional[int] = Field(None, alias="Driver_Age")
    driver_gender: Optional[str] = Field(None, alias="Driver_Gender")
    license_type: Optional[str] = Field(None, alias="License_Type")
    penalty_points: Optional[int] = Field(None, alias="Penalty_Points")
    weather_condition: Optional[str] = Field(None, alias="Weather_Condition")
    road_condition: Optional[str] = Field(None, alias="Road_Condition")
    officer_id: Optional[str] = Field(None, alias="Officer_ID")
    issuing_agency: Optional[str] = Field(None, alias="Issuing_Agency")
    license_validity: Optional[str] = Field(None, alias="License_Validity")
    number_of_passengers: Optional[int] = Field(None, alias="Number_of_Passengers")
    helmet_worn: Optional[str] = Field(None, alias="Helmet_Worn")
    seatbelt_worn: Optional[str] = Field(None, alias="Seatbelt_Worn")
    traffic_light_status: Optional[str] = Field(None, alias="Traffic_Light_Status")
    speed_limit: Optional[int] = Field(None, alias="Speed_Limit")
    recorded_speed: Optional[int] = Field(None, alias="Recorded_Speed")
    alcohol_level: Optional[float] = Field(None, alias="Alcohol_Level")
    breathalyzer_result: Optional[str] = Field(None, alias="Breathalyzer_Result")
    towed: Optional[str] = Field(None, alias="Towed")
    fine_paid: Optional[str] = Field(None, alias="Fine_Paid")
    payment_method: Optional[str] = Field(None, alias="Payment_Method")
    court_appearance_required: Optional[str] = Field(None, alias="Court_Appearance_Required")
    previous_violations: int = Field(0, alias="Previous_Violations")
    comments: Optional[str] = Field(None, alias="Comments")

    class Config:
        allow_population_by_field_name = True
        use_enum_values = True

class ViolationCreate(ViolationBase):
    pass

class ViolationInDB(ViolationBase):
    id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True
