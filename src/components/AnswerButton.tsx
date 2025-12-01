import React from "react";
import { TAnswer, TPoints } from "@/types/types";

interface AnswerButtonProps {
  answer: TAnswer;
  isMobile: boolean;
  isSelected: boolean;
  pointsConfig: TPoints;
  isCorrectAfterSubmission?: boolean;
  wasSelectedAndIncorrect?: boolean;
  isSubmitted: boolean;
  isDisabled: boolean;
  onClick: () => void;
  animate: boolean;
  animationDirection: "left" | "right";
  answerButtonHoverState: boolean;
}
const AnswerButton: React.FC<AnswerButtonProps> = ({ answer, isMobile, isSelected, pointsConfig, isSubmitted, isDisabled, onClick, animate, animationDirection, answerButtonHoverState }) => {
  const animation = animate ? "opacity-100 translate-x-0" : `opacity-0 ${animationDirection === "left" ? "-translate-x-full" : "translate-x-full"}`;
  const base = ` ${isMobile ? "w-[90%]" : "w-full"} font-bold bg-[var(--color-answer-background)]/50 hover:bg-[var(--color-answer-background)]/90 backdrop-blur-lg cursor-pointer text-left pr-8 pl-8 pt-4 pb-4 rounded-lg border border-2 text-xs sm:text-xl shadow-md focus:outline-none transform transition-all duration-500 ease-in-out`;
  const stateClasses = isSubmitted ? (answer.points === pointsConfig.correct ? " border-[var(--color-answer-correct)]" : answer.points === pointsConfig.neutral ? " border-[var(--color-answer-neutral)]" : " border-[var(--color-answer-incorrect)]") : isSelected ? " border-orange-400" : " backdrop-blur-sm border-gray-300 hover:opacity-90 hover:border-[#D01D82]";
  const hoverAddon = answerButtonHoverState ? " hover:border-4 hover:border-red-500" : "";
  const disabledAddon = isDisabled ? " opacity-60 cursor-not-allowed" : "";
  const interactionAddon = !animate && isSubmitted ? " pointer-events-none" : "";

  return (
    <button onClick={onClick} disabled={isDisabled} className={`${base} ${animation}${stateClasses}${hoverAddon}${disabledAddon}${interactionAddon} text-[var(--color-answer-text)]`}>
      {answer.text}
      {answer.subtext && <p className="italic font-normal text-white">{answer.subtext}</p>}
    </button>
  );
};

export default AnswerButton;
