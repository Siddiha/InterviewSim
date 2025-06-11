import React, { useState, useEffect } from "react";

interface TimerProps {
  // You might add props like initialTime, onTimerEnd, etc.
}

export default function Timer({}: // Add props here
TimerProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  // Format time (e.g., seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="text-lg font-semibold text-gray-700">
      Time: {formatTime(time)}
    </div>
  );
}
