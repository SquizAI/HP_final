import React, { useState, useEffect } from 'react';
import MediaUpload from './components/MediaUpload';
import EmotionAnalysisComponent from './components/EmotionAnalysis';
import Reflection from './components/Reflection';
import BusinessApplication from './components/BusinessApplication';
import ChallengeHeader from '../../shared/ChallengeHeader';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import { Heart, Smile } from 'lucide-react';
import Confetti from '../../shared/Confetti';

// Define steps for the challenge
enum STEPS {
  UPLOAD = 0,
  ANALYSIS = 1,
  REFLECTION = 2,
  APPLICATION = 3
}

// Define emotion types
type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'neutral' | 'contempt';

// Define emotion analysis result
interface EmotionAnalysis {
  primaryEmotion: EmotionType;
  confidence: number;
  secondaryEmotions: Array<{
    emotion: EmotionType;
    confidence: number;
  }>;
  timestamp: string;
}

// Define application state
interface EmotionalInsightState {
  currentStep: STEPS;
  mediaSource: {
    type: 'video' | 'audio' | 'text' | null;
    url: string | null;
    content: string | null;
  };
  analysis: EmotionAnalysis | null;
  userReflection: {
    accuracy: 'high' | 'medium' | 'low' | null;
    reasons: string;
    businessApplication: string;
  };
  isLoading: boolean;
  error: string | null;
  apiKey: string;
}

// Initial state
const createInitialState = (): EmotionalInsightState => {
  return {
    currentStep: STEPS.UPLOAD,
    mediaSource: {
      type: null,
      url: null,
      content: null
    },
    analysis: null,
    userReflection: {
      accuracy: null,
      reasons: '',
      businessApplication: ''
    },
    isLoading: false,
    error: null,
    apiKey: 'YrjbSaArbGC5t8B2jizNGa5GZoDbqAQmvS2GSw8dvtjjBHG3' // Default API key
  };
};

