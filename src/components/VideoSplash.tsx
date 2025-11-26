import React from 'react';

interface VideoSplashProps {
  videoUrl: string;
  onEnd: () => void;
}

const VideoSplash: React.FC<VideoSplashProps> = ({ videoUrl, onEnd }) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
    <video
      src={videoUrl}
      className="w-full h-full object-contain bg-black"
      controls={false}
      autoPlay
      playsInline
      onEnded={onEnd}
    />
    <button
      className="absolute top-4 right-4 px-4 py-2 bg-white/80 text-black rounded-lg shadow font-semibold text-base"
      onClick={onEnd}
    >
      Skip
    </button>
  </div>
);

export default VideoSplash;