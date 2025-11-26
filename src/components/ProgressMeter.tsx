import React from "react";
import { useGameConfig } from "@/providers/appConfig";

interface ProgressMeterProps {
  percent: number;
  className?: string;
}

const ProgressMeter: React.FC<ProgressMeterProps> = ({ percent, className = "" }) => {
  const { content, assets } = useGameConfig();
  const boundedPercent = Math.max(0, Math.min(100, Math.round(percent)));

  // Function to get emoji opacity based on progress thresholds
  const getEmojiOpacity = (progress: number, threshold: { min: number; max: number }) => {
    if (progress >= threshold.min) {
      return "opacity-100";
    }
    return "opacity-30";
  };

  return (
    <div className={`w-11/12 justify-self-end absolute bottom-0 ${className}`}>
      <div className="flex w-full flex-row gap-5 rounded-md bg-[var(--color-progress-meter-background)] border-2 border-[var(--color-progress-meter-border)] p-5 backdrop-blur-[2px]">
        <div className="flex flex-row font-semibold tracking-wide text-[var(--color-progress-meter-text)] w-2/5">{content.progressMeterTitle}</div>

        {/* Progress bar with image indicators positioned outside container */}
        <div className="relative flex items-center w-full gap-2">
          <span className="font-medium text-[var(--color-progress-meter-text)]">0%</span>

          {/* Progress bar container */}
          <div className="relative w-full">
            {/* Satisfaction images positioned above and outside the container */}
            <div className="absolute left-0 right-0 flex justify-between -top-18">
              <img src={assets.images.notEffective} alt="Getting started" className={`w-8 h-8 object-contain transition-opacity duration-300 ${getEmojiOpacity(boundedPercent, { min: 0, max: 33 })}`} title="Getting started" />
              <img src={assets.images.neutral} alt="Making progress" className={`w-8 h-8 object-contain transition-opacity duration-300 ${getEmojiOpacity(boundedPercent, { min: 33, max: 67 })}`} title="Making progress" />
              <img src={assets.images.effective} alt="Almost there!" className={`w-8 h-8 object-contain transition-opacity duration-300 ${getEmojiOpacity(boundedPercent, { min: 67, max: 100 })}`} title="Almost there!" />
            </div>

            {/* Progress bar */}
            <div className="relative w-full h-4 overflow-hidden rounded-full bg-slate-700/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-answer-incorrect)] via-[var(--color-answer-neutral)] to-[var(--color-answer-correct)] transition-all duration-500"
                style={{
                  width: `${boundedPercent}%`,
                }}
              />
            </div>
          </div>

          <span className="font-medium text-[var(--color-progress-meter-text)]">100%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressMeter;
