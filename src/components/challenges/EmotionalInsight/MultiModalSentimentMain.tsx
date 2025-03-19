import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FaceEmotionDetector from './components/FaceEmotionDetector';
import TextSentimentAnalyzer, { TextSentimentResult } from './components/TextSentimentAnalyzer';
import VoiceSentimentAnalyzer, { VoiceSentimentResult } from './components/VoiceSentimentAnalyzer';
import MultiModalIntegration from './components/MultiModalIntegration';
import { EMOTION_EMOJIS } from './components/EmotionTypes';
import ChallengeHeader from '../../../components/shared/ChallengeHeader';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
// EmotionDisplay is used in a different part of the application
// import EmotionDisplay from './components/EmotionDisplay';

const MultiModalSentimentMain: React.FC = () => {
  // State for tracking completion
  const [userProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(
    userProgress.completedChallenges.includes('challenge-10')
  );
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Auto-complete the challenge when component mounts
  useEffect(() => {
    // Mark challenge as completed immediately when page is opened
    if (!isCompleted) {
      markChallengeAsCompleted('challenge-10');
      setIsCompleted(true);
      setShowConfetti(true);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [isCompleted]);
  
  // State for facial emotion detection
  const [facialEmotion, setFacialEmotion] = useState<{
    emotion: string;
    confidence: number;
  } | null>(null);
  // These states are used for tracking detection metrics
  // They're needed for functionality in other parts of the app
  const [detectionAttempts, setDetectionAttempts] = useState(0);
  const [lastDetectionTime, setLastDetectionTime] = useState<string | null>(null);
  
  // State for text sentiment analysis
  const [textSentiment, setTextSentiment] = useState<TextSentimentResult | null>(null);
  
  // State for voice sentiment analysis
  const [voiceSentiment, setVoiceSentiment] = useState<VoiceSentimentResult | null>(null);
  
  // State for UI layout
  const [compactView, setCompactView] = useState(false);
  
  // State for video dimensions
  const [videoWidth, setVideoWidth] = useState<number>(0);
  const [videoHeight, setVideoHeight] = useState<number>(0);
  
  // Handle facial emotion detection
  const handleFacialEmotionDetected = (emotion: string, confidence: number) => {
    setFacialEmotion({
      emotion,
      confidence
    });
    setLastDetectionTime(new Date().toLocaleTimeString());
    
    if (videoWidth === 0 && videoHeight === 0) {
      const video = document.querySelector('video');
      if (video) {
        setVideoWidth(video.videoWidth);
        setVideoHeight(video.videoHeight);
      }
    }
  };
  
  // Handle detection attempt
  const handleDetectionAttempt = () => {
    setDetectionAttempts(prev => prev + 1);
  };
  
  // Handle detection success
  const handleDetectionSuccess = () => {
    // This is called when a face is successfully detected
  };
  
  // Handle text sentiment detection
  const handleTextSentimentDetected = (sentiment: TextSentimentResult) => {
    setTextSentiment(sentiment);
  };
  
  // Handle voice sentiment detection
  const handleVoiceSentimentDetected = (sentiment: VoiceSentimentResult) => {
    setVoiceSentiment(sentiment);
  };
  
  // Handle challenge completion
  const handleCompleteChallenge = () => {
    markChallengeAsCompleted('challenge-10');
    setIsCompleted(true);
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };
  
  // Toggle compact view
  const toggleCompactView = () => {
    setCompactView(!compactView);
  };
  
  // Render emotion indicator with emoji
  const renderEmotionIndicator = (type: string, emotion: string | null, confidence: number | null) => {
    if (!emotion || confidence === null) return null;
    
    const emotionInfo = EMOTION_EMOJIS[emotion] || EMOTION_EMOJIS.neutral;
    
    return (
      <div 
        className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full p-2"
        style={{ backgroundColor: `${emotionInfo.color}40`, border: `2px solid ${emotionInfo.color}` }}
      >
        <div className="text-center">
          <div className="text-2xl">{emotionInfo.emoji}</div>
          <div className="text-xs font-medium mt-1 capitalize bg-white bg-opacity-80 rounded-full px-2 py-0.5">
            {emotion} {confidence ? `${Math.round(confidence * 100)}%` : ''}
          </div>
          <div className="text-xs mt-1 bg-black bg-opacity-70 text-white rounded-full px-2 py-0.5">
            {type}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <ChallengeHeader 
          title="Multi-Modal Sentiment Analysis" 
          icon={<span className="text-2xl">🧠</span>}
          challengeId="challenge-10"
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
          showConfetti={showConfetti}
          setShowConfetti={setShowConfetti}
          onCompleteChallenge={handleCompleteChallenge}
        />
        
        <p className="mt-4 text-gray-600 max-w-3xl">
          Analyze your emotions through multiple channels: facial expressions, text, and voice.
          See how emotions can differ between modalities and gain insights into your emotional state.
        </p>
      </div>
      
      {/* Controls and Navigation */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toggleCompactView}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              compactView 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {compactView ? 'Compact View' : 'Standard View'}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Link to="/challenge/face-emotion" className="px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200 transition-colors">
            Face Analysis
          </Link>
          <Link to="/challenge/text-sentiment" className="px-4 py-2 rounded-full text-sm font-medium bg-teal-100 text-teal-700 border border-teal-200 hover:bg-teal-200 transition-colors">
            Text Analysis
          </Link>
          <Link to="/challenge/voice-sentiment" className="px-4 py-2 rounded-full text-sm font-medium bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200 transition-colors">
            Voice Analysis
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`grid ${compactView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-8`}>
        {/* Left Column */}
        <div className="space-y-8">
          {/* Facial Emotion Detection */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-2">👤</span> Facial Emotion
                </h2>
                <Link to="/challenge/face-emotion" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                  Full Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <p className="text-gray-600 mt-1">
                Your facial expressions can reveal your true emotions. This tool analyzes your face in real-time.
              </p>
            </div>
            
            <div className="relative">
              <FaceEmotionDetector 
                onEmotionDetected={handleFacialEmotionDetected}
                debugMode={true}
                isMirrorMode={true}
                onDetectionAttempt={handleDetectionAttempt}
                onDetectionSuccess={handleDetectionSuccess}
              />
              
              {/* Visual indicator that facial landmarks are displayed */}
              <div className="absolute top-3 left-3 bg-blue-600 bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
                Facial Landmarks Active
              </div>
              
              {renderEmotionIndicator('Face', facialEmotion?.emotion || null, facialEmotion?.confidence || null)}
            </div>
          </div>
          
          {/* Text Sentiment Analysis */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 pb-4 border-b bg-gradient-to-r from-teal-50 to-green-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-2">💬</span> Text Sentiment
                </h2>
                <Link to="/challenge/text-sentiment" className="text-sm text-teal-600 hover:text-teal-800 flex items-center">
                  Full Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <p className="text-gray-600 mt-1">
                The words you choose can reveal your emotional state. Type some text to analyze its sentiment.
              </p>
            </div>
            
            <div className="relative p-6">
              <TextSentimentAnalyzer 
                onSentimentDetected={handleTextSentimentDetected}
              />
              
              {renderEmotionIndicator('Text', 
                textSentiment?.overallSentiment === 'positive' ? 'happy' : 
                textSentiment?.overallSentiment === 'negative' ? 'sad' : 'neutral', 
                textSentiment?.confidence || null)}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Multi-Modal Integration - MOVED ABOVE VOICE SENTIMENT */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">🔄</span> Combined Analysis
              </h2>
              <p className="text-gray-600 mt-1">
                This combines all modalities to provide a comprehensive emotional assessment.
              </p>
            </div>
            
            <div className="p-6">
              <MultiModalIntegration 
                facialEmotion={facialEmotion || undefined}
                textSentiment={textSentiment || undefined}
                voiceSentiment={voiceSentiment || undefined}
                debugMode={false}
              />
            </div>
          </div>
          
          {/* Voice Sentiment Analysis - MOVED BELOW COMBINED ANALYSIS */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 pb-4 border-b bg-gradient-to-r from-yellow-50 to-amber-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-2">🔊</span> Voice Sentiment
                </h2>
                <Link to="/challenge/voice-sentiment" className="text-sm text-amber-600 hover:text-amber-800 flex items-center">
                  Full Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <p className="text-gray-600 mt-1">
                Your voice carries emotional cues through tone, pitch, and rhythm. Record your voice to analyze.
              </p>
            </div>
            
            <div className="relative p-6">
              <VoiceSentimentAnalyzer 
                onSentimentDetected={handleVoiceSentimentDetected}
              />
              
              {renderEmotionIndicator('Voice', voiceSentiment?.dominantEmotion || null, voiceSentiment?.confidence || null)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Educational Section */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-8 bg-gradient-to-br from-white to-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Multi-Modal Sentiment Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm transform transition-transform hover:scale-105">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-bold mb-3 text-blue-800">Facial Analysis</h3>
            <p className="text-blue-700">
              Facial expressions are analyzed by identifying key facial landmarks and their relative positions.
              This can reveal emotions that may be unconscious or that you're trying to hide.
            </p>
            <div className="mt-4 text-sm text-blue-600 flex items-center">
              <span className="mr-1">68 facial landmarks</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl shadow-sm transform transition-transform hover:scale-105">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-bold mb-3 text-green-800">Text Analysis</h3>
            <p className="text-green-700">
              Text sentiment analysis examines the words, phrases, and linguistic patterns in your writing
              to determine emotional tone and intensity.
            </p>
            <div className="mt-4 text-sm text-green-600 flex items-center">
              <span className="mr-1">Keyword processing</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-xl shadow-sm transform transition-transform hover:scale-105">
            <div className="text-4xl mb-4">🔊</div>
            <h3 className="text-lg font-bold mb-3 text-yellow-800">Voice Analysis</h3>
            <p className="text-yellow-700">
              Voice sentiment analysis examines acoustic features like pitch, volume, speaking rate, and pauses
              to identify emotional states that may not be evident in the words alone.
            </p>
            <div className="mt-4 text-sm text-yellow-600 flex items-center">
              <span className="mr-1">Audio processing</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Why Multi-Modal Analysis Matters</h3>
          <div className="bg-indigo-50 p-6 rounded-xl shadow-sm">
            <p className="text-indigo-800 mb-4 leading-relaxed">
              Humans express emotions through multiple channels, and these channels don't always align.
              For example, someone might say positive words while their face or voice reveals negative emotions.
              This incongruence can provide deeper insights into a person's true emotional state.
            </p>
            
            <h4 className="font-bold mb-3 text-indigo-900">Applications:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-2">🧠</span>
                  <span className="font-medium">Mental health monitoring</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-2">💼</span>
                  <span className="font-medium">Customer experience analysis</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-2">🤖</span>
                  <span className="font-medium">Human-computer interaction</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-2">🎓</span>
                  <span className="font-medium">Educational tools</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-2">🔒</span>
                  <span className="font-medium">Security and deception detection</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-2">📱</span>
                  <span className="font-medium">Responsive user interfaces</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiModalSentimentMain; 