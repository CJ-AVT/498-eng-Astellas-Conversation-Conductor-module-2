import React, { useEffect } from "react";
import Question from "@/components/Question";
import ProgressMeter from "@/components/ProgressMeter";
import NextQuestionButton from "@/components/NextQuestionButton";
import { TAnswer } from "@/types/types";
import { useGameConfig } from "@/providers/appConfig";

interface QuizQuestionAreaProps {
  isMobile: boolean;
  currentQuestion: any;
  animateQuestion: boolean;
  isSubmitted: boolean;
  selectedAnswer: TAnswer | null;
  currentProgress: number;
  showNextButton: boolean;
  isLastQuestion: boolean;
  handleNextQuestion: () => void;
}

const QuizQuestionArea: React.FC<QuizQuestionAreaProps> = ({ isMobile, currentQuestion, animateQuestion, isSubmitted, selectedAnswer, currentProgress, showNextButton, isLastQuestion, handleNextQuestion }) => {
  const nextButton = <NextQuestionButton onNext={handleNextQuestion} isLastQuestion={isLastQuestion} className={!showNextButton ? "opacity-0 pointer-events-none" : ""} />;

  const { settings, handleEnd } = useGameConfig();

  // Check if we should trigger handleEnd instead of showing next button
  useEffect(() => {
    if (isSubmitted && selectedAnswer && !showNextButton) {
      // Extract answer number from selectedAnswer (id format: "Answer_1", "Answer_2", etc.)
      const answerNumber = parseInt(selectedAnswer.id.replace('Answer_', ''));
      setTimeout(() => {
        handleEnd(answerNumber);
      }, 500);
    }
  }, [isSubmitted, selectedAnswer, showNextButton, handleEnd]);

  if (isMobile) {
    return (
      <main className="flex flex-col items-center justify-start flex-grow p-2 pt-2 overflow-y-auto scrollbar-hide">
        <div className="mb-2 mt-2 w-full max-w-[35rem] px-1">
          {nextButton}
          <Question person={currentQuestion.person} text={currentQuestion.questionText} animate={animateQuestion} />
        </div>
      </main>
    );
  }

  // Desktop
  return (
    <div className="relative transition-opacity duration-300 bottom-0">
      <div className="flex flex-col items-start pl-30 space-y-4">
        {nextButton}
        <Question person={currentQuestion.person} text={currentQuestion.questionText} animate={animateQuestion} />
      </div>
      {settings.showProgressMeter && <ProgressMeter percent={currentProgress} />}
    </div>
  );
};

export default QuizQuestionArea;
