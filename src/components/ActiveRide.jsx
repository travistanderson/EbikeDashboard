import React, { useState, useEffect } from 'react';

import BatteryDisplay from "./BatteryDisplay";
import SpeedDisplay from "./SpeedDisplay";
import MapDisplay from "./MapDisplay";

const ActiveRide = ({ride, clearRide}) => {
    const { name, id } = ride;

    const initialSpeed = 6;
    const initialBattery = Math.floor(Math.random() * 100);
    const initialLat = 38.91744352305618;
    const initialLong = -104.85554968411613;

    const maxLat = 38.91930518843646;
    const minLat = 38.91895048857996;
    const maxLong = -104.85012407765333;
    const minLong = -104.84959220272331;
    const centerX = (window.innerWidth / 2) - 10;
    const centerY = (window.innerHeight / 2) - 140;
    const baseRadius = 120;

    const [currentSpeed, setCurrentSpeed] = useState(initialSpeed);
    const [currentBattery, setCurrentBattery] = useState(initialBattery);
    const [currentLat, setCurrentLat] = useState(initialLat);
    const [currentLong, setCurrentLong] = useState(initialLong);
    const [canvasPoint, setCanvasPoint] = useState({ x: 0, y: 0 });
    const [startingPoint, setStartingPoint] = useState({ x: 0, y: 0 });
    const [secondsElapsed, setSecondsElapsed] = useState(0);

    useEffect(() => {
        if (secondsElapsed >= 30) {
            // send these updated telemetry values to the server
            fetch(`http://127.0.0.1:8000/rides/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    completed: true,
                }),
            });
            clearRide();
            return;
        }
    
        const interval = setInterval(() => {
            let angleStep = (2 * Math.PI) / 30;

            const slowDown = Math.random() > 0.5;
            const speedBoost = slowDown ? 2 : 5;
            const speedModifier = parseInt(Math.random() * speedBoost);
            setCurrentSpeed((prev) => slowDown ? prev - speedModifier : prev + speedModifier);  // Increase speed randomly
            
            const batteryDrain = parseInt(currentBattery - 1);
            setCurrentBattery(batteryDrain > 0 ? batteryDrain : 1);
            let newCanvasX = 0;
            let newCanvasY = 0;
            if (secondsElapsed === 29) {
                // we're done with the ride connect the line to the start
                newCanvasX = startingPoint.x;
                newCanvasY = startingPoint.y;
            } else {
                // make a randomized circle around the center of the screen
                const randomOffset = Math.random() * 40 - 15;
                newCanvasX = centerX + (baseRadius + randomOffset) * Math.cos(secondsElapsed * angleStep);
                newCanvasY = centerY + (baseRadius + randomOffset) * Math.sin(secondsElapsed * angleStep);
                if (secondsElapsed === 0) {
                    setStartingPoint({ x: newCanvasX, y: newCanvasY }); // save the starting point
                }
            }

            
            setCanvasPoint({ x: newCanvasX, y: newCanvasY });

            // translate the canvas point to a lat/long
            const latRange = maxLat - minLat;
            const longRange = maxLong - minLong;
            setCurrentLat(latRange * (newCanvasY / window.innerHeight) + minLat);
            setCurrentLong(longRange * (newCanvasX / window.innerWidth) + minLong);

            setSecondsElapsed((prev) => prev + 1);

            // send these updated telemetry values to the server
            fetch(`http://127.0.0.1:8000/rides/${id}/data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ride_id: id,
                    latitude: currentLat,
                    longitude: currentLong,
                    battery: currentBattery,
                    speed: currentSpeed,
                }),
            });
            }, 1000);
    
        // Cleanup the interval when the component unmounts or after 30 seconds
        return () => {
          clearInterval(interval);
        };
      }, [secondsElapsed]);

  return (
    <div className="bg-blue-900 text-white w-11/12 h-140 flex flex-col
    border-4 border-blue-600 rounded-2xl">
        <div className="flex flex-row justify-between">
            <h1 className="text-4xl font-bold ml-8 mt-7 child-start">Active Ride</h1>
            <BatteryDisplay level={currentBattery} />
        </div>
        <div className="flex flex-col flex-1">
            <MapDisplay canvasPoint={canvasPoint} />
        </div>
        <div className="flex flex-row place-content-center">
            <SpeedDisplay speed={currentSpeed} />
        </div>
    </div>
  );
}

export default ActiveRide;