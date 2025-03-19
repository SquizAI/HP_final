import React, { useState, useEffect } from 'react';
import { EMOTION_EMOJIS } from './EmotionTypes';
import { TextSentimentResult } from './TextSentimentAnalyzer';
import { VoiceSentimentResult } from './VoiceSentimentAnalyzer';

// Define the combined sentiment result
export interface MultiModalSentimentResult {
  dominantEmotion: string;
  confidence: number;
  emotions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  modalityConfidence: {
    facial: number;
    text: number;
    voice: number;
  };
  congruence: number; // 0-1 scale of how well the modalities agree
  insights: string[];
}

interface MultiModalIntegrationProps {
  facialEmotion?: {
    emotion: string;
    confidence: number;
  };
  textSentiment?: TextSentimentResult;
  voiceSentiment?: VoiceSentimentResult;
  debugMode?: boolean;
}

const MultiModalIntegration: React.FC<MultiModalIntegrationProps> = ({
  facialEmotion,
  textSentiment,
  voiceSentiment,
  debugMode = false
}) => {
  const [combinedResult, setCombinedResult] = useState<MultiModalSentimentResult | null>(null);
  const [activeModalities, setActiveModalities] = useState<string[]>([]);
  
  // Determine which modalities are active
  useEffect(() => {
    const active = [];
    if (facialEmotion) active.push('facial');
    if (textSentiment) active.push('text');
    if (voiceSentiment) active.push('voice');
    setActiveModalities(active);
  }, [facialEmotion, textSentiment, voiceSentiment]);
  
  // Combine the sentiment results from all modalities
  useEffect(() => {
    if (activeModalities.length === 0) return;
    
    // Initialize combined emotions
    const combinedEmotions = {
      neutral: 0,
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0
    };
    
    // Initialize modality confidence
    const modalityConfidence = {
      facial: 0,
      text: 0,
      voice: 0
    };
    
    // Weights for each modality (can be adjusted)
    const weights = {
      facial: 0.4,
      text: 0.3,
      voice: 0.3
    };
    
    // Adjust weights based on available modalities
    const totalWeight = activeModalities.reduce((sum, modality) => sum + weights[modality as keyof typeof weights], 0);
    const normalizedWeights = Object.entries(weights).reduce((acc, [key, value]) => {
      acc[key as keyof typeof weights] = activeModalities.includes(key) ? value / totalWeight : 0;
      return acc;
    }, { ...weights });
    
    // Add facial emotion if available
    if (facialEmotion) {
      const { emotion, confidence } = facialEmotion;
      combinedEmotions[emotion as keyof typeof combinedEmotions] += normalizedWeights.facial;
      modalityConfidence.facial = confidence;
    }
    
    // Add text sentiment if available
    if (textSentiment) {
      const { emotions, confidence } = textSentiment;
      Object.entries(emotions).forEach(([emotion, value]) => {
        combinedEmotions[emotion as keyof typeof combinedEmotions] += value * normalizedWeights.text;
      });
      modalityConfidence.text = confidence;
    }
    
    // Add voice sentiment if available
    if (voiceSentiment) {
      const { emotions, confidence } = voiceSentiment;
      Object.entries(emotions).forEach(([emotion, value]) => {
        combinedEmotions[emotion as keyof typeof combinedEmotions] += value * normalizedWeights.voice;
      });
      modalityConfidence.voice = confidence;
    }
    
    // Normalize the combined emotions
    const total = Object.values(combinedEmotions).reduce((sum, value) => sum + value, 0);
    const normalizedEmotions = Object.entries(combinedEmotions).reduce((acc, [emotion, value]) => {
      acc[emotion as keyof typeof combinedEmotions] = total > 0 ? value / total : value;
      return acc;
    }, { ...combinedEmotions });
    
    // Find the dominant emotion
    let dominantEmotion = 'neutral';
    let highestScore = 0;
    
    Object.entries(normalizedEmotions).forEach(([emotion, value]) => {
      if (value > highestScore) {
        highestScore = value;
        dominantEmotion = emotion;
      }
    });
    
    // Calculate congruence (how well the modalities agree)
    let congruence = 1; // Default to perfect agreement
    
    if (activeModalities.length > 1) {
      // Calculate variance across modalities for each emotion
      const emotionVariances: number[] = [];
      
      Object.keys(combinedEmotions).forEach(emotion => {
        const values: number[] = [];
        
        if (facialEmotion && facialEmotion.emotion === emotion) {
          values.push(facialEmotion.confidence);
        }
        
        if (textSentiment) {
          values.push(textSentiment.emotions[emotion as keyof typeof textSentiment.emotions]);
        }
        
        if (voiceSentiment) {
          values.push(voiceSentiment.emotions[emotion as keyof typeof voiceSentiment.emotions]);
        }
        
        if (values.length > 1) {
          // Calculate variance
          const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
          const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
          emotionVariances.push(variance);
        }
      });
      
      // Average variance across emotions
      const avgVariance = emotionVariances.length > 0 
        ? emotionVariances.reduce((sum, val) => sum + val, 0) / emotionVariances.length 
        : 0;
      
      // Convert to congruence (1 - normalized variance)
      congruence = Math.max(0, 1 - (avgVariance * 5)); // Scale factor of 5 to make differences more apparent
    }
    
    // Generate insights based on the results
    const insights: string[] = [];
    
    // Insight about dominant emotion
    insights.push(`Your dominant emotion appears to be ${dominantEmotion}.`);
    
    // Insight about modality differences
    if (activeModalities.length > 1) {
      if (congruence < 0.5) {
        insights.push("There's a significant difference between how you express emotions across different modalities.");
        
        // Compare facial vs text
        if (facialEmotion && textSentiment) {
          if (facialEmotion.emotion !== dominantEmotion && 
              textSentiment.overallSentiment === 'positive' && 
              (dominantEmotion === 'sad' || dominantEmotion === 'angry')) {
            insights.push("Your facial expressions show more negative emotions than your words suggest.");
          } else if (facialEmotion.emotion !== dominantEmotion && 
                    textSentiment.overallSentiment === 'negative' && 
                    (dominantEmotion === 'happy')) {
            insights.push("Your words express more negative emotions than your facial expressions show.");
          }
        }
        
        // Compare facial vs voice
        if (facialEmotion && voiceSentiment) {
          if (facialEmotion.emotion !== voiceSentiment.dominantEmotion) {
            insights.push(`Your face shows ${facialEmotion.emotion} while your voice conveys ${voiceSentiment.dominantEmotion}.`);
          }
        }
      } else {
        insights.push("Your emotional expression is consistent across different modalities.");
      }
    }
    
    // Create the combined result
    const result: MultiModalSentimentResult = {
      dominantEmotion,
      confidence: highestScore,
      emotions: normalizedEmotions,
      modalityConfidence,
      congruence,
      insights
    };
    
    setCombinedResult(result);
  }, [facialEmotion, textSentiment, voiceSentiment, activeModalities]);
  
  // Render the component
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">Multi-Modal Sentiment Analysis</h3>
      
      {activeModalities.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No sentiment data available yet</p>
          <p className="text-sm mt-1">Use the facial, text, or voice analysis tools to get started</p>
        </div>
      ) : (
        <div>
          {/* Active Modalities */}
          <div className="flex mb-4 space-x-2">
            {activeModalities.map(modality => (
              <div 
                key={modality}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: modality === 'facial' ? '#EBF4FF' : modality === 'text' ? '#E6FFFA' : '#FEF3C7',
                  color: modality === 'facial' ? '#3182CE' : modality === 'text' ? '#319795' : '#D97706'
                }}
              >
                {modality.charAt(0).toUpperCase() + modality.slice(1)}
              </div>
            ))}
          </div>
          
          {/* Combined Emotion Result */}
          {combinedResult && (
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-5xl mb-2">
                    {EMOTION_EMOJIS[combinedResult.dominantEmotion]?.emoji || '😐'}
                  </div>
                  <div className="text-lg font-medium capitalize">
                    {combinedResult.dominantEmotion}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round(combinedResult.confidence * 100)}% confidence
                  </div>
                </div>
              </div>
              
              {/* Emotion Distribution */}
              <div className="mt-4">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Emotion Distribution:</h4>
                <div className="space-y-2">
                  {Object.entries(combinedResult.emotions)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, value]) => (
                      <div key={emotion} className="flex items-center">
                        <span className="w-20 text-sm capitalize">{emotion}</span>
                        <div className="flex-1 mx-2">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${Math.round(value * 100)}%`,
                                backgroundColor: EMOTION_EMOJIS[emotion]?.color || '#CBD5E0'
                              }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {Math.round(value * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Congruence Meter */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium text-sm text-gray-700">Emotional Congruence:</h4>
                  <span className="text-sm text-gray-600">
                    {combinedResult.congruence < 0.3 ? 'Low' : 
                     combinedResult.congruence < 0.7 ? 'Medium' : 'High'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${Math.round(combinedResult.congruence * 100)}%`,
                      backgroundColor: combinedResult.congruence < 0.3 ? '#F56565' : 
                                      combinedResult.congruence < 0.7 ? '#ECC94B' : '#48BB78'
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  How consistent your emotions are across different modalities
                </p>
              </div>
              
              {/* Insights */}
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-sm text-blue-800 mb-2">Insights:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {combinedResult.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-blue-700">{insight}</li>
                  ))}
                </ul>
              </div>
              
              {/* Debug Information */}
              {debugMode && (
                <div className="mt-6 p-4 bg-gray-100 rounded-md">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Modality Confidence:</h4>
                  <div className="space-y-2">
                    {Object.entries(combinedResult.modalityConfidence)
                      .filter(([, value]) => value > 0)
                      .map(([modality, value]) => (
                        <div key={modality} className="flex items-center">
                          <span className="w-20 text-sm capitalize">{modality}</span>
                          <div className="flex-1 mx-2">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${Math.round(value * 100)}%`,
                                  backgroundColor: modality === 'facial' ? '#3182CE' : 
                                                 modality === 'text' ? '#319795' : '#D97706'
                                }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {Math.round(value * 100)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiModalIntegration; 