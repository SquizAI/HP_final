import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextSentimentAnalyzer, { TextSentimentResult } from '../components/TextSentimentAnalyzer';
import { EMOTION_EMOJIS } from '../components/EmotionTypes';

const TextSentimentPage: React.FC = () => {
  const [textSentiment, setTextSentiment] = useState<TextSentimentResult | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  
  // Handle text sentiment detection
  const handleTextSentimentDetected = (sentiment: TextSentimentResult) => {
    setTextSentiment(sentiment);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 min-h-screen">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Text Sentiment Analysis</h1>
          <div className="flex space-x-4">
            <Link to="/challenge/multi-modal-sentiment" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
              Multi-Modal Analysis
            </Link>
          </div>
        </div>
        <p className="mt-4 text-gray-600 max-w-3xl">
          Analyze the emotional content of text. This technology examines words, phrases, and linguistic patterns
          to determine emotional tone and intensity.
        </p>
      </header>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            showExplanation 
              ? 'bg-green-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text Sentiment Analysis */}
        <div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 pb-4 border-b bg-gradient-to-r from-teal-50 to-green-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">💬</span> Text Sentiment Analysis
              </h2>
              <p className="text-gray-600 mt-1">
                The words you choose can reveal your emotional state. Type some text to analyze its sentiment.
              </p>
            </div>
            
            <div className="p-6">
              <TextSentimentAnalyzer 
                onSentimentDetected={handleTextSentimentDetected}
              />
            </div>
          </div>
        </div>
        
        {/* Results & Explanation */}
        <div className="space-y-6">
          {textSentiment && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-2">📊</span> Sentiment Results
                </h2>
                <p className="text-gray-600 mt-1">
                  Detailed breakdown of the detected sentiment in your text.
                </p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="text-7xl mb-3">
                      {textSentiment.overallSentiment === 'positive' 
                        ? EMOTION_EMOJIS.happy.emoji 
                        : textSentiment.overallSentiment === 'negative'
                          ? EMOTION_EMOJIS.sad.emoji
                          : EMOTION_EMOJIS.neutral.emoji}
                    </div>
                    <h3 className="text-xl font-semibold capitalize">
                      {textSentiment.overallSentiment} Sentiment
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {Math.round(textSentiment.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-700 mb-3">Emotion Distribution:</h3>
                <div className="space-y-3">
                  {Object.entries(textSentiment.emotions).map(([emotion, value]) => {
                    const emotionInfo = EMOTION_EMOJIS[emotion] || EMOTION_EMOJIS.neutral;
                    return (
                      <div key={emotion} className="relative">
                        <div className="flex items-center mb-1">
                          <div className="mr-2 w-6 text-center">{emotionInfo.emoji}</div>
                          <span className="text-sm capitalize">{emotion}</span>
                          <span className="ml-auto text-xs font-medium">{Math.round(value * 100)}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${Math.round(value * 100)}%`,
                              backgroundColor: emotionInfo.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {showExplanation && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-2">🧠</span> How It Works
                </h2>
                <p className="text-gray-600 mt-1">
                  Learn about the technology behind text sentiment analysis.
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Text Sentiment Analysis</h3>
                  <p className="text-gray-700 mb-4">
                    Text sentiment analysis examines the emotional content of written text by analyzing words, 
                    phrases, and linguistic patterns. This technology can identify the overall emotional tone 
                    of a piece of text, as well as specific emotions expressed within it.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🔍</span>
                      <h4 className="font-medium">Keyword Analysis</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Identifies emotionally charged words and phrases, assigning them positive, negative, or neutral values.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🔄</span>
                      <h4 className="font-medium">Context Processing</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Analyzes how words relate to each other, accounting for negations and intensifiers.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">📊</span>
                      <h4 className="font-medium">Emotion Classification</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Categorizes text into specific emotional categories like happiness, sadness, anger, etc.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">📈</span>
                      <h4 className="font-medium">Confidence Scoring</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Assigns confidence levels to detected emotions based on the strength and frequency of emotional indicators.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Applications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-teal-50 p-3 rounded-lg text-center">
                    <span className="text-2xl block mb-1">💼</span>
                    <span className="text-sm font-medium">Customer Feedback Analysis</span>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-lg text-center">
                    <span className="text-2xl block mb-1">📱</span>
                    <span className="text-sm font-medium">Social Media Monitoring</span>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-lg text-center">
                    <span className="text-2xl block mb-1">📝</span>
                    <span className="text-sm font-medium">Content Creation</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextSentimentPage; 