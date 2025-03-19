import React, { useState, useEffect } from 'react';
import { saveChallengeDataAnalyst, useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import DatasetSelection from './DatasetSelection';
import DataExploration from './DataExploration';
import DataVisualization from './DataVisualization';
import InsightGeneration from './InsightGeneration';
import CompletionScreen from './CompletionScreen';
import ChallengeHeader from '../../shared/ChallengeHeader';
import { LineChart, BarChart, PieChart, ArrowLeft, ChevronRight, Database, TrendingUp, Lightbulb, Award } from 'lucide-react';
import Confetti from '../../shared/Confetti';

// Data Analysis types
export interface DataInsight {
  title: string;
  description: string;
  importance: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
}

export interface DataVisualization {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'custom';
  description: string;
  insights: string[];
  data?: any[]; // Optional array of data for visualization
}

// Main DataAnalyst state
export interface DataAnalystState {
  datasetName: string;
  datasetType: string;
  businessQuestion: string;
  explorationSummary: string;
  keyMetrics: string[];
  anomalies: string[];
  visualizations: DataVisualization[];
  insights: DataInsight[];
  actionItems: string[];
  userNotes: string;
  isComplete: boolean;
}

const INITIAL_STATE: DataAnalystState = {
  datasetName: '',
  datasetType: '',
  businessQuestion: '',
  explorationSummary: '',
  keyMetrics: [],
  anomalies: [],
  visualizations: [],
  insights: [],
  actionItems: [],
  userNotes: '',
  isComplete: false
};

// Challenge steps
enum STEPS {
  DATASET_SELECTION = 0,
  DATA_EXPLORATION = 1,
  DATA_VISUALIZATION = 2,
  INSIGHT_GENERATION = 3,
  COMPLETION = 4
}

// Fun data analysis facts to display
const ANALYSIS_FACTS = [
  "The term 'Big Data' was first used in 1997, long before it became a business buzzword.",
  "The average company only analyzes about 12% of the data they collect.",
  "Data Scientists spend 80% of their time cleaning and preparing data and only 20% analyzing it.",
  "Netflix saves $1 billion per year through data-driven customer retention strategies.",
  "Bad data costs U.S. businesses $3 trillion per year.",
  "90% of the world's data has been created in the last two years.",
  "Only 33% of companies effectively use data to make decisions.",
  "Amazon's recommendation engine drives 35% of their total sales.",
  "Companies that use data-driven decision making are 5% more productive and 6% more profitable.",
  "The global big data market is expected to reach $103 billion by 2027."
];

const DataAnalystMain: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.DATASET_SELECTION);
  const [state, setState] = useState<DataAnalystState>(INITIAL_STATE);
  const [funFact, setFunFact] = useState<string>('');
  
  // User progress tracking for completion
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(
    userProgress.completedChallenges.includes('challenge-15')
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Set a random fun fact on initial load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ANALYSIS_FACTS.length);
    setFunFact(ANALYSIS_FACTS[randomIndex]);
  }, []);

  // Update state and save
  const updateState = (newState: Partial<DataAnalystState>) => {
    setState(prevState => {
      const updatedState = { ...prevState, ...newState };
      // Save to localStorage whenever state changes
      saveChallengeDataAnalyst(
        'challenge-15',
        updatedState
      );
      return updatedState;
    });
  };

  // Using the standardized saveChallengeDataAnalyst function from userDataManager.ts

  // Navigate to next step
  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep <= STEPS.COMPLETION) {
      setCurrentStep(nextStep as STEPS);
      
      // If moving to completion, mark challenge as complete
      if (nextStep === STEPS.COMPLETION) {
        updateState({ isComplete: true });
        
        // Mark challenge as completed using standard function
        markChallengeAsCompleted('challenge-15');
      }

      // Show a new fun fact when moving to the next step
      const randomIndex = Math.floor(Math.random() * ANALYSIS_FACTS.length);
      setFunFact(ANALYSIS_FACTS[randomIndex]);
      
      // Scroll to top
      window.scrollTo(0, 0);
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= STEPS.DATASET_SELECTION) {
      setCurrentStep(prevStep as STEPS);
      window.scrollTo(0, 0);
    } else {
      // Navigate back to the previous page in browser history
      window.history.back();
    }
  };

  // Restart the challenge
  const handleRestart = () => {
    setState(INITIAL_STATE);
    setCurrentStep(STEPS.DATASET_SELECTION);
    const randomIndex = Math.floor(Math.random() * ANALYSIS_FACTS.length);
    setFunFact(ANALYSIS_FACTS[randomIndex]);
    window.scrollTo(0, 0);
  };

  // Get step label based on current step
  const getStepLabel = (step: STEPS): string => {
    switch (step) {
      case STEPS.DATASET_SELECTION: return 'Select Dataset';
      case STEPS.DATA_EXPLORATION: return 'Explore Data';
      case STEPS.DATA_VISUALIZATION: return 'Create Visualizations';
      case STEPS.INSIGHT_GENERATION: return 'Generate Insights';
      case STEPS.COMPLETION: return 'Analysis Complete';
    }
  };

  // Handle completing the challenge
  const handleCompleteChallenge = () => {
    // Update state to mark as complete
    updateState({ isComplete: true });
    
    // Mark in user progress using the correct challenge ID from ChallengeHubNew.tsx
    markChallengeAsCompleted('challenge-15');
    setIsCompleted(true);
    
    // Show confetti
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    // Move to completion step
    setCurrentStep(STEPS.COMPLETION);
    window.scrollTo(0, 0);
  };

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Show confetti animation when challenge is completed */}
      {showConfetti && <Confetti active={showConfetti} />}
      
      <ChallengeHeader
        title="AI Data Analyst: Unlock Insights with AI-Powered Analytics"
        icon={<BarChart className="h-6 w-6 text-purple-600" />}
        challengeId="challenge-15"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
      />
      
      {/* Main content area */}
      <div className="mt-4">
        {/* How AI Works section */}
        {currentStep === STEPS.DATASET_SELECTION && (
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 text-purple-600 mr-2" /> 
              How AI Works for You
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                AI-powered data analysis transforms how organizations extract insights from data. Here's how it works:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <Database className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="text-md font-medium text-gray-800">Data Processing</h3>
                  </div>
                  <p className="text-sm text-gray-600">AI can analyze massive datasets quickly, identifying patterns and correlations that would take humans much longer to discover.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="text-md font-medium text-gray-800">Predictive Analytics</h3>
                  </div>
                  <p className="text-sm text-gray-600">Machine learning models can forecast trends and predict future outcomes based on historical data patterns.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="text-md font-medium text-gray-800">Actionable Insights</h3>
                  </div>
                  <p className="text-sm text-gray-600">AI transforms raw data into strategic recommendations, helping businesses make informed decisions faster.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Challenge Steps Quick View */}
        {currentStep === STEPS.DATASET_SELECTION && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ChevronRight className="h-5 w-5 text-purple-600 mr-2" /> 
              Challenge Steps Quick View
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium mr-3">1</div>
                <div>
                  <h3 className="text-md font-medium text-gray-800">Select Dataset</h3>
                  <p className="text-sm text-gray-600">Choose a dataset to analyze from our pre-selected options.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium mr-3">2</div>
                <div>
                  <h3 className="text-md font-medium text-gray-800">Explore Data</h3>
                  <p className="text-sm text-gray-600">Examine the dataset structure and understand key variables.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium mr-3">3</div>
                <div>
                  <h3 className="text-md font-medium text-gray-800">Create Visualizations</h3>
                  <p className="text-sm text-gray-600">Generate visual representations to better understand the data.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium mr-3">4</div>
                <div>
                  <h3 className="text-md font-medium text-gray-800">Generate Insights</h3>
                  <p className="text-sm text-gray-600">Discover meaningful patterns and actionable recommendations.</p>
                </div>
              </div>
            </div>
            
            {/* Take the Challenge prompt */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-center">
                <button 
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                >
                  Take the Challenge
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress steps */}
        {currentStep < STEPS.COMPLETION && (
          <div className="px-6 py-4">
            <div className="mb-2 flex justify-between text-sm text-gray-500">
              <span>Start</span>
              <span>Complete</span>
            </div>
            <div className="flex mb-6">
              {Object.values(STEPS).filter(step => typeof step === 'number' && step < STEPS.COMPLETION).map((step) => (
                <div key={step} className="flex-1 relative">
                  <div 
                    className={`h-2 ${
                      Number(step) < currentStep 
                        ? 'bg-[#6200EA]' 
                        : Number(step) === currentStep 
                          ? 'bg-[#B388FF]' 
                          : 'bg-gray-200'
                    }`}
                  />
                  <div 
                    className={`w-6 h-6 rounded-full absolute top-[-8px] ${
                      Number(step) <= currentStep ? 'bg-[#6200EA] text-white' : 'bg-gray-200 text-gray-500'
                    } flex items-center justify-center text-xs font-medium`}
                    style={{ left: step === 0 ? 0 : '50%', transform: step === 0 ? 'none' : 'translateX(-50%)' }}
                  >
                    {Number(step) + 1}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mb-8">
              <h2 className="text-lg font-medium text-gray-800">{getStepLabel(currentStep)}</h2>
              <p className="text-sm text-gray-500">Step {currentStep + 1} of {STEPS.COMPLETION}</p>
            </div>
          </div>
        )}

        {/* Back button for steps after the first one */}
        {currentStep > STEPS.DATASET_SELECTION && currentStep < STEPS.COMPLETION && (
          <div className="px-6 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to {getStepLabel(currentStep - 1 as STEPS)}
            </button>
          </div>
        )}

        {/* Fun fact box */}
        {currentStep < STEPS.COMPLETION && (
          <div className="px-6 mb-8">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="text-purple-600 text-xl mr-3">💡</div>
                <div>
                  <h3 className="font-medium text-purple-800 mb-1">Data Insight</h3>
                  <p className="text-purple-700 text-sm">{funFact}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step content */}
        <div>
          {currentStep === STEPS.DATASET_SELECTION && (
            <DatasetSelection 
              state={state}
              updateState={updateState}
              onNext={handleNext}
            />
          )}
          
          {currentStep === STEPS.DATA_EXPLORATION && (
            <DataExploration 
              state={state}
              updateState={updateState}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === STEPS.DATA_VISUALIZATION && (
            <DataVisualization 
              state={state}
              updateState={updateState}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === STEPS.INSIGHT_GENERATION && (
            <InsightGeneration 
              state={state}
              updateState={updateState}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === STEPS.COMPLETION && (
            <CompletionScreen 
              state={state}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataAnalystMain;
