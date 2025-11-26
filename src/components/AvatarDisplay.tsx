import React from 'react';

interface AvatarDisplayProps {
  avatarUrl: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatarUrl }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <img 
        src={avatarUrl} 
        alt="Character Avatar" 
        className="object-contain max-h-[40vh] sm:max-h-[40vh] max-w-[80%] sm:max-w-[70%] drop-shadow-2xl transition-all duration-200"
        style={{ minHeight: 40 }}
      />
    </div>
  );
};

export default AvatarDisplay;