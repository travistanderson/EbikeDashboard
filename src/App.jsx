import { useEffect, useState } from "react";
import { Bike, ClipboardList } from "lucide-react";

import ActiveRide from "./components/ActiveRide";
import Stats from "./components/Stats";
import "./App.css";

function App() {
  const [ride, setRide] = useState(null);
  const [rides, setRides] = useState(null);
  const [rideStats, setRideStats] = useState(null);

  const startRide = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "afternoon ride" }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to start ride");
      }
  
      const data = await response.json();
      setRide(data);
      console.log("Ride started:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getRides = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/rides", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch rides");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "numeric" });
  }

  const clearRide = () => {
    console.log("clearing ride");
    setRide(null);
  };

  useEffect(() => {
    const fetchRides = async () => {
      const ridesData = await getRides();
      setRides(ridesData);
    };
  
    fetchRides();
  }, []);  

  return (
    <main className="w-screen h-300 flex flex-col bg-gray-900 text-white content-evenly items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 mt-6">
        <span className="pr-8">E-Bike Dashboard</span>
        <Bike
          className="inline relative bottom-1 animate-bounce"
          size={40}
          color="#fff"
        />
      </h1>
      {ride ? (
        <ActiveRide ride={ride} clearRide={clearRide} />
      ) : (
        <div className="w-screen flex justify-center items-center">
          <div className="relative inline-flex group">
            <div
                className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
            </div>
            <a href="#"
                className="relative inline-flex items-center justify-center px-8 py-4 text-3xl font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button"
                onClick={startRide}
                >
                  Go for a ride
            </a>
          </div>
        </div>
      )}

      <div className="text-2xl mt-12">
        <div className="border-b-3 mb-4 w-140">Past Rides</div>
        {rideStats ? (
            <Stats rideStats={rideStats} setRideStats={setRideStats} formatDate={formatDate}/>
        ) : (
          rides && rides.length > 0 ? (
            <ul>
              {rides.map((ride) => (
                <li key={ride.id}>
                  <a
                    href="#" 
                    className="underline mr-3"
                    onClick={() => setRideStats(ride)} 
                  >
                    <ClipboardList size={24} className="inline relative bottom-1" />
                  </a>
                  {ride.id} - {ride.name} ({formatDate(ride.created_at)})
                </li>
              ))}
            </ul>
          ) : (
            <p>None yet, go for a ride!</p>
          )
        )}
      </div>
    
    </main>
  );
}

export default App;
