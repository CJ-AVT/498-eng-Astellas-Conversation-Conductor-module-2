import React, { useState, useEffect } from "react";
import { useGameConfig } from "./providers/appConfig.tsx";
import { TAppConfig } from "./types/types";
import VideoSplash from "./components/VideoSplash";
import QuizContainer from "./components/QuizContainer";
import Help from "./components/Help/Help";
import { TimerProvider } from "./components/Timer/TimerContext";
import Timer from "./components/Timer/Timer";

const App: React.FC = () => {
  const { theme, settings, content, assets, handleEnd } = useGameConfig();
  const [appData, setAppData] = useState<TAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, _setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [_finalScore, setFinalScore] = useState(0);

  /* Generate CSS variables programatically so that theme styles in the config can be changed post build */
  useEffect(() => {
    if (theme) {
      for (const [key, value] of Object.entries(theme.colors)) {
        document.documentElement.style.setProperty(`--color-${key}`, String(value));
      }
    }
  }, [theme]); // Re-run if the theme object changes

  useEffect(() => {
    // Correctly set the entire TAppConfig object to appData state
    setAppData({ content, theme, assets, settings });

    // Determine whether to show the video based on the start video asset
    setShowVideo(!!assets.videos.startVideoURL);

    setIsLoading(false);
  }, [settings, content]); // Add dependencies to the useEffect hook

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-white bg-slate-800">Loading Quiz...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen p-4 text-xl text-white bg-red-800">Error: {error}</div>;
  }

  if (!appData) {
    return <div className="flex items-center justify-center min-h-screen p-4 text-xl text-white bg-slate-800">Quiz data error.</div>;
  }

  // Access start video from assets
  if (showVideo && assets.videos.startVideoURL) {
    return <VideoSplash videoUrl={assets.videos.startVideoURL} onEnd={() => setShowVideo(false)} />;
  }

  if (quizCompleted) {
    handleEnd();
  }

  return (
    <TimerProvider>
      {settings.enableTimer ? <Timer /> : null}
      {settings.helpPopupEnabled ? <Help /> : null}
      <QuizContainer
        onQuizComplete={(score) => {
          setFinalScore(score);
          setQuizCompleted(true);
        }}
      />
    </TimerProvider>
  );
};

export default App;
