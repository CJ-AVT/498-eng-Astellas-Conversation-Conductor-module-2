import React, { RefObject } from "react";

interface QuizBackgroundProps {
  backgroundVariant: "ambient" | "neutral" | "positive" | "negative";
  getVideoUrlForVariant: (variant: "ambient" | "neutral" | "positive" | "negative") => string;
  assets: any;
  settings: any;
  ambientVideoRef: RefObject<HTMLVideoElement>;
  neutralVideoRef: RefObject<HTMLVideoElement>;
  positiveVideoRef: RefObject<HTMLVideoElement>;
  negativeVideoRef: RefObject<HTMLVideoElement>;
}

const QuizBackground: React.FC<QuizBackgroundProps> = ({ backgroundVariant, getVideoUrlForVariant, assets, settings, ambientVideoRef, neutralVideoRef, positiveVideoRef, negativeVideoRef }) => (
  <div className="overflow-hidden absolute inset-0 w-full h-full pointer-events-none">
    <video ref={ambientVideoRef} src={getVideoUrlForVariant("ambient")} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${backgroundVariant === "ambient" ? "opacity-100" : "opacity-0"}`} autoPlay muted playsInline loop={settings.backgroundVideoLoop} preload="auto" />
    <video ref={neutralVideoRef} src={getVideoUrlForVariant("neutral")} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${backgroundVariant === "neutral" ? "opacity-100" : "opacity-0"}`} autoPlay muted playsInline loop={settings.backgroundVideoLoop} preload="auto" />
    <video ref={positiveVideoRef} src={getVideoUrlForVariant("positive")} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${backgroundVariant === "positive" ? "opacity-100" : "opacity-0"}`} autoPlay muted playsInline loop={settings.backgroundVideoLoop} preload="auto" />
    <video ref={negativeVideoRef} src={getVideoUrlForVariant("negative")} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${backgroundVariant === "negative" ? "opacity-100" : "opacity-0"}`} autoPlay muted playsInline loop={settings.backgroundVideoLoop} preload="auto" />
    <div
      className="absolute inset-0 w-full h-full bg-cover"
      style={{
        backgroundImage: `url(${assets.images.backgroundImageURL})`,
      }}
    />
    {/* <div className="absolute inset-0 z-10 bg-black/40"></div> */}
  </div>
);

export default QuizBackground;
