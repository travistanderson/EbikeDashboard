from fastapi import HTTPException

from models import Ride, RideData, RideStats, Session, select

def calculate_stats(ride: Ride, session: Session):

    ride_data = session.exec(select(RideData).filter_by(ride_id=ride.id)).all()
    if not ride_data:
        raise HTTPException(status_code=404, detail="Ride data not found")

    duration = 30
    max_speed = 0
    battery_max = 0
    battery_min = 100
    average_speeds = 0

    for data in ride_data:
        max_speed = max(max_speed, data.speed)
        battery_max  = max(battery_max, data.battery)
        battery_min = min(battery_min, data.battery)
        average_speeds += data.speed

    battery_usage = battery_max - battery_min
    avg_speed = average_speeds / len(ride_data)

    ride_stats = RideStats(
        ride_id=ride.id,
        duration=duration,
        max_speed=max_speed,
        avg_speed=avg_speed,
        battery_usage=battery_usage,
    )
    session.add(ride_stats)
    session.commit()
    session.refresh(ride_stats)
    return ride_stats