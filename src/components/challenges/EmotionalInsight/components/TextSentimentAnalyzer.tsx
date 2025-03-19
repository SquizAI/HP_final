import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { EMOTION_EMOJIS } from './EmotionTypes';

// Define the shapes of our sentiment data
export interface TextSentimentResult {
  overallSentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    surprised: number;
    disgusted: number;
    neutral: number;
  };
  highlightedText?: {
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    intensity: number;
  }[];
  fileName?: string;
}

interface TextSentimentAnalyzerProps {
  onSentimentDetected: (sentiment: TextSentimentResult) => void;
  text?: string; // Optional prop to analyze pre-existing text
}

const TextSentimentAnalyzer: React.FC<TextSentimentAnalyzerProps> = ({
  onSentimentDetected,
  text: initialText = ''
}) => {
  const [text, setText] = useState(initialText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [highlightedSegments, setHighlightedSegments] = useState<{text: string, sentiment: string, score: number}[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const analyzeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Detect when text is provided from props
  useEffect(() => {
    if (initialText && initialText !== text) {
      setText(initialText);
      analyzeSentiment(initialText);
    }
  }, [initialText]);

  // Enhanced sentiment analysis using a more sophisticated approach
  const analyzeSentiment = (textToAnalyze: string, fileNameParam?: string) => {
    if (!textToAnalyze.trim() || textToAnalyze === lastAnalyzedText) {
      return;
    }
    
    setIsAnalyzing(true);
    setLastAnalyzedText(textToAnalyze);
    
    // Define enhanced emotion keywords and their weights
    const emotionKeywords = {
      happy: {
        keywords: [
          'happy', 'joy', 'delighted', 'pleased', 'glad', 'exciting', 'excited', 'wonderful', 
          'love', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 'terrific', 'thrilled',
          'elated', 'jubilant', 'ecstatic', 'content', 'satisfied', 'cheerful', 'merry', 'jolly',
          'joyful', 'blissful', 'delightful', 'gleeful', 'chipper', 'grateful', 'thankful'
        ],
        weight: 1.2 // Weight happy emotions a bit more
      },
      sad: {
        keywords: [
          'sad', 'unhappy', 'depressed', 'depressing', 'miserable', 'heartbroken', 'disappointed', 
          'sorry', 'regret', 'unfortunate', 'tragic', 'gloomy', 'somber', 'melancholy', 'despair',
          'grief', 'sorrowful', 'tearful', 'downcast', 'blue', 'down', 'low', 'dismal', 'hopeless',
          'despondent', 'inconsolable', 'crestfallen', 'devastated', 'crushed', 'forlorn', 'wistful'
        ],
        weight: 1.0
      },
      angry: {
        keywords: [
          'angry', 'mad', 'furious', 'outraged', 'annoyed', 'irritated', 'frustrated', 'hate', 
          'resent', 'disgusting', 'infuriated', 'enraged', 'livid', 'irate', 'hostile', 'bitter',
          'exasperated', 'indignant', 'inflamed', 'provoked', 'vexed', 'aggravated', 'fuming',
          'seething', 'resentful', 'violent', 'vengeful', 'insulted', 'offended', 'rage'
        ],
        weight: 1.1
      },
      fearful: {
        keywords: [
          'afraid', 'scared', 'frightened', 'terrified', 'worried', 'anxious', 'nervous', 'panic', 
          'dread', 'terror', 'alarm', 'apprehensive', 'horrified', 'spooked', 'startled', 'uneasy',
          'tense', 'troubled', 'concerned', 'stressed', 'phobic', 'distressed', 'intimidated',
          'threatened', 'suspicious', 'timid', 'uncomfortable', 'vulnerable', 'hesitant', 'shy'
        ],
        weight: 1.0
      },
      surprised: {
        keywords: [
          'surprised', 'amazed', 'astonished', 'shocked', 'stunned', 'unexpected', 'wow', 'unbelievable', 
          'incredible', 'astounded', 'startled', 'speechless', 'dumbfounded', 'awestruck', 'staggered',
          'flabbergasted', 'bewildered', 'taken aback', 'thunderstruck', 'overwhelmed', 'breathtaking',
          'jaw-dropping', 'eye-opening', 'stunning', 'marvelous', 'extraordinary', 'remarkable'
        ],
        weight: 0.9
      },
      disgusted: {
        keywords: [
          'disgusted', 'gross', 'revolting', 'sickening', 'nauseous', 'repulsed', 'awful', 'horrible', 
          'terrible', 'repelled', 'appalled', 'repugnant', 'offensive', 'distasteful', 'nauseating',
          'vile', 'repulsive', 'abhorrent', 'detestable', 'loathsome', 'odious', 'foul', 'nasty',
          'disagreeable', 'unpleasant', 'dreadful', 'hideous', 'grotesque', 'intolerable', 'abominable'
        ],
        weight: 1.0
      },
      neutral: {
        keywords: [
          'ok', 'fine', 'neutral', 'average', 'moderate', 'indifferent', 'regular', 'normal', 'standard',
          'typical', 'usual', 'common', 'ordinary', 'plain', 'routine', 'everyday', 'conventional',
          'mediocre', 'so-so', 'fair', 'acceptable', 'tolerable', 'passable', 'adequate', 'sufficient',
          'satisfactory', 'reasonable', 'middle-of-the-road', 'vanilla', 'unremarkable'
        ],
        weight: 0.5 // Lower weight for neutral emotions
      }
    };
    
    // Initialize emotion scores with small baselines
    const emotionScores = {
      happy: 0.05,
      sad: 0.05,
      angry: 0.05,
      fearful: 0.05,
      surprised: 0.05,
      disgusted: 0.05,
      neutral: 0.1 // Slightly higher baseline for neutral
    };
    
    // Process the text - split into words and sentences
    const sentences = textToAnalyze.toLowerCase().split(/[.!?]+/).filter(s => s.trim().length > 0);
    const segments: {text: string, sentiment: string, score: number}[] = [];
    
    // Analyze text sentence by sentence for context
    sentences.forEach(sentence => {
      const words = sentence.split(/\s+/);
      let sentenceEmotion = 'neutral';
      let highestScore = 0;
      let sentenceScore = 0;
      
      // Track negations in the sentence
      let negationPresent = false;
      const negations = ['not', 'no', "don't", "doesn't", "didn't", "won't", "can't", "couldn't", "shouldn't", "wouldn't", "never", "none", "nothing"];
      
      // Check for negations first
      words.forEach(word => {
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        if (negations.includes(cleanWord)) {
          negationPresent = true;
        }
      });
      
      // Score each word in context of negation
      words.forEach(word => {
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        if (!cleanWord) return;
        
        // Check each emotion category
        Object.entries(emotionKeywords).forEach(([emotion, { keywords, weight }]) => {
          if (keywords.includes(cleanWord)) {
            // Apply weights and handle negations
            let scoreAdjustment = 1.0 * weight;
            
            // If negation is present in the sentence, it may invert certain emotions
            if (negationPresent) {
              if (emotion === 'happy') {
                emotionScores.happy -= 0.5;
                emotionScores.sad += 0.3;
                scoreAdjustment = -0.5;
              } else if (emotion === 'sad') {
                emotionScores.sad -= 0.5;
                emotionScores.neutral += 0.3;
                scoreAdjustment = -0.5;
              } else if (emotion === 'angry') {
                emotionScores.angry -= 0.5;
                emotionScores.neutral += 0.3;
                scoreAdjustment = -0.5;
              }
              // Other emotions might not be as directly affected by negation
            }
            
            emotionScores[emotion as keyof typeof emotionScores] += scoreAdjustment;
            sentenceScore += scoreAdjustment;
            
            if (emotionScores[emotion as keyof typeof emotionScores] > highestScore) {
              highestScore = emotionScores[emotion as keyof typeof emotionScores];
              sentenceEmotion = emotion;
            }
          }
        });
      });
      
      // Add sentence to segments for highlighting
      if (sentenceScore > 0) {
        const sentimentType = 
          sentenceEmotion === 'happy' || sentenceEmotion === 'surprised' ? 'positive' :
          sentenceEmotion === 'neutral' ? 'neutral' : 'negative';
          
        segments.push({
          text: sentence,
          sentiment: sentimentType,
          score: sentenceScore
        });
      }
    });
    
    setHighlightedSegments(segments);
    
    // Determine dominant emotion
    let dominantEmotion = 'neutral';
    let highestScore = emotionScores.neutral;
    
    Object.entries(emotionScores).forEach(([emotion, score]) => {
      if (score > highestScore) {
        highestScore = score;
        dominantEmotion = emotion;
      }
    });
    
    // Normalize the scores to create percentages
    const total = Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
    const normalizedEmotions = Object.entries(emotionScores).reduce((acc, [emotion, score]) => {
      acc[emotion as keyof typeof emotionScores] = total > 0 ? score / total : score;
      return acc;
    }, { ...emotionScores });
    
    // Determine overall sentiment with more nuanced approach
    const positiveScore = normalizedEmotions.happy + (normalizedEmotions.surprised * 0.7);
    const negativeScore = normalizedEmotions.sad + normalizedEmotions.angry + normalizedEmotions.fearful + normalizedEmotions.disgusted;
    const neutralScore = normalizedEmotions.neutral;
    
    let overallSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let confidence = neutralScore;
    
    if (positiveScore > negativeScore && positiveScore > neutralScore) {
      overallSentiment = 'positive';
      confidence = positiveScore;
    } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
      overallSentiment = 'negative';
      confidence = negativeScore;
    }
    
    // Create the result
    const result: TextSentimentResult = {
      overallSentiment,
      confidence,
      emotions: normalizedEmotions,
      fileName: fileNameParam
    };
    
    // Simulate a small processing delay for better UX
    setTimeout(() => {
      // Send the result to the parent component
      onSentimentDetected(result);
      setIsAnalyzing(false);
    }, 800);
  };
  
  // Debounced analysis to avoid analyzing on every keystroke
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setIsFileUploaded(false);
    setFileName('');
    
    // Clear any existing timeout
    if (analyzeTimeoutRef.current) {
      clearTimeout(analyzeTimeoutRef.current);
    }
    
    // Set a new timeout
    analyzeTimeoutRef.current = setTimeout(() => {
      analyzeSentiment(newText);
    }, 500);
  };
  
  // Handle file upload with improved file processing
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileUploadError(null);
    setIsAnalyzing(true);
    setProcessingProgress(10);
    
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      setFileName(file.name);
      
      // Process different file types
      if (fileExtension === 'txt' || fileExtension === 'md') {
        // Text file
        const textContent = await readTextFile(file);
        setText(textContent);
        setIsFileUploaded(true);
        setProcessingProgress(50);
        
        setTimeout(() => {
          setProcessingProgress(100);
          analyzeSentiment(textContent, file.name);
        }, 500);
      } else if (fileExtension === 'pdf') {
        // For PDF, in a real app we would use a PDF parsing library
        // Here we'll simulate text extraction with more realistic content
        simulateFileProcessing(30, 80, 1000);
        
        // Simulate PDF content extraction
        setTimeout(() => {
          const simulatedText = generateRealisticContent(file.name, 'pdf');
          setText(simulatedText);
          setIsFileUploaded(true);
          setProcessingProgress(100);
          analyzeSentiment(simulatedText, file.name);
        }, 2000);
      } else if (['doc', 'docx', 'rtf'].includes(fileExtension || '')) {
        // For Word documents, simulate extraction with typical document content
        simulateFileProcessing(30, 70, 800);
        
        setTimeout(() => {
          const simulatedText = generateRealisticContent(file.name, 'doc');
          setText(simulatedText);
          setIsFileUploaded(true);
          setProcessingProgress(100);
          analyzeSentiment(simulatedText, file.name);
        }, 1800);
      } else {
        setFileUploadError('Unsupported file type. Please upload a TXT, PDF, DOC, DOCX, or RTF file.');
        setIsAnalyzing(false);
        setProcessingProgress(0);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setFileUploadError('Error reading file. Please try again.');
      setIsAnalyzing(false);
      setProcessingProgress(0);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Helper function to read text files
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };
  
  // Simulate file processing with progress updates
  const simulateFileProcessing = (start: number, end: number, duration: number) => {
    const startTime = Date.now();
    setProcessingProgress(start);
    
    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = start + Math.min(elapsedTime / duration, 1) * (end - start);
      
      setProcessingProgress(Math.round(progress));
      
      if (progress < end) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    requestAnimationFrame(updateProgress);
  };
  
  // Generate more realistic content based on file type for simulation
  const generateRealisticContent = (fileName: string, fileType: string): string => {
    // Base content that's more realistic for document analysis
    const contentMap = {
      business: [
        "We're pleased to announce our quarterly results, which exceeded expectations.",
        "The team has been working diligently to meet all project milestones.",
        "Unfortunately, we've had to make some difficult decisions regarding budget cuts.",
        "I'm concerned about the timeline for the upcoming product launch.",
        "The customer feedback has been overwhelmingly positive.",
        "We're excited to roll out the new features next month."
      ],
      technical: [
        "The system architecture needs to be refactored to support the new requirements.",
        "We've identified a critical bug that's causing performance issues.",
        "The deployment was successful and all tests are passing.",
        "I'm worried that the current implementation won't scale as expected.",
        "The API documentation has been updated with the latest endpoints.",
        "We're happy to report that all security vulnerabilities have been patched."
      ],
      academic: [
        "The research findings suggest a strong correlation between the variables.",
        "The literature review revealed several gaps in current understanding.",
        "We're excited about the potential applications of this methodology.",
        "Unfortunately, the data collection process was hindered by unforeseen challenges.",
        "The experimental results validated our initial hypothesis.",
        "We're concerned about the limitations of the current study design."
      ]
    };
    
    // Select content type based on filename
    let contentType: keyof typeof contentMap = 'business';
    
    if (fileName.includes('tech') || fileName.includes('dev') || fileName.includes('code')) {
      contentType = 'technical';
    } else if (fileName.includes('research') || fileName.includes('study') || fileName.includes('paper')) {
      contentType = 'academic';
    }
    
    // Generate a realistic document with multiple paragraphs
    const paragraphs = [];
    const numParagraphs = 3 + Math.floor(Math.random() * 3); // 3-5 paragraphs
    
    for (let i = 0; i < numParagraphs; i++) {
      const sentences = [];
      const numSentences = 4 + Math.floor(Math.random() * 4); // 4-7 sentences
      
      for (let j = 0; j < numSentences; j++) {
        // Get a random sentence from the content type
        const randomIndex = Math.floor(Math.random() * contentMap[contentType].length);
        sentences.push(contentMap[contentType][randomIndex]);
      }
      
      paragraphs.push(sentences.join(' '));
    }
    
    return paragraphs.join('\n\n');
  };
  
  // Trigger file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Render highlighted text with improved visual design
  const renderHighlightedText = () => {
    if (!text || highlightedSegments.length === 0) {
      return <p className="text-gray-600">{text || 'Type something or upload a file to analyze sentiment...'}</p>;
    }
    
    const sentimentColorMap = {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-gray-600'
    };
    
    // Create a map for segment highlighting
    const segmentMap = new Map();
    highlightedSegments.forEach(segment => {
      segmentMap.set(segment.text.toLowerCase().trim(), segment);
    });
    
    // Process the text to highlight sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    return (
      <div className="text-gray-800 leading-relaxed max-h-60 overflow-y-auto">
        {sentences.map((sentence, idx) => {
          // Clean and check for matching segments
          const cleanSentence = sentence.toLowerCase().trim().replace(/[.!?]$/, '');
          const segment = segmentMap.get(cleanSentence);
          
          if (segment) {
            const sentiment = segment.sentiment;
            const colorClass = sentimentColorMap[sentiment as keyof typeof sentimentColorMap];
            const intensity = Math.min(1, segment.score / 2); // Normalize intensity
            
            return (
              <span 
                key={idx} 
                className={`${colorClass} ${sentiment !== 'neutral' ? 'font-medium' : ''}`}
                style={{ 
                  backgroundColor: sentiment === 'positive' ? `rgba(0, 128, 0, ${intensity * 0.15})` :
                               sentiment === 'negative' ? `rgba(255, 0, 0, ${intensity * 0.15})` :
                               'transparent'
                }}
              >
                {sentence}{' '}
              </span>
            );
          }
          
          // No matching segment, render as normal text
          return <span key={idx}>{sentence} </span>;
        })}
      </div>
    );
  };
  
  // Render emotion distribution with enhanced visualization
  const renderEmotionDistribution = () => {
    // Only show if we have analyzed text
    if (!lastAnalyzedText) return null;
    
    return (
      <div className="mt-4">
        <h4 className="font-medium text-sm text-gray-700 mb-2">Emotion Distribution:</h4>
        <div className="space-y-2">
          {Object.entries(EMOTION_EMOJIS).map(([emotion, { emoji, color }]) => {
            // Calculate percentage based on highlighted segments
            const sentimentType = emotion === 'happy' ? 'positive' : 
                                  (emotion === 'neutral' ? 'neutral' : 'negative');
            
            const matchingSegments = highlightedSegments.filter(s => s.sentiment === sentimentType);
            const percentage = highlightedSegments.length > 0 ? 
                              (matchingSegments.length / highlightedSegments.length) * 100 : 0;
            
            return (
              <div key={emotion} className="relative">
                <div className="flex items-center mb-1">
                  <div className="mr-2 w-6 text-center">{emoji}</div>
                  <span className="text-sm capitalize">{emotion}</span>
                  <span className="ml-auto text-xs font-medium">{Math.round(percentage)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${Math.round(percentage)}%`,
                      backgroundColor: color 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">Text Sentiment Analysis</h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Enter text or upload a file</label>
          
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.pdf,.doc,.docx,.rtf,.md"
              className="sr-only"
            />
            <button
              onClick={handleBrowseClick}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 border border-blue-200 text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload File
            </button>
          </div>
        </div>
        
        {fileName && (
          <div className="flex items-center mb-2 p-2 bg-blue-50 rounded text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-blue-800 font-medium mr-2">{fileName}</span>
            <span className="text-blue-600">File uploaded</span>
          </div>
        )}
        
        {fileUploadError && (
          <div className="mb-2 p-2 bg-red-50 rounded text-sm text-red-600">
            {fileUploadError}
          </div>
        )}
        
        <textarea
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
          placeholder="Type something or upload a file to analyze sentiment..."
          value={text}
          onChange={handleTextChange}
        />
      </div>
      
      {isAnalyzing ? (
        <div className="py-4">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${processingProgress}%` }}></div>
            </div>
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {processingProgress < 100 ? 
                  `Processing ${fileName || 'text'} (${processingProgress}%)` : 
                  'Analyzing sentiment...'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Analyzed Text:</h4>
          <div className="p-3 bg-gray-50 rounded-md">
            {renderHighlightedText()}
          </div>
          
          {renderEmotionDistribution()}
        </div>
      )}
    </div>
  );
};

export default TextSentimentAnalyzer; 