const EmotionalInsightMain: React.FC = () => {
  const [state, setState] = useState<EmotionalInsightState>(createInitialState());
  
  // Add state for challenge completion and confetti
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(
    userProgress.completedChallenges.includes('challenge-8')
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Check if challenge is already completed on mount
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-8')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Update state helper function
  const updateState = (newState: Partial<EmotionalInsightState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };
  
  // Navigation helpers
  const goToNextStep = () => {
    if (state.currentStep < STEPS.APPLICATION) {
      updateState({ currentStep: state.currentStep + 1 });
    }
  };
  
  const goToPreviousStep = () => {
    if (state.currentStep > STEPS.UPLOAD) {
      updateState({ currentStep: state.currentStep - 1 });
    }
  };
  
  const goToStep = (step: STEPS) => {
    updateState({ currentStep: step });
  };
  
  // Handle media upload/input
  const handleMediaUpload = (type: 'video' | 'audio' | 'text', url: string | null, content: string | null) => {
    updateState({
      mediaSource: {
        type,
        url,
        content
      }
    });
    
    if (type && (url || content)) {
      analyzeEmotion(type, url, content);
    }
  };
  
  // Handle API key update
  const handleApiKeyUpdate = (apiKey: string) => {
    updateState({ apiKey });
  };
  
  // Handle emotional analysis
  const analyzeEmotion = async (type: 'video' | 'audio' | 'text', url: string | null, content: string | null) => {
    updateState({ isLoading: true, error: null });
    
    try {
      // In a real implementation, we would call the Hume AI API here
      // For now, we'll simulate a response with mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockAnalysis: EmotionAnalysis = {
        primaryEmotion: 'joy',
        confidence: 85,
        secondaryEmotions: [
          { emotion: 'surprise', confidence: 40 },
          { emotion: 'neutral', confidence: 25 }
        ],
        timestamp: new Date().toISOString()
      };
      
      updateState({ 
        analysis: mockAnalysis,
        isLoading: false
      });
      
      // Move to analysis step
      goToNextStep();
    } catch (error) {
      updateState({ 
        error: `Failed to analyze emotions: ${error instanceof Error ? error.message : String(error)}`,
        isLoading: false
      });
    }
  };
  
  // Handle reflection submission
  const handleReflectionSubmit = (accuracy: 'high' | 'medium' | 'low', reasons: string, businessApplication: string) => {
    updateState({
      userReflection: {
        accuracy,
        reasons,
        businessApplication
      }
    });
    
    goToNextStep();
  };
  
  // Handle restart
  const handleRestart = () => {
    setState(createInitialState());
  };
  
  // Handle completing the challenge
  const handleCompleteChallenge = () => {
    // Check if user has completed enough of the challenge to mark as complete
    if (!state.analysis || !state.userReflection.businessApplication) {
      alert('Please complete the emotion analysis and apply it to a business context before completing the challenge.');
      return;
    }
    
    markChallengeAsCompleted('challenge-8');
    setIsCompleted(true);
    
    // Show confetti
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };
  
  // Render the current step
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case STEPS.UPLOAD:
        return (
          <MediaUpload
            onUpload={handleMediaUpload}
            onApiKeyUpdate={handleApiKeyUpdate}
            apiKey={state.apiKey}
            isLoading={state.isLoading}
          />
        );
      
      case STEPS.ANALYSIS:
        if (!state.analysis || !state.mediaSource.type) {
          return <div>Missing analysis data</div>;
        }
        
        return (
          <EmotionAnalysisComponent
            analysis={state.analysis}
            mediaType={state.mediaSource.type}
            mediaUrl={state.mediaSource.url}
            mediaContent={state.mediaSource.content}
            onContinue={goToNextStep}
            onReanalyze={() => goToStep(STEPS.UPLOAD)}
          />
        );
      
      case STEPS.REFLECTION:
        if (!state.analysis) {
          return <div>Missing analysis data</div>;
        }
        
        return (
          <Reflection
            analysis={state.analysis}
            onSubmit={handleReflectionSubmit}
            onBack={goToPreviousStep}
          />
        );
      
      case STEPS.APPLICATION:
        if (!state.analysis || !state.userReflection.accuracy) {
          return <div>Missing analysis or reflection data</div>;
        }
        
        return (
          <BusinessApplication
            analysis={state.analysis}
            userReflection={state.userReflection}
            onRestart={handleRestart}
            onBack={goToPreviousStep}
          />
        );
      
      default:
        return <div>Unknown step</div>;
    }
  };
  
  // Render progress steps
  const renderProgressSteps = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {Object.values(STEPS).filter(step => typeof step === 'number').map((step: number) => (
          <React.Fragment key={step}>
            {/* Step button */}
            <button
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${state.currentStep === step
                  ? 'bg-blue-600 text-white'
                  : state.currentStep > step
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-200 text-gray-600'
                }
                ${state.currentStep > step ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
              onClick={() => {
                if (state.currentStep > step) {
                  goToStep(step as STEPS);
                }
              }}
              disabled={state.currentStep <= step}
            >
              {step + 1}
            </button>
            
            {/* Step label */}
            <div className="hidden sm:block ml-2 mr-8 text-sm">
              <div className={state.currentStep >= step ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                {Object.keys(STEPS).find(key => STEPS[key as keyof typeof STEPS] === step)?.split('_').join(' ')}
              </div>
            </div>
            
            {/* Connector line */}
            {step < STEPS.APPLICATION && (
              <div className={`flex-grow h-1 mx-2 ${state.currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // Main render
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Show confetti animation when challenge is completed */}
      {showConfetti && <Confetti active={showConfetti} />}
      
      <ChallengeHeader
        title="Emotional Insight Challenge"
        icon={<Smile className="h-6 w-6 text-pink-600" />}
        challengeId="challenge-10" // Corrected to match ID in ChallengeHubNew.tsx
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
      />
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Progress Steps */}
        {renderProgressSteps()}
        
        {/* Current Step */}
        {renderCurrentStep()}
      </div>
      
      <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm">
          Having issues with face detection? 
          <a href="/face-detection-test" className="ml-2 text-blue-600 hover:text-blue-800 underline">
            Try our test page →
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmotionalInsightMain; 