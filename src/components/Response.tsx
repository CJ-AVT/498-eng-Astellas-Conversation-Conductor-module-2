import React from "react";

interface ResponseBubbleProps {
  person: string;
  response: string;
  animate: boolean;
}

const ResponseBubble: React.FC<ResponseBubbleProps> = ({ person, response, animate }) => {
  return (
    <div className="relative z-10">
      <div className={`bg-[var(--color-question-background)]/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl text-[var(--color-question-text)] text-sm sm:text-lg leading-relaxed w-5xl 2xl:w-6xl transition-all duration-500 ${animate ? "translate-y-0 opacity-100" : "-translate-y-16 opacity-0"}`}>
        <p className="text-base sm:text-lg md:text-xl">
          <span className="font-bold">{person}</span>
          <span>{response}</span>
        </p>
      </div>
    </div>
  );
};

export default ResponseBubble;
