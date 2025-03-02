import { Battery, BatteryLow, BatteryMedium, BatteryFull } from "lucide-react";

const BatteryDisplay = ({level}) =>{
  let batteryIcon = <BatteryFull size={94} className="text-green-400 mr-2" />;
  if (level < 25) {
    batteryIcon = <Battery size={94} className="text-red-400 mr-2" />;
  } else if (level < 50) {
    batteryIcon = <BatteryLow size={94} className="text-yellow-400 mr-2" />;
  } else if (level < 75) {
    batteryIcon = <BatteryMedium size={94} className="text-green-400 mr-2" />;
  }

  return (
    <div className="child-end mr-2 flex">
      {batteryIcon}
      <div className="text-4xl font-bold p-1 relative top-6">{level}%</div>
    </div>
  );
}

export default BatteryDisplay;