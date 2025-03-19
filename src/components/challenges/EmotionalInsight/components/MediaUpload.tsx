import React, { useState } from 'react';
import FaceEmotionDetector from './FaceEmotionDetector';
import EmotionDisplay from './EmotionDisplay';
import DebugPanel from './DebugPanel';
import EducationalModeExplanation from './EducationalModeExplanation';

interface MediaUploadProps {
  onUpload: (type: 'video' | 'audio' | 'text', url: string | null, text: string | null) => void;
  onApiKeyUpdate: (apiKey: string) => void;
  apiKey: string;
  isLoading?: boolean;
}

// Map of emotions to emojis
const EMOTION_EMOJIS: Record<string, { emoji: string, color: string, description: string }> = {
  'neutral': { 
    emoji: '😐', 
    color: '#A0AEC0',
    description: 'No strong emotion detected'
  },
  'happy': { 
    emoji: '😄', 
    color: '#48BB78',
    description: 'Joy and happiness detected'
  },
  'sad': { 
    emoji: '😢', 
    color: '#4299E1',
    description: 'Sadness detected'
  },
  'angry': { 
    emoji: '😡', 
    color: '#F56565',
    description: 'Anger detected'
  },
  'fearful': { 
    emoji: '😨', 
    color: '#ED8936',
    description: 'Fear detected'
  },
  'disgusted': { 
    emoji: '🤢', 
    color: '#9AE6B4',
    description: 'Disgust detected'
  },
  'surprised': { 
    emoji: '😲', 
    color: '#9F7AEA',
    description: 'Surprise detected'
  }
};

