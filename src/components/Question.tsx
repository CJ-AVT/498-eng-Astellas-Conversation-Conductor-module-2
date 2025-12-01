import React from "react";

interface QuestionBubbleProps {
  person: string;
  text: string;
  animate: boolean;
}

const QuestionBubble: React.FC<QuestionBubbleProps> = ({ person, text, animate }) => {
  return (
    <div className="relative">
      <div
        className={`relative bg-[var(--color-question-background)] backdrop-blur-sm p-4 sm:p-10 rounded-xl shadow-xl text-[var(--color-question-text)] text-sm sm:text-lg leading-relaxed w-4xl transition-all duration-500 ${animate ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
        style={{
          transitionTimingFunction: animate ? "cubic-bezier(0.25, 0.8, 0.25, 1)" : "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
          transitionDelay: animate ? "100ms" : "0ms",
        }}
      >
        <span className="text-2xl font-bold">{person}</span>
        <span className="text-2xl">{text}</span>
        {/* Speech bubble tail */}
        <div 
              className="absolute left-40 top-[30%]"
              style={{
                borderTop: '22px solid transparent',
                borderBottom: '20px solid transparent',
                borderRight: `36px solid var(--color-question-background)`,
                filter: 'bg-[var(--color-question-background)] )',
                transform: 'translateX(100%) translateY(-150%) rotate(90deg)'
              }}
            />
        </div>
      </div>
    
  );
};

export default QuestionBubble;
