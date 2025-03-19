import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FaceEmotionDetector from '../components/FaceEmotionDetector';
import EmotionDisplay from '../components/EmotionDisplay';
import { EDUCATIONAL_CONTENT } from '../components/EmotionTypes';

const FaceEmotionPage: React.FC = () => {
  // Face detection state
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [detectionAttempts, setDetectionAttempts] = useState<number>(0);
  const [lastDetectionTime, setLastDetectionTime] = useState<Date | null>(null);
  
  // Mode toggles - set debug mode to true by default to show facial landmarks
  const [debugMode, setDebugMode] = useState<boolean>(true);
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
    if (videoWidth === 0 && videoHeight === 0) {
      const video = document.querySelector('video');
      if (video) {
        setVideoWidth(video.videoWidth);
        setVideoHeight(video.videoHeight);
      }
    }
  };

  // Track detection attempts
  const handleDetectionAttempt = () => {
    setDetectionAttempts(prev => prev + 1);
  };

  // Handle successful detection
  const handleDetectionSuccess = () => {
    console.log(`Detection success: ${currentEmotion}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Facial Emotion Detection</h1>
          <div className="flex space-x-4">
            <Link to="/challenge/multi-modal-sentiment" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Multi-Modal Analysis
            </Link>
          </div>
        </div>
        <p className="mt-4 text-gray-600 max-w-3xl">
          Analyze facial expressions in real-time to detect emotions. This technology identifies key facial landmarks
          and their relative positions to determine your emotional state.
        </p>
      </header>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setMirrorMode(!mirrorMode)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            mirrorMode 
              ? 'bg-green-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          {mirrorMode ? 'Mirror Mode: On' : 'Mirror Mode: Off'}
        </button>
        
        <button
          onClick={() => setEducationalMode(!educationalMode)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            educationalMode 
              ? 'bg-purple-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          {educationalMode ? 'Educational Mode: On' : 'Educational Mode: Off'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Face Detection Section */}
        <div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">👤</span> Facial Emotion Detection
              </h2>
              <p className="text-gray-600 mt-1">
                Your facial expressions can reveal your true emotions. This tool analyzes your face in real-time.
              </p>
            </div>
            
            <div className="relative">
              <FaceEmotionDetector 
                onEmotionDetected={handleEmotionDetected}
                debugMode={debugMode}
                isMirrorMode={mirrorMode}
                onDetectionAttempt={handleDetectionAttempt}
                onDetectionSuccess={handleDetectionSuccess}
              />
              
              {/* Visual indicator that facial landmarks are displayed */}
              <div className="absolute top-3 left-3 bg-blue-600 bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
                Facial Landmarks Active
              </div>
            </div>
            
            <div className="p-4 bg-indigo-50 border-t border-indigo-100">
              <div className="flex items-center text-indigo-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">
                  <strong>Pro Tip:</strong> {lastDetectionTime ? 'Facial emotion detected! Look at the landmarks to see how they track your expressions.' : 'No face detected yet. Try adjusting lighting or position.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Emotion Display & Educational Content */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 pb-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">😀</span> Emotion Display
              </h2>
              <p className="text-gray-600 mt-1">
                Visual representation of the detected emotion with confidence level.
              </p>
            </div>
            
            <div className="p-6">
              <EmotionDisplay
                currentEmotion={currentEmotion}
                confidence={emotionConfidence}
                isMirrorMode={mirrorMode}
              />
            </div>
          </div>
          
          {/* Facial Landmarks Explanation Section - Always visible */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">📍</span> Facial Landmarks
              </h2>
              <p className="text-gray-600 mt-1">
                Understanding the 68 facial landmarks used for emotion detection.
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">👁️</span>
                    <h4 className="font-medium">Eye Region (12 points)</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Tracks eye openness, eyelid position, and eye movement. Helps detect surprise, fear, and happiness.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">👄</span>
                    <h4 className="font-medium">Mouth Region (20 points)</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Monitors lip corners, openness, and shape. Critical for detecting smiles, frowns, and expressions of disgust.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">👃</span>
                    <h4 className="font-medium">Nose Region (9 points)</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Provides stable reference points and helps detect wrinkles that may indicate disgust or anger.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🤨</span>
                    <h4 className="font-medium">Eyebrow Region (10 points)</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Tracks eyebrow position and shape. Raised eyebrows often indicate surprise, while furrowed brows suggest anger.
                  </p>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium flex items-center mb-2">
                  <span className="text-xl mr-2">💡</span>
                  Why Landmarks Matter
                </h4>
                <p className="text-sm text-gray-700">
                  The relative positions and movements of these landmarks create unique patterns for each emotion.
                  AI models are trained on thousands of examples to recognize these patterns and classify them into emotions
                  like happiness, sadness, anger, surprise, fear, disgust, and neutral expressions.
                </p>
              </div>
            </div>
          </div>
          
          {educationalMode && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-2">🧠</span> How It Works
                </h2>
                <p className="text-gray-600 mt-1">
                  Learn about the technology behind facial emotion recognition.
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{EDUCATIONAL_CONTENT.intro.title}</h3>
                  <p className="text-gray-700">{EDUCATIONAL_CONTENT.intro.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {EDUCATIONAL_CONTENT.steps.map((step, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{step.icon}</span>
                        <h4 className="font-medium">{step.title}</h4>
                      </div>
                      <p className="text-sm text-gray-700">{step.description}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Facial Features Used</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EDUCATIONAL_CONTENT.facialFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-2xl mr-2">{feature.icon}</span>
                      <div>
                        <h4 className="font-medium">{feature.feature}</h4>
                        <p className="text-sm text-gray-700">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceEmotionPage; 