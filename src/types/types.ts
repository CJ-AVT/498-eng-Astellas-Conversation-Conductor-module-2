export interface TPoints {
  correct: number;
  neutral: number;
  incorrect: number;
  bonusPercentage: number;
}

export interface TAnswer {
  id: string;
  text: string;
  response: string;
  points: number;
}

export interface TAppConfig {
  content: {
    progressMeterTitle: string;
    nextText: string;
    continueText: string;
    timerTitle: string;
    timerDemonimation1: string;
    timerDemonimation2: string;
    questions: {
      id: string;
      person: string;
      person_2: string;
      questionText: string;
      answers: TAnswer[];
    }[]
  };
  theme: {
    colors: {
      [key: string]: string | number;
    }
  };
  assets: {
    images: {
      backgroundImageURL?: string | null;
      coverImageURL?: string | null;
      notEffective: string;
      neutral: string;
      effective: string;
    }
    videos: {
      startVideoURL?: string;
      backgroundVideoDesktopAmbientURL: string;
      backgroundVideoDesktopNeutralURL: string;
      backgroundVideoDesktopPositiveURL: string;
      backgroundVideoDesktopNegativeURL: string;
      backgroundVideoMobileAmbientURL: string;
      backgroundVideoMobileNeutralURL: string;
      backgroundVideoMobilePositiveURL: string;
      backgroundVideoMobileNegativeURL: string;
    }
    lotties: {
      correctLottieURL: string | null;
      avatarImageURL: string | null;
      neutralLottieURL: string | null;
      wrongLottieURL: string | null;
      bonusPointsLottieURL: string | null;
    }
    sfx: {
      correctSoundURL: string | null;
      wrongSoundURL: string | null;
    }
  }
  settings: {
    initialScore: number;
    maxStreak: number;
    hideScore: boolean;
    endAutomatically: boolean;
    answerButtonHoverState: boolean;
    showFullScreenButton: boolean;
    showRestartButton: boolean;
    lottieAnimationDuration?: number; 
    backgroundVideoLoop?: boolean;
    helpPopupEnabled: true;
    mobileBoundary: number;
    progressBarChangePercentage: number;
    progressBarStartingPercentage: number;
    showQuestionCounter: boolean;
    enableStreakBonus: boolean;
    timerStartingValue: number;
    timerAllowance: number;
    showProgressMeter: boolean;
    enableTimer: boolean;
    volumeOff: boolean;
    points: TPoints;
  };
}
