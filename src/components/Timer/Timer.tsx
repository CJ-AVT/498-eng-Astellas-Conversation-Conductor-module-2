// Timer.tsx
import React, { useState, useEffect, memo } from "react";
import { useGameConfig } from "@/providers/appConfig";
import { useTimer } from "@/components/Timer/TimerContext";

const Timer: React.FC = memo(() => {
  const { content, settings } = useGameConfig();
  const { updateElapsedTime } = useTimer();
  const [timeLeft, setTimeLeft] = useState<number>(settings.timerStartingValue);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Separate effect to update elapsed time
  useEffect(() => {
    const elapsedTime = settings.timerStartingValue - timeLeft;
    updateElapsedTime(elapsedTime);
  }, [timeLeft, updateElapsedTime, settings.timerStartingValue]);

  // Format the time for display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  let backgroundClass = "bg-[var(--color-timer-high)]"; // Default to high

  if (timeLeft / settings.timerStartingValue < 0.25) {
    backgroundClass = "bg-[var(--color-timer-low)]";
  } else if (timeLeft / settings.timerStartingValue < 0.5) {
    backgroundClass = "bg-[var(--color-timer-mid)]";
  }

  return (
    <div className="absolute space-y-2 text-center scale-80 z-2 top-5 right-3">
      <div className="text-4xl text-[var(--color-timer-title)] font-news-gothic-condensed-bold">{content.timerTitle}</div>
      <div className={`pl-8 pr-8 pt-4 pb-4 text-2xl space-y-1 font-semibold text-center ${backgroundClass} text-white rounded-full shadow-md`}>
        <p className="text-5xl font-inter">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </p>
        <div className="flex gap-10 font-inter">
          <span className="text-sm uppercase">{content.timerDemonination1}</span>
          <span className="text-sm uppercase">{content.timerDemonination2}</span>
        </div>
      </div>
    </div>
  );
});

export default Timer;
