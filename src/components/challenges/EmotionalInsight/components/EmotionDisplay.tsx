import React from 'react';
import { EMOTION_EMOJIS } from './EmotionTypes';

interface EmotionDisplayProps {
  currentEmotion: string;
  confidence: number;
  isMirrorMode: boolean;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ 
  currentEmotion, 
  confidence,
  isMirrorMode
}) => {
  const emotionData = EMOTION_EMOJIS[currentEmotion] || EMOTION_EMOJIS.neutral;
  
  return (
    <div className="mt-4">
      <div className="flex flex-col items-center">
        {isMirrorMode ? (
          <div className="text-center">
            <div className="text-7xl mb-2 transition-all duration-300 transform hover:scale-110" 
                 style={{ color: emotionData.color }}>
              {emotionData.emoji}
            </div>
            <p className="font-medium text-gray-700">{currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}</p>
            <p className="text-sm text-gray-500">Confidence: {(confidence * 100).toFixed(1)}%</p>
            <p className="mt-1 text-xs text-gray-600">{emotionData.description}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            {Object.entries(EMOTION_EMOJIS).map(([emotion, data]) => (
              <div 
                key={emotion} 
                className={`p-3 rounded-lg flex flex-col items-center ${
                  currentEmotion === emotion 
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 shadow-sm' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="text-4xl mb-1" style={{ color: data.color }}>
                  {data.emoji}
                </div>
                <p className="text-sm font-medium">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</p>
                {currentEmotion === emotion && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDisplay; 