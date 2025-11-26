import {
  type PropsWithChildren,
  createContext,
  useContext,
  useCallback,
  Suspense,
  type ReactElement,
} from "react";
import type { TAppConfig } from "../types/types";

const GameConfigContext = createContext<TAppConfig | undefined>(undefined);

const createResource = <T,>(promise: Promise<T>) => {
  let status = "pending";
  let result: T;
  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );

  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
};

const appDataPromise = async (): Promise<TAppConfig> => {
  const res = await fetch("./app-config/appConfig.json");
  const appConfig = (await res.json()) as TAppConfig;

  return appConfig;
};

const appResource = createResource(appDataPromise());

const useGameConfig = () => {
  const context = useContext(GameConfigContext);
  if (!context) {
    throw new Error("useAppConfig must be used within a AppConfigProvider");
  }

  const { theme, settings, content, assets } = context;

  const handleEnd = useCallback((answerNumber?: number) => {
    window.parent.postMessage({ message: 'finish', data: answerNumber }, '*')
  }, [])

  const handleScore = (points: number, text: string) => {
    console.log("update score: " + points)
    window.parent.postMessage(
      {
        message: "updateScore",
        value: points,
        choice: text,
      },
      "*",
    )
  }

  const resetGame = useCallback(() => {
    window.parent.postMessage({ message: 'reset' }, '*')
  }, [])

  return {
    resetGame,
    handleEnd,
    handleScore,
    theme,
    settings,
    content,
    assets,
  };
};

const GameConfig = ({ children }: PropsWithChildren): ReactElement => {
  //   const [finished, setFinished] = useState<boolean>(false);
  const appConfig = appResource.read();
  return (
    <GameConfigContext.Provider value={{ ...appConfig }}>
      {children}
    </GameConfigContext.Provider>
  );
};

const GameProvider = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <Suspense fallback={<div></div>}>
      <GameConfig>{children}</GameConfig>
    </Suspense>
  );
};

GameProvider.displayName = "AppConfigProvider";

export { GameProvider, useGameConfig };
