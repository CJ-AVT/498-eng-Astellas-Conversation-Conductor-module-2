import React from "react";
import AnswerButton from "@/components/AnswerButton";
import { TAnswer } from "@/types/types";

interface QuizAnswersProps {
  answers: TAnswer[];
  isMobile: boolean;
  selectedAnswerId: string | null;
  isSubmitted: boolean;
  showFeedbackOverlay: boolean;
  handleAnswerSelect: (id: string) => void;
  animateAnswers: boolean[];
  pointsConfig: any;
  answerButtonHoverState: boolean;
  hideAnswers: boolean;
}

const QuizAnswers: React.FC<QuizAnswersProps> = ({ answers, isMobile, selectedAnswerId, isSubmitted, showFeedbackOverlay, handleAnswerSelect, animateAnswers, pointsConfig, answerButtonHoverState, hideAnswers }) => {
  if (hideAnswers) return null;
  return (
    <>
      {answers.map((answer, index) => (
        <AnswerButton isMobile={isMobile} key={answer.id} answer={answer} pointsConfig={pointsConfig} isSelected={selectedAnswerId === answer.id} isSubmitted={isSubmitted} isDisabled={isSubmitted || showFeedbackOverlay} onClick={() => handleAnswerSelect(answer.id)} animate={animateAnswers[index] || false} animationDirection={index % 2 === 0 ? "left" : "right"} answerButtonHoverState={answerButtonHoverState} />
      ))}
    </>
  );
};

export default QuizAnswers;
