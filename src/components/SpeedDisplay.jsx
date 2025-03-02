import { CircleGauge } from "lucide-react";

const SpeedDisplay = ({speed}) =>{

  return (
    <div className="flex flex-row self-center w-55 justify-between">
      <CircleGauge size={74} className="text-red-600 child-start ml-2" />
      <div className="text-4xl font-bold text-white child-end relative top-6">{speed} MPH</div>
    </div>
  );
}

export default SpeedDisplay;