"use client";
import { useEffect, useState } from "react";

const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports touch
    const checkTouch = () => {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    };
    setIsTouchDevice(checkTouch());
  }, []);

  return isTouchDevice;
};

export default useTouchDevice;
