import React from "react";

interface QuizCompletedProps {
  score: number;
  backgroundImageUrl: string;
  onRestart: () => void;
}

const QuizCompleted: React.FC<QuizCompletedProps> = ({ score, backgroundImageUrl, onRestart }) => (
  <div className="flex min-h-screen select-none flex-col items-center justify-center bg-gray-800 p-4 text-white" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
    <div className="relative z-10 rounded-xl bg-black/70 p-8 text-center shadow-2xl">
      <h2 className="mb-4 text-4xl font-bold">Quiz Completed!</h2>
      <p className="mb-6 text-2xl">Your final score: {score}</p>
      <button onClick={onRestart} className="transform rounded-lg bg-orange-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-orange-600 hover:shadow-xl active:scale-95">
        Play Again
      </button>
    </div>
  </div>
);

export default QuizCompleted;
