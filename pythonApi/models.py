from typing import Optional

from sqlmodel import Field, Session, SQLModel, create_engine, select
from datetime import datetime

# Define the models
class Ride(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    name: Optional[str]
    created_at: datetime = Field(default=datetime.now())
    completed: Optional[bool] = False

class RideData(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    ride_id: int
    latitude: float
    longitude: float
    battery: float
    speed: float
    time: datetime = Field(default=datetime.now())

class RideStats(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    ride_id: int
    duration: float
    max_speed: float
    avg_speed: float
    battery_usage: float