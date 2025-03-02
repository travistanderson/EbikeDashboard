import { ClipboardList, CircleX, CloudDownload, Pencil, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";

const Stats = ({rideStats, setRideStats, formatDate}) =>{
    const [stats, setStats] = useState(null);
    const [name, setName] = useState(rideStats.name);
    const [editingName, setEditingName] = useState(false);

    const handleBlur = () => {
        handleNameChange(); // Hide input when losing focus
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleNameChange(); // Save on Enter
    };

    const handleNameChange = async () => {
        const updatedName = await fetch(`http://127.0.0.1:8000/rides/${rideStats.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
            }),
        });
        setEditingName(false)
    };

    const handleEditClick = () => {
        setEditingName(true);
    };

    const getStats = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/rides/${rideStats.id}/stats`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch ride stats");
          }
      
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(error);
          return [];
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
          const statsData = await getStats();
          setStats(statsData);
        };
      
        fetchStats();
      }, []);

    const closeStats = () => {
        setRideStats(null);
    }

    const convertToCSV = (data) => {
        if (!Array.isArray(data)) { // Ensure data is an array
            data = [data];
        }
        if (!data.length) return "";
        const headers = Object.keys(data[0]).join(",") + "\n";
        const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    
        return headers + rows;
    };

    const downloadStats = async () => {
        const statsObject = {
            id: rideStats.id,
            name: name,
            created_at: formatDate(rideStats.created_at),
            duration: stats.duration,
            max_speed: stats.max_speed,
            avg_speed: stats.avg_speed,
            battery_usage: stats.battery_usage,
        };
        const csvContent = convertToCSV(statsObject);
        const filename = `ride-${rideStats.id}-stats.csv`;
        try {
            // Save the file using Tauri's filesystem API
            await writeTextFile(filename, csvContent, { dir: BaseDirectory.Download });

            alert(`File saved as ${filename} in Downloads`);
        } catch (error) {
            console.error("Error saving CSV:", error);
        }
    }
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col w-full">
                <a className="block self-end" onClick={closeStats}>
                    <CircleX size={34} className="white" />
                </a>
            </div>
            <div className="flex flex-row w-full">
                <ClipboardList size={54} className="white flex-1 mr-2" />
            
                <div className="text-white flex-8 mr-2">
                    ID : {rideStats.id} <br />
                    <div className='flex flex-row w-full'>
                        {editingName ? (
                            <div className="flex flex-col">
                                <div>Edit ride name</div>
                                <div>
                                    <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    className="border rounded p-1 text-lg"
                                    />
                                    <a className="relative left-60 bottom-10" onClick={handleNameChange}>
                                        <Save size={24} className="white child-end ml-10" />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-row">
                                <div>Name : {name}</div>
                                <a className="block self-end relative bottom-2" onClick={handleEditClick}>
                                    <Pencil size={20} className="white child-end ml-10" />
                                </a>
                            </div>
                        )}
                        
                    </div>
                    Date : {formatDate(rideStats.created_at)} <br />
                    {stats && stats.duration ? (
                        <p>
                            Duration : {stats.duration} sec <br />
                            Max Speed : {stats.max_speed} mph <br />
                            Avg Speed : {stats.avg_speed.toFixed(2)} mph <br />
                            Battery Used : {stats.battery_usage}% <br />
                        </p>
                    ) : (
                        <span>No stats available for this ride</span>
                    )}
                    
                </div>
                <a className="flex-1 relative top-14 left-4" onClick={downloadStats}>
                    <CloudDownload size={34} className="white" />
                    CSV
                </a>
            </div>
        </div>
    );
}

export default Stats;