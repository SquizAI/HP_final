import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import IndustrySelection from './IndustrySelection'
import BusinessOpportunities from './steps/BusinessOpportunities'
import TrendAnalysis from './TrendAnalysis'
import CompletionScreen from './steps/CompletionScreen'
import { ApiResponse } from '../../../services/openai'
import { useUserProgress, saveChallengeTrend, calculateUserScore, updateLeaderboard, markChallengeAsCompleted } from '../../../utils/userDataManager'
import ChallengeHeader from '../../shared/ChallengeHeader'
import { LineChart } from 'lucide-react'

// Define challenge steps - now we skip the Discover Trends step in the UI
// We'll handle it automatically after industry selection
const STEPS = [
  { id: 'industry', title: 'Select Industry', emoji: '🔍' },
  { id: 'opportunities', title: 'Business Opportunities', emoji: '💰' },
  { id: 'analysis', title: 'Your Analysis', emoji: '🧠' }
]

// Fun facts about trend spotting to display randomly
const TREND_FACTS = [
  "Did you know? 64% of successful entrepreneurs claim they got their best ideas while in the shower.",
  "Fun fact: The creator of the Pet Rock made over $1 million in just six months from a literal rock.",
  "True story: The fidget spinner was actually invented in the 1990s but didn't become a trend until 2017.",
  "Weird but true: In 1999, experts predicted that by 2020 we'd have flying cars. Instead, we got remote work and sourdough bread.",
  "Interesting: The term 'FOMO' (Fear Of Missing Out) wasn't added to the dictionary until 2013, despite causing anxiety since forever."
]

export interface ChallengeState {
  selectedIndustry: string;
  selectedIndustryName: string;
  selectedTrend: string;
  justification: string;
  trendsData: Record<string, ApiResponse>;
  opportunitiesData: Record<string, ApiResponse>;
}

const TrendSpotterChallenge: React.FC = () => {
  // Get user progress from localStorage
  const [userProgress, setUserProgress] = useUserProgress();
  
  // State management
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState<boolean>(userProgress.completedChallenges.includes('challenge-2'))
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  
  // State for all challenge data
  const [state, setState] = useState<ChallengeState>(() => {
    // Retrieve saved challenge data if it exists
    const savedData = userProgress.challengeData['challenge-2']?.trendSpotter;
    
    if (savedData && isCompleted) {
      return {
        selectedIndustry: savedData.industry || '',
        selectedIndustryName: savedData.industry || '',
        selectedTrend: savedData.trend || '',
        justification: savedData.analysis || '',
        trendsData: {},
        opportunitiesData: {}
      };
    }
    
    return {
      selectedIndustry: '',
      selectedIndustryName: '',
      selectedTrend: '',
      justification: '',
      trendsData: {},
      opportunitiesData: {}
    };
  });
  
  // Update state helpers
  const updateState = (newState: Partial<ChallengeState>) => {
    setState(prev => ({ ...prev, ...newState }))
  }
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }
  
  // Complete the challenge
  const completeChallenge = () => {
    setIsCompleted(true)
    
    // Save challenge data
    saveChallengeTrend(
      'challenge-2',
      state.selectedIndustryName,
      state.selectedTrend,
      state.justification
    );
    
    // Add to completed challenges if not already there
    if (!userProgress.completedChallenges.includes('challenge-2')) {
      markChallengeAsCompleted('challenge-2')
      
      // Show confetti
      setShowConfetti(true)
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
      
      // Update leaderboard with new score
      const score = calculateUserScore();
      updateLeaderboard(score);
    }
  }
  
  // Restart the challenge
  const restartChallenge = () => {
    setCurrentStep(0)
    setState({
      selectedIndustry: '',
      selectedIndustryName: '',
      selectedTrend: '',
      justification: '',
      trendsData: {},
      opportunitiesData: {}
    })
    setIsCompleted(false)
  }
  
  // Get a random fun fact
  const getRandomFact = () => {
    return TREND_FACTS[Math.floor(Math.random() * TREND_FACTS.length)]
  }
  
  // Render step progress indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, index) => (
            <div 
              key={index}
              className={`text-sm font-medium transition-colors flex items-center ${
                index === currentStep ? 'text-[#5CB2CC] font-bold' : 
                index < currentStep ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <span className="mr-1">{step.emoji}</span>
              <span>{index + 1}. {step.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#5CB2CC] transition-all duration-300" 
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-gray-500 italic">
          {getRandomFact()}
        </div>
      </div>
    )
  }
  
  // This handles selecting a trend after industry selection
  // and skips directly to the business opportunities step
  const handleTrendSelect = (trend: string) => {
    updateState({ selectedTrend: trend })
    // Don't increment currentStep since we're skipping the trends step
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <ChallengeHeader
        title="AI Trend Spotter"
        icon={<LineChart className="h-6 w-6 text-orange-500" />}
        challengeId="challenge-2"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={completeChallenge}
      />
      
      {!isCompleted && renderStepIndicator()}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isCompleted ? (
          <CompletionScreen 
            state={state} 
            onRestart={restartChallenge}
          />
        ) : (
          <>
            {currentStep === 0 && (
              <IndustrySelection 
                state={state} 
                updateState={updateState} 
                onNext={goToNextStep}
              />
            )}
            {currentStep === 1 && (
              <BusinessOpportunities 
                state={state} 
                updateState={updateState}
                onNext={goToNextStep}
                onBack={goToPrevStep}
              />
            )}
            {currentStep === 2 && (
              <TrendAnalysis 
                state={state} 
                updateState={updateState}
                onComplete={completeChallenge}
                onBack={goToPrevStep}
              />
            )}
          </>
        )}
      </div>
      
      {!isCompleted && (
        <div className="mt-4 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg flex items-start">
          <div className="text-xl mr-3">💡</div>
          <div>
            <strong>Pro Tip:</strong> {" "}
            {currentStep === 0 && "Choose an industry you're curious about—or pick something wild just for fun. Nobody becomes a trend guru by playing it safe!"}
            {currentStep === 1 && "Remember that Facebook was once just 'that website where college kids rate each other.' Think big!"}
            {currentStep === 2 && "Don't just analyze the trend—imagine how you'd explain it to your grandma at Thanksgiving dinner."}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrendSpotterChallenge 