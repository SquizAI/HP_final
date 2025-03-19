import React from 'react';

interface RecordButtonProps {
  isListening: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const RecordButton: React.FC<RecordButtonProps> = ({ 
  isListening, 
  onClick,
  size = 'md'
}) => {
  // Icon for play state
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
      className={size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}>
      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
  );
  
  // Icon for stop state
  const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
      className={size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}>
      <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
    </svg>
  );
  
  // Size classes
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };
  
  const paddingClasses = {
    sm: 'm-1',
    md: 'm-1.5',
    lg: 'm-2'
  };
  
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick}
        className={`relative ${sizeClasses[size]} rounded-xl transition-all duration-300 focus:outline-none shadow-lg
          ${isListening ? 'bg-blue-500' : 'bg-blue-600'}`}
        aria-label={isListening ? "Stop recording" : "Start recording"}
      >
        {/* Inner button with pink/magenta background */}
        <div className={`absolute inset-0 ${paddingClasses[size]} rounded-lg flex items-center justify-center 
          ${isListening ? 'bg-red-500' : 'bg-pink-500'} transition-all duration-300`}>
          <span className="text-white">
            {isListening ? <StopIcon /> : <PlayIcon />}
          </span>
        </div>
      </button>
      
      {/* Button label */}
      <span className="mt-2 text-sm font-medium text-gray-700">
        {isListening ? 'Stop & Analyze' : 'Start Dictating'}
      </span>
    </div>
  );
};

export default RecordButton; 