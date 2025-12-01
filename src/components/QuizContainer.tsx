import React, { useState, useEffect, useCallback, useRef } from "react";
import { useGameConfig } from "@/providers/appConfig";
import StreakPopup from "@/components/StreakPopup";
import QuizBackground from "@/components/QuizBackground";
import QuizFeedbackOverlay from "@/components/QuizFeedbackOverlay";
import QuizQuestionArea from "@/components/QuizQuestionArea";
import QuizAnswers from "@/components/QuizAnswers";
import { useTimer } from "@/components/Timer/TimerContext";

interface QuizContainerProps {
  onQuizComplete: (score: number) => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({ onQuizComplete }) => {
  const { settings, content, assets } = useGameConfig();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(settings.initialScore || 0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showFeedbackOverlay, setShowFeedbackOverlay] = useState(false);
  const [feedbackLottieUrl, setFeedbackLottieUrl] = useState<string | null>(null);
  const [feedbackLottieData, setFeedbackLottieData] = useState<any>(null);
  const [lottieAnimationKey, setLottieAnimationKey] = useState(0);
  const [animateQuestion, setAnimateQuestion] = useState(true);
  const [animateAnswers, setAnimateAnswers] = useState<boolean[]>([]);
  const [streakPopup, setStreakPopup] = useState<{
    points: number;
    streak: number;
    key: number;
  } | null>(null);
  const mobileBoundary = settings.mobileBoundary;
  const [isMobile, setIsMobile] = useState(window.innerWidth < mobileBoundary);
  const [currentProgress, setCurrentProgress] = useState(settings.progressBarStartingPercentage);
  const [hideAnswers, setHideAnswers] = useState(false);
  const [resetKey, _setResetKey] = useState(0);
  const [backgroundVariant, setBackgroundVariant] = useState<
    "ambient" | "neutral" | "positive" | "negative"
  >("ambient");
  const [showNextButton, setShowNextButton] = useState(false);

  const ambientVideoRef = useRef<HTMLVideoElement | null>(null);
  const neutralVideoRef = useRef<HTMLVideoElement | null>(null);
  const positiveVideoRef = useRef<HTMLVideoElement | null>(null);
  const negativeVideoRef = useRef<HTMLVideoElement | null>(null);

  const questionIndex = Math.min(currentQuestionIndex, content.questions.length - 1);
  const currentQuestion = content.questions[questionIndex];
  const selectedAnswer = selectedAnswerId
    ? currentQuestion.answers.find((a) => a.id === selectedAnswerId)
    : null;
  const isLastQuestion = currentQuestionIndex === content.questions.length - 1;
  const { getElapsedTime } = useTimer();
  const maxScore = settings.points.correct * content.questions.length;

  const getVideoUrlForVariant = (variant: "ambient" | "neutral" | "positive" | "negative") => {
    const v = assets.videos;
    if (isMobile) {
      if (variant === "neutral") return v.backgroundVideoMobileNeutralURL;
      if (variant === "positive") return v.backgroundVideoMobilePositiveURL;
      if (variant === "negative") return v.backgroundVideoMobileNegativeURL;
      return v.backgroundVideoMobileAmbientURL;
    } else {
      if (variant === "neutral") return v.backgroundVideoDesktopNeutralURL;
      if (variant === "positive") return v.backgroundVideoDesktopPositiveURL;
      if (variant === "negative") return v.backgroundVideoDesktopNegativeURL;
      return v.backgroundVideoDesktopAmbientURL;
    }
  };

  useEffect(() => {
    const videoMap: Record<string, HTMLVideoElement | null> = {
      ambient: ambientVideoRef.current,
      neutral: neutralVideoRef.current,
      positive: positiveVideoRef.current,
      negative: negativeVideoRef.current,
    };
    for (const [variant, element] of Object.entries(videoMap)) {
      if (!element) continue;
      if (variant === backgroundVariant) {
        try {
          element.currentTime = 0;
        } catch {}
        element.play().catch(() => {});
      } else {
        element.pause();
      }
    }
  }, [backgroundVariant]);

  useEffect(() => {
    [ambientVideoRef, neutralVideoRef, positiveVideoRef, negativeVideoRef].forEach((ref) => {
      if (ref.current) {
        try {
          ref.current.load();
        } catch {}
      }
    });
  }, [isMobile]);

  useEffect(() => {
    setHideAnswers(false);
    setAnimateQuestion(false);
    const answerCount = currentQuestion?.answers?.length || 0;
    setAnimateAnswers(new Array(answerCount).fill(false));
    const timeout = setTimeout(() => {
      setAnimateQuestion(true);
      setAnimateAnswers(new Array(answerCount).fill(true));
    }, 100);
    return () => clearTimeout(timeout);
  }, [currentQuestionIndex, currentQuestion?.answers?.length]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < mobileBoundary);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBoundary]);

  useEffect(() => {
    if (feedbackLottieUrl) {
      fetch(feedbackLottieUrl)
        .then((res) => res.json())
        .then(setFeedbackLottieData)
        .catch(() => setFeedbackLottieData(null));
    } else {
      setFeedbackLottieData(null);
    }
  }, [feedbackLottieUrl]);

  useEffect(() => {
    if (streakPopup) {
      const timer = setTimeout(() => setStreakPopup(null), 1200);
      return () => clearTimeout(timer);
    }
  }, [streakPopup]);

  const playSound = (url: string | null) => {
    if (url) new Audio(url).play();
  };

  const advanceToNext = useCallback(() => {
    setShowFeedbackOverlay(false);
    setFeedbackLottieUrl(null);
    setFeedbackLottieData(null);
    setIsSubmitted(false);
    setSelectedAnswerId(null);
    setBackgroundVariant("ambient");

    if (currentQuestionIndex + 1 >= content.questions.length) {
      onQuizComplete(score);
      window.parent.postMessage({ message: "nextSlide", value: "nextSlide" }, "*");
    } else {
      setCurrentQuestionIndex((idx) => idx + 1);
    }
  }, [currentQuestionIndex, content.questions.length, onQuizComplete, score]);

  const handleNextQuestion = () => {
    setShowNextButton(false);
    advanceToNext();
  };

  const handleAnswerSelect = useCallback(
    (answerId: string) => {
      if (isSubmitted || !currentQuestion) return;

      const progressChangeAmount = settings.progressBarChangePercentage;
      setSelectedAnswerId(answerId);
      setIsSubmitted(true);
      setAnimateQuestion(false);
      setBackgroundVariant("neutral");

      const selected = currentQuestion.answers.find((a) => a.id === answerId);
      if (!selected) return;

      let pointsAwarded = selected.points;
      let lottieUrlToPlay: string | null;
      let soundUrlToPlay: string | null;
      let newScore = score;
      let wasCorrect = false; // Flag to track if the answer was correct

      const { correct, neutral } = settings.points;

      console.log("pointsAwarded", pointsAwarded);

      if (pointsAwarded === correct) {
        wasCorrect = true;
        const streakBonus = settings.enableStreakBonus
          ? currentStreak > 0
            ? currentStreak * 10
            : 0
          : 0;
        pointsAwarded += streakBonus;
        setCurrentProgress((prev) => Math.min(100, prev + progressChangeAmount));

        newScore = score + pointsAwarded;
        setScore(newScore);

        const newStreak = Math.min(currentStreak + 1, settings.maxStreak);
        setCurrentStreak(newStreak);
        lottieUrlToPlay = assets.lotties.correctLottieURL;
        soundUrlToPlay = assets.sfx.correctSoundURL;
        setBackgroundVariant("positive");
        setStreakPopup({ points: pointsAwarded, streak: newStreak, key: Date.now() });
      } else if (pointsAwarded === neutral) {
        setCurrentStreak(0);
        lottieUrlToPlay = assets.lotties.neutralLottieURL;
        soundUrlToPlay = assets.sfx.correctSoundURL;
        setBackgroundVariant("neutral");
      } else {
        setCurrentProgress((prev) => Math.max(0, prev - progressChangeAmount));
        setCurrentStreak(0);
        lottieUrlToPlay = assets.lotties.wrongLottieURL;
        soundUrlToPlay = assets.sfx.wrongSoundURL;
        setBackgroundVariant("negative");
      }

      window.parent.postMessage(
        { message: "updateScore", value: pointsAwarded, choice: selected.text },
        "*"
      );

      if (!settings.volumeOff) {
        playSound(soundUrlToPlay);
      }

      const prepareForNextQuestion = () => {
        setAnimateAnswers(new Array(currentQuestion.answers.length).fill(false));
        setTimeout(() => {
          setHideAnswers(true);
          // Hide the regular lottie overlay to make way for what comes next.
          setShowFeedbackOverlay(false);

          const elapsedTime = getElapsedTime();
          const hasReachedBonusConditions =
            isLastQuestion && newScore === maxScore && elapsedTime <= settings.timerAllowance;

          if (wasCorrect && hasReachedBonusConditions && assets.lotties.bonusPointsLottieURL) {
            setFeedbackLottieUrl(assets.lotties.bonusPointsLottieURL);
            setLottieAnimationKey((prev) => prev + 1);
            setShowFeedbackOverlay(true);

            const bonusPoints = (maxScore * settings.points.bonusPercentage) / 100;

            window.parent.postMessage(
              { message: "updateScore", value: bonusPoints, choice: "" },
              "*"
            );

            // After the bonus lottie finishes, hide it and show the continue button.
            setTimeout(() => {
              setShowFeedbackOverlay(false);
              setShowNextButton(true);
            }, settings.lottieAnimationDuration || 2000);
          } else {
            // If no bonus, show the 'Next/Continue' button right away.
            setShowNextButton(true);
          }
        }, 500); // This timeout allows the answer-hide animation to run.
      };

      if (lottieUrlToPlay) {
        setFeedbackLottieUrl(lottieUrlToPlay);
        setLottieAnimationKey((prev) => prev + 1);
        setShowFeedbackOverlay(true);
        // Wait for the regular lottie to play, then prepare the next step.
        setTimeout(prepareForNextQuestion, 500);
      } else {
        // If there's no lottie, proceed after a short delay.
        setTimeout(prepareForNextQuestion, 500);
      }
    },
    [
      isSubmitted,
      currentQuestion,
      score,
      currentStreak,
      isLastQuestion,
      settings,
      assets,
      content,
      advanceToNext,
      onQuizComplete,
    ]
  );

  const answerProps = {
    answers: currentQuestion.answers,
    isMobile,
    selectedAnswerId,
    isSubmitted,
    showFeedbackOverlay,
    handleAnswerSelect,
    animateAnswers,
    pointsConfig: settings.points,
    answerButtonHoverState: settings.answerButtonHoverState || false,
    hideAnswers,
  };

  const questionAreaProps = {
    isMobile,
    currentQuestion,
    animateQuestion,
    isSubmitted,
    selectedAnswer,
    currentProgress,
    showNextButton,
    handleNextQuestion,
    isLastQuestion,
  };

  return (
    <div
      key={resetKey}
      className="relative flex h-full min-h-screen w-full select-none flex-col items-center justify-start overflow-hidden bg-[var(--color-page-background)] transition-opacity duration-500"
    >
      <div className="flex overflow-hidden flex-col justify-start items-center w-full h-full min-h-screen select-none">
        {settings.enableStreakBonus && <StreakPopup streakPopup={streakPopup} />}

        <div className="flex relative z-0 flex-col mx-auto w-full max-w-2xl h-full xl:max-w-screen sm:px-0">
          <QuizBackground
            backgroundVariant={backgroundVariant}
            getVideoUrlForVariant={getVideoUrlForVariant}
            assets={assets}
            settings={settings}
            ambientVideoRef={ambientVideoRef}
            neutralVideoRef={neutralVideoRef}
            positiveVideoRef={positiveVideoRef}
            negativeVideoRef={negativeVideoRef}
          />

          <div className="flex relative z-10 flex-col w-full h-full">
            {settings.showQuestionCounter && (
              <div className="flex justify-center items-center py-1 pt-4 mb-1 w-full">
                <span className="px-3 py-1 text-xs font-semibold rounded-full shadow bg-slate-800/60 text-slate-300 sm:text-base">
                  Question {currentQuestionIndex + 1}/{content.questions.length}
                </span>
              </div>
            )}

            {isMobile ? (
              <>
                <QuizQuestionArea {...questionAreaProps} />
                <footer className="space-y-2.5 bg-transparent p-2 pb-10 pt-2 text-center">
                  <QuizAnswers {...answerProps} />
                </footer>
              </>
            ) : (
              <div className="flex relative w-full h-full items-end justify-center">
                <div className="flex flex-col z-10 w-11/12 h-full pb-30">
                  <div className="flex flex-row relative z-10 items-end gap-10 h-full">
                    <div className="relative w-2/3">
                    {/* Cover Image */}
                    {assets.images.coverImageURL && (
                    <img
                      src={assets.images.coverImageURL}
                        alt="Background"
                        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 transition-opacity duration-700 ease-in-out
                          ${isSubmitted && selectedAnswer ? 'opacity-0' : 'opacity-100'}`}
                      />
                    )}
                    </div>
                    <div className="relative z-20 flex flex-col gap-5 pointer-events-auto items-center w-2xl h-full justify-end top-10 left-10 -ri">
                      <h1 className={`text-white text-xl font-bold text-center bg-[var(--color-answer-background)]/50 pt-4 pb-4 w-11/12 -top-4 ${isSubmitted && selectedAnswer ? 'opacity-0' : 'opacity-100'}`}>{content.questionPrompt}</h1>
                      <QuizAnswers {...answerProps} />
                      <div className="w-full flex flex-col gap-2 items-end justify-end">
                        <div className="flex flex-col gap-2 w-3/4 items-center">
                          <p className="text-white font-bold rounded-lg bg-[var(--color-answer-background)]/50 pt-2 pb-2 pr-8 pl-8">
                            Datasets Available
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 w-3/4">
                          <p className="flex flex-col gap-2 text-white font-medium rounded-lg bg-[var(--color-answer-background)]/50 p-6">
                            <div className="flex flex-row gap-2 items-center">
                              <span className="text-lg">CRM - </span>
                              <span className="font-normal">4,600 verified HCP interactions</span>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                              <span className="text-lg">Webinar - </span>
                              <span className="font-normal">120 attendees (agency data)</span>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                              <span className="text-lg">Patient App - </span>
                              <span className="font-normal">adherence data (missing consent)</span>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                              <span className="text-lg">IQVIA Market Report - </span>
                              <span className="font-normal">aggregated trend data</span>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                              <span className="text-lg">Forecasting Sheet - </span>
                              <span className="font-normal">last updated 6 months ago</span>
                            </div>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <QuizQuestionArea {...questionAreaProps} />
                </div>
              </div>
            )}

            <QuizFeedbackOverlay
              show={showFeedbackOverlay}
              lottieUrl={feedbackLottieUrl}
              lottieData={feedbackLottieData}
              lottieAnimationKey={lottieAnimationKey}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizContainer;
