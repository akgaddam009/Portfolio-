"use client";

import { useState, useEffect } from "react";

/**
 * Live clock showing the current time in India Standard Time.
 * Updates every second. Falls back to the static label on SSR.
 */
export default function ISTClock({ style }: { style?: React.CSSProperties }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={style}>
      {time ? `${time} · IST` : "IST · UTC +5:30"}
    </span>
  );
}
