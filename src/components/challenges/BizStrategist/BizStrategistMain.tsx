import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUserProgress, saveChallengeBizStrategy, calculateUserScore, updateLeaderboard, markChallengeAsCompleted } from '../../../utils/userDataManager'
import { ApiResponse } from '../../../services/openai'
import BusinessGoalSelection from './BusinessGoalSelection'
import MarketAnalysis from './MarketAnalysis'
import StrategyDevelopment from './StrategyDevelopment'
import StrategyAssessment from './StrategyAssessment'
import CompletionScreen from './CompletionScreen'
import IntroScreen from './IntroScreen'
import FinancialDataAnalysis from './FinancialDataAnalysis'
import { motion } from 'framer-motion'
import ChallengeHeader from '../../shared/ChallengeHeader'
import { PieChart } from 'lucide-react'

// Strategy Analysis types
export interface StrengthWeakness {
  point: string;
  explanation: string;
}

export interface StrategyAlternative {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface RiskOpportunity {
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
}

export interface AIStrategyAnalysis {
  overallScore: number;
  cohesionScore: number;
  feasibilityScore: number;
  innovationScore: number;
  summary: string;
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
  risks: RiskOpportunity[];
  opportunities: RiskOpportunity[];
  alternatives: StrategyAlternative[];
  executionTips: string[];
}

// Main BizStrategy state
export interface BizStrategyState {
  businessGoal: string;
  businessType: string;
  industry: string;
  marketInsights: string[];
  selectedStrategies: string[];
  financialData: any;
  financialInsights: string[];
  aiRecommendation: string;
  userRecommendation: string;
  suggestedRecommendation: string;
  scenarioResults: any;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

const INITIAL_STATE: BizStrategyState = {
  businessGoal: '',
  businessType: '',
  industry: '',
  marketInsights: [],
  selectedStrategies: [],
  financialData: null,
  financialInsights: [],
  aiRecommendation: '',
  userRecommendation: '',
  suggestedRecommendation: '',
  scenarioResults: null,
  strengths: [],
  weaknesses: [],
  opportunities: [],
  threats: [],
};

// Challenge steps
export enum STEPS {
  INTRO = 'INTRO',
  FINANCIAL_ANALYSIS = 'FINANCIAL_ANALYSIS',
  MARKET_ANALYSIS = 'MARKET_ANALYSIS',
  STRATEGY_DEVELOPMENT = 'STRATEGY_DEVELOPMENT',
  STRATEGY_ASSESSMENT = 'STRATEGY_ASSESSMENT',
}

// Fun business strategy facts to display
const STRATEGY_FACTS = [
  "Only 30% of executives report their companies' strategies deliver the expected results.",
  "Companies that have clearly articulated, well-communicated strategies typically outperform their competitors by 304%.",
  "The average company changes strategic direction every 2.7 years.",
  "70% of strategic failures are due to poor execution, not poor strategy.",
  "More than 60% of organizations don't link their budgets to strategy.",
  "McKinsey found that companies with a clear 'strategic identity' have 3x higher returns to shareholders.",
  "The most successful companies spend 10-30% of their time reassessing strategy.",
  "Companies that actively seek customer feedback during strategy development have a 45% higher success rate.",
  "Strategy is the #1 leadership challenge according to 40% of CEOs.",
  "Businesses with a documented strategy are 538% more likely to be successful than those without."
];

const BizStrategistMain: React.FC = () => {
  const [state, setState] = useState<BizStrategyState>(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.INTRO);
  const [funFact, setFunFact] = useState<string>('');
  const [userProgress, setUserProgress] = useUserProgress();
  
  // Add state for challenge completion and confetti
  const [isCompleted, setIsCompleted] = useState<boolean>(
    userProgress.completedChallenges.includes('challenge-3')
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Check if challenge is already completed on mount
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-3')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Handle completing the challenge
  const handleCompleteChallenge = () => {
    // Check if user has completed the strategy assessment to mark as complete
    if (currentStep !== STEPS.STRATEGY_ASSESSMENT && !isCompleted) {
      alert('Please complete your strategy assessment before finishing the challenge.');
      return;
    }
    
    markChallengeAsCompleted('challenge-3');
    setIsCompleted(true);
    
    // Show confetti
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  // Set a random fun fact on initial load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * STRATEGY_FACTS.length);
    setFunFact(STRATEGY_FACTS[randomIndex]);
  }, []);

  const updateState = (newState: Partial<BizStrategyState>) => {
    setState(prevState => {
      const updatedState = { ...prevState, ...newState };
      // Save to localStorage whenever state changes
      saveChallengeBizStrategy(
        'challenge-3',
        updatedState.businessGoal,
        updatedState.businessType,
        updatedState.industry,
        updatedState.selectedStrategies,
        updatedState.scenarioResults
      );
      return updatedState;
    });
  };

  const nextStep = () => {
    switch (currentStep) {
      case STEPS.INTRO:
        setCurrentStep(STEPS.FINANCIAL_ANALYSIS);
        break;
      case STEPS.FINANCIAL_ANALYSIS:
        setCurrentStep(STEPS.MARKET_ANALYSIS);
        break;
      case STEPS.MARKET_ANALYSIS:
        setCurrentStep(STEPS.STRATEGY_DEVELOPMENT);
        break;
      case STEPS.STRATEGY_DEVELOPMENT:
        setCurrentStep(STEPS.STRATEGY_ASSESSMENT);
        break;
      default:
        break;
    }
  };

  const previousStep = () => {
    switch (currentStep) {
      case STEPS.FINANCIAL_ANALYSIS:
        setCurrentStep(STEPS.INTRO);
        break;
      case STEPS.MARKET_ANALYSIS:
        setCurrentStep(STEPS.FINANCIAL_ANALYSIS);
        break;
      case STEPS.STRATEGY_DEVELOPMENT:
        setCurrentStep(STEPS.MARKET_ANALYSIS);
        break;
      case STEPS.STRATEGY_ASSESSMENT:
        setCurrentStep(STEPS.STRATEGY_DEVELOPMENT);
        break;
      default:
        break;
    }
  };

  const getStepLabel = (step: STEPS): string => {
    switch (step) {
      case STEPS.INTRO:
        return "Introduction";
      case STEPS.FINANCIAL_ANALYSIS:
        return "1. Review Financial Data";
      case STEPS.MARKET_ANALYSIS:
        return "2. Review Market Analysis";
      case STEPS.STRATEGY_DEVELOPMENT:
        return "3. Develop Your Strategy";
      case STEPS.STRATEGY_ASSESSMENT:
        return "4. Challenge Complete!";
      default:
        return "";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.INTRO:
        return <IntroScreen onNext={nextStep} />;
      case STEPS.FINANCIAL_ANALYSIS:
        return (
          <FinancialDataAnalysis
            state={state}
            updateState={updateState}
            onNext={nextStep}
          />
        );
      case STEPS.MARKET_ANALYSIS:
        return (
          <MarketAnalysis
            state={state}
            updateState={updateState}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case STEPS.STRATEGY_DEVELOPMENT:
        return (
          <StrategyDevelopment
            state={state}
            updateState={updateState}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case STEPS.STRATEGY_ASSESSMENT:
        return (
          <StrategyAssessment
            state={state}
            onBack={previousStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <ChallengeHeader
        title="AI Biz Strategist: Smart Decisions, Smarter Growth!"
        icon={<PieChart className="h-6 w-6 text-cyan-600" />}
        challengeId="challenge-13"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
      />
      
      {/* How AI Works for You */}
      <div className="mb-8 mt-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100 shadow-sm">
          <h2 className="text-xl font-bold text-blue-800 mb-3">How AI Works for You</h2>
          <p className="text-gray-700 mb-4">Make data work for you! In this challenge, you'll put AI to the test by analyzing financial trends, uncovering strategic opportunities, and making smarter business decisions—just like top executives do. AI processes vast amounts of data in seconds, detecting patterns, evaluating risks, and predicting outcomes to help you build a winning strategy with confidence!</p>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
            <h3 className="font-bold text-blue-700 mb-2">Tools Used</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li><span className="font-medium">Financial Data Analyzer:</span> AI-powered analysis of financial metrics, identifying trends, anomalies, and opportunities in your business data.</li>
              <li><span className="font-medium">Strategic Recommendation Engine:</span> Generate data-driven strategy recommendations based on financial insights, market analysis, and industry best practices.</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Challenge Steps Quick View */}
      <div className="mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Challenge Steps Quick View</h2>
          <p className="text-gray-700 mb-4">There are 4 steps required to complete the Challenge. Don't forget to check out the Pro-Tips at the end of the challenge to see how to leverage AI for analysis back on the job.</p>
          
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-2 mt-0.5">1</span>
              <span><span className="font-medium">Review Financial Data:</span> Examine sample quarterly financial data, identify key trends, and get AI-powered insights to inform your strategic decisions.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-2 mt-0.5">2</span>
              <span><span className="font-medium">Review Market Analysis:</span> Get AI-generated market insights relevant to your industry and business goals, and select the most important factors for your strategy.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-2 mt-0.5">3</span>
              <span><span className="font-medium">Develop Your Strategy:</span> Select strategic elements that address your financial goals and market opportunities, letting AI create a comprehensive recommended business strategy.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-2 mt-0.5">4</span>
              <span><span className="font-medium">Challenge Complete!</span></span>
            </li>
          </ul>
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Take the Challenge!</h2>
          <p className="text-gray-700">Please review and follow each detailed step below.</p>
        </div>
      </div>
      
      {/* Progress indicator only shown after intro */}
      {currentStep !== STEPS.INTRO && (
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {Object.values(STEPS).filter(step => step !== STEPS.INTRO).map((step) => (
              <div 
                key={step}
                className={`text-sm ${
                  step === currentStep 
                    ? 'text-[#0097A7] font-medium' 
                    : 'text-gray-500'
                }`}
              >
                {getStepLabel(step as STEPS)}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#0097A7]"
              initial={{ width: '0%' }}
              animate={{ 
                width: currentStep === STEPS.FINANCIAL_ANALYSIS
                  ? '25%'
                  : currentStep === STEPS.MARKET_ANALYSIS
                  ? '50%'
                  : currentStep === STEPS.STRATEGY_DEVELOPMENT
                  ? '75%'
                  : currentStep === STEPS.STRATEGY_ASSESSMENT
                  ? '100%'
                  : '0%'
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
      
      {/* Current step component */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {renderStep()}
      </div>
      
      {/* Pro-Tips section (only displayed after completion) */}
      {currentStep === STEPS.STRATEGY_ASSESSMENT && (
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-blue-100 shadow-sm">
            <h2 className="text-xl font-bold text-blue-800 mb-3">Pro-Tips: Applying AI Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <h3 className="font-bold text-blue-700 mb-2 flex items-center">
                  <span className="mr-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">1</span>
                  Connect Multiple Data Sources
                </h3>
                <p className="text-gray-700">Create a more comprehensive picture by asking AI to analyze data from various sources, including financial statements, market research, customer feedback, and competitive intelligence.</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <h3 className="font-bold text-blue-700 mb-2 flex items-center">
                  <span className="mr-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">2</span>
                  Explore Multiple Scenarios
                </h3>
                <p className="text-gray-700">Have AI generate multiple strategy options by changing key assumptions, market conditions, or business goals to understand different possible outcomes.</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <h3 className="font-bold text-blue-700 mb-2 flex items-center">
                  <span className="mr-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">3</span>
                  Validate AI Recommendations
                </h3>
                <p className="text-gray-700">Always cross-check AI insights with your team's expertise and industry knowledge. The best strategies combine AI-powered analysis with human judgment.</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <h3 className="font-bold text-blue-700 mb-2 flex items-center">
                  <span className="mr-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">4</span>
                  Iterate and Refine
                </h3>
                <p className="text-gray-700">Use AI as an ongoing strategic partner. Regularly update your data and ask AI to refine its analysis as market conditions change and new information becomes available.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BizStrategistMain; 