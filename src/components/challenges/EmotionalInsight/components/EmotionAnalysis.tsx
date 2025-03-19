import React, { useState } from 'react';

// Import types
type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'neutral' | 'contempt';

interface EmotionAnalysis {
  primaryEmotion: EmotionType;
  confidence: number;
  secondaryEmotions: Array<{
    emotion: EmotionType;
    confidence: number;
  }>;
  timestamp: string;
}

interface EmotionAnalysisComponentProps {
  analysis: EmotionAnalysis;
  mediaType: 'video' | 'audio' | 'text' | null;
  mediaUrl: string | null;
  mediaContent: string | null;
  onContinue: () => void;
  onReanalyze: () => void;
}

// Emotion metadata
const EMOTION_DATA: Record<EmotionType, { color: string; icon: string; description: string }> = {
  joy: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '😊',
    description: 'Positive feelings such as happiness, amusement, satisfaction, or pleasure'
  },
  sadness: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '😢',
    description: 'Feelings of loss, disappointment, helplessness, or sorrow'
  },
  anger: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '😠',
    description: 'Feelings of annoyance, frustration, or hostility'
  },
  fear: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '😨',
    description: 'Response to perceived threat or danger, including anxiety and worry'
  },
  surprise: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '😲',
    description: 'Brief emotional response to something unexpected'
  },
  disgust: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '🤢',
    description: 'Strong aversion or revulsion response'
  },
  neutral: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '😐',
    description: 'Absence of strong or obvious emotional expression'
  },
  contempt: {
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: '😏',
    description: 'Feeling of disdain or scorn toward someone or something'
  }
};

// Business applications by emotion
const BUSINESS_APPLICATIONS: Record<EmotionType, string[]> = {
  joy: [
    'Identify the most positive customer experiences to replicate',
    'Detect messages that resonate well with audiences',
    'Recognize when user delight occurs in a product journey'
  ],
  sadness: [
    'Prioritize dissatisfied customers for follow-up',
    'Identify pain points in the user experience',
    'Detect potential customer churn signals'
  ],
  anger: [
    'Flag urgent customer issues for immediate resolution',
    'Identify product friction points causing frustration',
    'Detect potential reputation threats in social media'
  ],
  fear: [
    'Address customer concerns about new products/services',
    'Identify anxiety-inducing parts of customer journey',
    'Detect hesitation points in sales processes'
  ],
  surprise: [
    'Identify unexpected customer reactions to product changes',
    'Detect moments that exceed customer expectations',
    'Find unexpected use cases or responses to features'
  ],
  disgust: [
    'Identify features or policies that strongly alienate users',
    'Detect strong negative reactions to marketing materials',
    'Address serious usability or ethical concerns'
  ],
  neutral: [
    'Establish baseline response benchmarks',
    'Identify informational content that\'s clear and straightforward',
    'Detect areas where emotional engagement could be improved'
  ],
  contempt: [
    'Identify serious breaches of customer trust',
    'Detect when competitors are being dismissively compared',
    'Address scenarios where users feel condescended to'
  ]
};

const EmotionAnalysisComponent: React.FC<EmotionAnalysisComponentProps> = ({
  analysis,
  mediaType,
  mediaUrl,
  mediaContent,
  onContinue,
  onReanalyze
}) => {
  const [showMedia, setShowMedia] = useState(true);
  
  // Format the timestamp
  const formattedTime = new Date(analysis.timestamp).toLocaleTimeString();
  const formattedDate = new Date(analysis.timestamp).toLocaleDateString();
  
  // Get the emotion data for the primary emotion
  const primaryEmotionData = EMOTION_DATA[analysis.primaryEmotion];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Emotion Analysis Results</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Media preview */}
        {showMedia && (
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Analyzed Content</h3>
                <button
                  type="button"
                  onClick={() => setShowMedia(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                {mediaType === 'video' && mediaUrl && (
                  <video src={mediaUrl} controls className="w-full h-auto rounded" />
                )}
                {mediaType === 'audio' && mediaUrl && (
                  <audio src={mediaUrl} controls className="w-full rounded" />
                )}
                {mediaType === 'text' && mediaContent && (
                  <div className="p-3 bg-gray-50 rounded border border-gray-200 max-h-60 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">{mediaContent}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Analysis results */}
        <div className={`w-full ${showMedia ? 'md:w-1/2 lg:w-3/5' : 'md:w-full'}`}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
              <h3 className="font-medium text-gray-700">Emotion Detection Results</h3>
              <p className="text-xs text-gray-500">Analyzed on {formattedDate} at {formattedTime}</p>
            </div>
            
            {/* Primary emotion */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3" role="img" aria-label={analysis.primaryEmotion}>
                  {primaryEmotionData.icon}
                </span>
                <div>
                  <div className="flex items-center">
                    <h4 className="text-lg font-medium text-gray-900 capitalize mr-2">{analysis.primaryEmotion}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${primaryEmotionData.color}`}>
                      Primary Emotion
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{primaryEmotionData.description}</p>
                </div>
              </div>
              
              {/* Confidence meter */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Confidence</span>
                  <span className="text-sm font-medium text-gray-700">{analysis.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-blue-600"
                    style={{ width: `${analysis.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Secondary emotions */}
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Secondary Emotions Detected</h4>
              <div className="space-y-3">
                {analysis.secondaryEmotions.map((emotion, index) => {
                  const emotionData = EMOTION_DATA[emotion.emotion];
                  return (
                    <div key={index} className="flex items-center">
                      <span className="text-lg mr-2" role="img" aria-label={emotion.emotion}>
                        {emotionData.icon}
                      </span>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">{emotion.emotion}</span>
                          <span className="text-xs text-gray-500">{emotion.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-blue-400"
                            style={{ width: `${emotion.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {analysis.secondaryEmotions.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No significant secondary emotions detected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Business applications */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Potential Business Applications</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Based on the detected <span className="font-medium capitalize">{analysis.primaryEmotion}</span> emotion, here are potential business applications:
            </p>
            <ul className="space-y-2 text-gray-700">
              {BUSINESS_APPLICATIONS[analysis.primaryEmotion].map((application, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{application}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onReanalyze}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Try Different Content
        </button>
        
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue to Reflection
          <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EmotionAnalysisComponent; 