import React from "react";
import { useGameConfig } from "@/providers/appConfig";

interface StreakPopupProps {
  streakPopup: {
    points: number;
    streak: number;
    key: number;
  } | null;
}

const StreakPopup: React.FC<StreakPopupProps> = ({ streakPopup }) => {
  const { settings } = useGameConfig();

  if (!streakPopup) {
    return null;
  }

  const getBackgroundColor = () => {
    const streakProgress = streakPopup.streak / settings.maxStreak;
    if (streakProgress <= 0.33) {
      return "bg-yellow-400 text-yellow-900";
    } else if (streakProgress <= 0.66) {
      return "bg-lime-400 text-lime-900";
    }
    return "bg-green-500 text-green-50";
  };

  return (
    <div
      key={streakPopup.key}
      className={`
        absolute top-40 sm:top-40 left-1/2 w-[250px] transform z-50
        text-2xl sm:text-3xl font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-xl shadow-2xl
        animate-streak-popup
        ${getBackgroundColor()}
      `}
      style={{
        pointerEvents: "none",
        opacity: 0.95,
      }}
    >
      +{streakPopup.points} points
    </div>
  );
};

export default StreakPopup;
