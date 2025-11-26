import React from "react";
import Lottie from "lottie-react";

interface QuizFeedbackOverlayProps {
  show: boolean;
  lottieUrl: string | null;
  lottieData: any;
  lottieAnimationKey: number;
}

const QuizFeedbackOverlay: React.FC<QuizFeedbackOverlayProps> = ({ show, lottieUrl, lottieData, lottieAnimationKey }) => {
  if (!show || !lottieUrl || !lottieData) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      <div className="w-32 h-32 sm:h-48 sm:w-48">
        <Lottie key={lottieAnimationKey} animationData={lottieData} loop={false} autoplay={true} />
      </div>
    </div>
  );
};

export default QuizFeedbackOverlay;
