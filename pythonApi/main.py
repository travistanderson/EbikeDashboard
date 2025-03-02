import uvicorn
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import desc

from models import Ride, RideData, RideStats, SQLModel, Session, create_engine, select
from stats import calculate_stats

# Define allowed origins (Frontend URLs)
origins = [
    "http://localhost:1420",  # React app running locally
    "http://127.0.0.1:1420",  # Alternative localhost
]

# Create the FastAPI app
app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Create the SQLite database engine
engine = create_engine("sqlite:///database.db")
SQLModel.metadata.create_all(engine)


# Dependency: Get the session
def get_session():
    with Session(engine) as session:
        yield session


# Create a Ride
@app.post("/rides", response_model=Ride)
def create_ride(ride: Ride, session: Session = Depends(get_session)):
    session.add(ride)
    session.commit()
    session.refresh(ride)
    return ride


# Read all rides
@app.get("/rides", response_model=list[Ride])
def read_rides(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    rides = session.exec(select(Ride).order_by(desc(Ride.id)).limit(limit)).all()
    return rides


# Read a ride by ID
@app.get("/rides/{ride_id}", response_model=Ride)
def read_ride(ride_id: int, session: Session = Depends(get_session)):
    ride = session.get(Ride, ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride


# Update a Ride
@app.put("/rides/{ride_id}", response_model=Ride)
def update_ride(ride_id: int, ride_data: Ride, session: Session = Depends(get_session)):
    ride = session.get(Ride, ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    # Update the ride's attributes
    for field, value in ride_data.model_dump().items():
        setattr(ride, field, value)
    session.commit()
    session.refresh(ride)
    if ride.completed:
        calculate_stats(ride, session)
    return ride


# Create a Ride Data
@app.post("/rides/{ride_id}/data", response_model=RideData)
def create_ride_data(ride_id: int, ride_data: RideData, session: Session = Depends(get_session)):
    ride_data.ride_id = ride_id
    session.add(ride_data)
    session.commit()
    session.refresh(ride_data)
    return ride_data


# Read a ride's stats by ID
@app.get("/rides/{ride_id}/stats", response_model=RideStats)
def read_ride(ride_id: int, session: Session = Depends(get_session)):
    # ride_stats = session.get(RideStats, ride_id)
    statement = select(RideStats).where(RideStats.ride_id == ride_id)
    ride_stats = session.exec(statement).first()
    if not ride_stats:
        raise HTTPException(status_code=404, detail="Ride Stats not found")
    return ride_stats


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)