// Educational content about facial emotion recognition
const EDUCATIONAL_CONTENT = {
  intro: {
    title: "How AI Recognizes Emotions",
    description: "AI uses computer vision techniques to identify facial expressions and associate them with emotions."
  },
  steps: [
    {
      title: "1. Face Detection",
      description: "First, the AI detects faces in the image by identifying patterns of light and dark that make up facial features.",
      icon: "🔍"
    },
    {
      title: "2. Facial Landmarks",
      description: "Next, it identifies 68 key points on the face (landmarks) such as eyes, eyebrows, nose, mouth, and jaw outline.",
      icon: "📍"
    },
    {
      title: "3. Expression Analysis",
      description: "The AI analyzes the relative positions of these landmarks to identify expressions like smiles, frowns, or raised eyebrows.",
      icon: "🧠"
    },
    {
      title: "4. Emotion Classification",
      description: "Finally, these expressions are classified into emotions based on patterns learned from thousands of labeled examples.",
      icon: "🏷️"
    }
  ],
  facialFeatures: [
    {
      feature: "Eyes",
      description: "Wide eyes often indicate surprise, narrowed eyes may suggest anger or suspicion.",
      icon: "👁️"
    },
    {
      feature: "Eyebrows",
      description: "Raised eyebrows can indicate surprise, while furrowed brows often show concentration or anger.",
      icon: "🤨"
    },
    {
      feature: "Mouth",
      description: "Upturned corners indicate happiness, downturned suggest sadness or disappointment.",
      icon: "👄"
    },
    {
      feature: "Overall Tension",
      description: "Muscle tension in the face can indicate stress, fear, or anger.",
      icon: "😬"
    }
  ]
};

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  onUpload, 
  onApiKeyUpdate,
  apiKey,
  isLoading 
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'text'>('text');
  const [textContent, setTextContent] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  
  // Face detection state
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [detectionAttempts, setDetectionAttempts] = useState<number>(0);
  const [lastDetectionTime, setLastDetectionTime] = useState<Date | null>(null);
  
  // Mode toggles
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [mirrorMode, setMirrorMode] = useState<boolean>(true);
  const [educationalMode, setEducationalMode] = useState<boolean>(false);
  
  // Video dimensions
  const [videoWidth, setVideoWidth] = useState<number>(0);
  const [videoHeight, setVideoHeight] = useState<number>(0);

  // Handle emotion detection from FaceEmotionDetector
  const handleEmotionDetected = (emotion: string, confidence: number) => {
    setCurrentEmotion(emotion);
    setEmotionConfidence(confidence);
    setLastDetectionTime(new Date());
  };

  // Track detection attempts
  const handleDetectionAttempt = () => {
    setDetectionAttempts(prev => prev + 1);
  };

  // Handle successful detection
  const handleDetectionSuccess = () => {
    // Could add additional logic here if needed
  };

  // Handle form submission
  const handleSubmit = () => {
    if (activeTab === 'text') {
      onUpload('text', null, textContent);
    } else if ((activeTab === 'video' && videoUrl) || (activeTab === 'audio' && audioUrl)) {
      onUpload(
        activeTab, 
        activeTab === 'video' ? videoUrl : audioUrl, 
        null
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Upload Media</h2>
        <p className="text-gray-600">Choose a type of media to analyze emotions</p>
      </div>

      <div className="mb-4">
        <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('text')}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
              activeTab === 'text'
                ? 'bg-white shadow'
                : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
              activeTab === 'video'
                ? 'bg-white shadow'
                : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
            }`}
          >
            Video
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
              activeTab === 'audio'
                ? 'bg-white shadow'
                : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
            }`}
          >
            Audio
          </button>
        </div>
      </div>

      {activeTab === 'text' && (
        <div className="space-y-4">
          <textarea
            placeholder="Enter text to analyze..."
            className="w-full min-h-[200px] p-2 border border-gray-300 rounded-md"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          <button 
            onClick={handleSubmit} 
            disabled={!textContent.trim()}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Analyze Text
          </button>
        </div>
      )}

      {activeTab === 'video' && (
        <div className="space-y-6">
          {/* Mode control panel */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mirror-mode"
                checked={mirrorMode}
                onChange={() => setMirrorMode(!mirrorMode)}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="mirror-mode" className="text-sm text-gray-700">Mirror Mode</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="educational-mode"
                checked={educationalMode}
                onChange={() => setEducationalMode(!educationalMode)}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="educational-mode" className="text-sm text-gray-700">Educational Mode</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="debug-mode"
                checked={debugMode}
                onChange={() => setDebugMode(!debugMode)}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="debug-mode" className="text-sm text-gray-700">Debug Mode</label>
            </div>
          </div>
          
          {/* Face detection component */}
          <FaceEmotionDetector
            onEmotionDetected={handleEmotionDetected}
            debugMode={debugMode}
            isMirrorMode={mirrorMode}
            onDetectionAttempt={handleDetectionAttempt}
            onDetectionSuccess={handleDetectionSuccess}
          />
          
          {/* Emotion display */}
          <EmotionDisplay
            currentEmotion={currentEmotion}
            confidence={emotionConfidence}
            isMirrorMode={mirrorMode}
          />
          
          {/* Debug information */}
          <DebugPanel
            debugMode={debugMode}
            detectionAttempts={detectionAttempts}
            lastDetectionTime={lastDetectionTime}
            currentEmotion={currentEmotion}
            currentConfidence={emotionConfidence}
            isMirrorMode={mirrorMode}
            isEducationalMode={educationalMode}
            videoWidth={videoWidth}
            videoHeight={videoHeight}
          />
          
          {/* Educational content */}
          {educationalMode && <EducationalModeExplanation />}
          
          <button 
            onClick={handleSubmit} 
            disabled={activeTab === 'video' && !videoUrl}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Upload Video
          </button>
        </div>
      )}

      {activeTab === 'audio' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
            <p className="text-gray-500 mb-4">Upload an audio file to analyze emotions in speech</p>
            <button className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Select Audio File
            </button>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={activeTab === 'audio' && !audioUrl}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Upload Audio
          </button>
        </div>
      )}
    </div>
  );
};

// Add this TypeScript declaration
declare global {
  interface Window {
    faceapi: any;
  }
}

export default MediaUpload; 