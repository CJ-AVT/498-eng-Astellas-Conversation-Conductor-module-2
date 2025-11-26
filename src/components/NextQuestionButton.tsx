import { useEffect, useState } from "react";
import { useGameConfig } from "@/providers/appConfig";

interface NextQuestionProps {
  onNext: () => void;
  disabled?: boolean;
  className?: string;
  isLastQuestion: boolean;
}

const NextQuestion: React.FC<NextQuestionProps> = ({ onNext, disabled, className, isLastQuestion }) => {
  const { content } = useGameConfig();

  // Internal state to hold the button's text.
  const [buttonText, setButtonText] = useState(isLastQuestion ? content.continueText : content.nextText);

  // We determine visibility based on the className passed from the parent.
  const isVisible = !className?.includes("opacity-0");

  useEffect(() => {
    // This effect ensures the button's text is only updated when it is visible.
    // When the button fades out, `isVisible` becomes false, and this check prevents
    // the text from changing mid-animation. The text will be correctly set
    // on the next render when `isVisible` is true again.
    if (isVisible) {
      setButtonText(isLastQuestion ? content.continueText : content.nextText);
    }
  }, [isVisible, isLastQuestion, content.continueText, content.nextText]);

  return (
    <button onClick={onNext} disabled={disabled} className={`sm:max-w-60 opacity-0 pointer-events-none ml-3 mr-3 w-full px-6 py-2 mt-4 h-12 hover:cursor-pointer font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 active:scale-95 disabled:opacity-50 ${className || ""}`} aria-label="Next Question">
      {buttonText}
    </button>
  );
};

export default NextQuestion;
