"use client";

import { useEffect, useState } from "react";

const Header = ({
  role,
  hasStarted,
}: {
  role?: string;
  hasStarted: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds

  useEffect(() => {
    if (!hasStarted) return;

    // Check session storage for existing timer
    const savedEndTime = sessionStorage.getItem("interviewEndTime");

    if (savedEndTime) {
      const remaining = Math.floor(
        (parseInt(savedEndTime) - Date.now()) / 1000
      );
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
        // Handle timer expiry if needed
      }
    } else {
      // Set new end time
      const endTime = Date.now() + 25 * 60 * 1000;
      sessionStorage.setItem("interviewEndTime", endTime.toString());
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="navbar min-h-0 px-0 py-4">
      <div className="flex-1">
        <h3 className="text-[#1f285b] text-2xl font-bold uppercase tracking-wide">
          {role || "Developer"}
        </h3>
      </div>

      <div className="flex-none">
        {/* Timer Container with Gradient Border */}
        <div className="relative p-[2px] rounded-xl bg-gradient-to-r from-pink-500 to-blue-600 shadow-md">
          <div className="bg-slate-50 rounded-[10px] px-6 py-2 min-w-[100px] flex items-center justify-center">
            <p className="font-orbitron text-2xl font-semibold text-slate-900 tracking-widest">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
