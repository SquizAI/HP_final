import React, { useState, useEffect } from 'react';
import { BizStrategyState } from './BizStrategistMain';
import { getApiKey } from '../../../services/openai';
import { CheckCircle, ArrowRight, Lightbulb, Check, Brain } from 'lucide-react';

interface StrategyDevelopmentProps {
  state: BizStrategyState;
  updateState: (newState: Partial<BizStrategyState>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Strategy element categories
const STRATEGY_CATEGORIES = [
  {
    id: 'financial',
    title: 'Financial Strategies',
    description: 'Approaches to optimize financial performance and resource allocation',
    icon: '💰'
  },
  {
    id: 'market',
    title: 'Market Strategies',
    description: 'Approaches to address market opportunities and competitive positioning',
    icon: '📈'
  },
  {
    id: 'operational',
    title: 'Operational Strategies',
    description: 'Approaches to improve internal processes and organizational efficiency',
    icon: '⚙️'
  },
  {
    id: 'innovation',
    title: 'Innovation Strategies',
    description: 'Approaches to develop new products, services, or business models',
    icon: '💡'
  },
  {
    id: 'risk',
    title: 'Risk Management Strategies',
    description: 'Approaches to identify, assess, and mitigate business risks',
    icon: '🛡️'
  }
];

// Add proper types for StrategyItem interface
interface StrategyItem {
  id: string;
  name: string;
  description: string;
  category: string;
}

// New component for better strategy selection
const StrategyCard = ({ 
  strategy, 
  isSelected, 
  onClick, 
  disabled = false 
}: { 
  strategy: { 
    id: string, 
    name: string, 
    description: string, 
    category: string 
  }, 
  isSelected: boolean, 
  onClick: () => void,
  disabled?: boolean
}) => {
  return (
    <div 
      className={`
        relative p-4 border rounded-lg cursor-pointer transition-all
        ${isSelected 
          ? 'border-[#0097A7] bg-[#E0F7FA] shadow-md transform scale-[1.02]' 
          : 'border-gray-200 bg-white hover:border-[#0097A7] hover:shadow-sm'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 text-[#0097A7]">
          <CheckCircle size={20} />
        </div>
      )}
      <h4 className="font-medium text-gray-800 mb-1">{strategy.name}</h4>
      <p className="text-sm text-gray-600">{strategy.description}</p>
      
      {isSelected && (
        <div className="mt-3 flex items-center text-xs text-[#0097A7]">
          <Check size={14} className="mr-1" />
          Selected
        </div>
      )}
    </div>
  );
};

// AI processing overlay component to explain AI strategy generation
const AIProcessingOverlay = ({ 
  isVisible, 
  progress = 0 
}: { 
  isVisible: boolean, 
  progress?: number 
}) => {
  if (!isVisible) return null;
  
  const messages = [
    "Analyzing selected strategies and financial data...",
    "Evaluating strategy alignment with business goals...",
    "Identifying potential execution challenges...",
    "Calculating projected outcomes and metrics...", 
    "Formulating comprehensive strategy recommendations..."
  ];
  
  const currentMessageIndex = Math.min(Math.floor(progress * messages.length), messages.length - 1);
  const currentMessage = messages[currentMessageIndex];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="relative mx-auto mb-6">
            <div className="w-20 h-20 border-4 border-[#E0F7FA] rounded-full mx-auto flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-t-4 border-[#0097A7] rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain size={30} className="text-[#0097A7]" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Generating Strategy Analysis</h3>
          <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
            <h4 className="font-medium text-blue-800 mb-3 flex items-center">
              <Lightbulb className="mr-2" size={18} />
              What's happening:
            </h4>
            <p className="text-blue-900 mb-3">{currentMessage}</p>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Our AI is analyzing your strategy selections to provide tailored recommendations.
            This typically takes 5-10 seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

// Toast notification for feedback
const ActionFeedback = ({ message, isVisible }: { message: string, isVisible: boolean }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
      <div className="flex items-center">
        <div className="mr-3 text-green-400">✓</div>
        <p>{message}</p>
      </div>
    </div>
  );
};

const StrategyDevelopment: React.FC<StrategyDevelopmentProps> = ({ state, updateState, onNext, onBack }) => {
  const [selectedStrategies, setSelectedStrategies] = useState(state.selectedStrategies || []);
  const [activeCategory, setActiveCategory] = useState('financial');
  const [maxStrategies] = useState(5);
  const [isGeneratingStrategies, setIsGeneratingStrategies] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Fix the strategies object to match the StrategyItem interface
  // Add this right after the state declarations
  const strategies: Record<string, StrategyItem[]> = {
    financial: [
      { id: 'fin1', name: 'Cost Optimization', description: 'Reduce operational expenses to improve profit margins', category: 'financial' },
      { id: 'fin2', name: 'Pricing Strategy Adjustment', description: 'Modify pricing model to increase revenue per customer', category: 'financial' },
      { id: 'fin3', name: 'Cash Flow Management', description: 'Improve cash reserves and working capital efficiency', category: 'financial' },
      { id: 'fin4', name: 'Investment Reallocation', description: 'Shift resources to highest-ROI activities and projects', category: 'financial' },
    ],
    market: [
      { id: 'mkt1', name: 'Market Expansion', description: 'Enter new geographic markets or customer segments', category: 'market' },
      { id: 'mkt2', name: 'Product Diversification', description: 'Develop new products to address adjacent market needs', category: 'market' },
      { id: 'mkt3', name: 'Customer Retention Focus', description: 'Increase loyalty and reduce churn of existing customers', category: 'market' },
      { id: 'mkt4', name: 'Competitive Positioning', description: 'Strengthen unique value proposition against competitors', category: 'market' },
    ],
    operational: [
      { id: 'ops1', name: 'Process Optimization', description: 'Streamline workflows to improve efficiency and quality', category: 'operational' },
      { id: 'ops2', name: 'Technology Adoption', description: 'Implement new technologies to enhance capabilities', category: 'operational' },
      { id: 'ops3', name: 'Supply Chain Improvement', description: 'Enhance supplier relationships and logistics', category: 'operational' },
      { id: 'ops4', name: 'Workforce Development', description: 'Invest in employee skills and organizational capabilities', category: 'operational' },
    ],
    innovation: [
      { id: 'inn1', name: 'R&D Investment', description: 'Allocate resources to develop innovative solutions', category: 'innovation' },
      { id: 'inn2', name: 'Agile Methodology Adoption', description: 'Implement flexible, iterative development processes', category: 'innovation' },
      { id: 'inn3', name: 'Open Innovation', description: 'Collaborate with external partners on new initiatives', category: 'innovation' },
      { id: 'inn4', name: 'Digital Transformation', description: 'Leverage digital technologies to transform the business model', category: 'innovation' },
    ],
    risk: [
      { id: 'risk1', name: 'Risk Diversification', description: 'Spread exposure across multiple markets or products', category: 'risk' },
      { id: 'risk2', name: 'Compliance Enhancement', description: 'Strengthen adherence to regulations and standards', category: 'risk' },
      { id: 'risk3', name: 'Business Continuity Planning', description: 'Develop robust plans for potential disruptions', category: 'risk' },
      { id: 'risk4', name: 'Strategic Partnerships', description: 'Form alliances to mitigate risks and share resources', category: 'risk' },
    ],
  };

  // Fix the toggleStrategy function to use proper type
  const toggleStrategy = (strategyId: string) => {
    if (selectedStrategies.includes(strategyId)) {
      setSelectedStrategies(selectedStrategies.filter(id => id !== strategyId));
    } else {
      if (selectedStrategies.length >= maxStrategies) {
        setFeedbackMessage(`You can select a maximum of ${maxStrategies} strategies.`);
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 3000);
        return;
      }
      setSelectedStrategies([...selectedStrategies, strategyId]);
      
      // Show feedback on selection
      const strategy = Object.values(strategies)
        .flat()
        .find(s => s.id === strategyId);
      
      if (strategy) {
        setFeedbackMessage(`"${strategy.name}" added to your strategy mix.`);
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 2000);
      }
    }
  };
  
  // Handle continue to next step with AI processing simulation
  const handleContinue = () => {
    if (selectedStrategies.length === 0) {
      setFeedbackMessage('Please select at least one strategy to continue.');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
      return;
    }
    
    setIsGeneratingStrategies(true);
    setProcessingProgress(0);
    
    // Simulate AI processing with progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + 0.1;
        if (newProgress >= 0.95) {
          clearInterval(interval);
          return 0.95;
        }
        return newProgress;
      });
    }, 400);
    
    // Complete processing after ~4 seconds
    setTimeout(() => {
      clearInterval(interval);
      setProcessingProgress(1);
      
      // Save selected strategies to state
      updateState({ selectedStrategies });
      
      // Show completion message before proceeding
      setTimeout(() => {
        setIsGeneratingStrategies(false);
        onNext();
      }, 1000);
    }, 4000);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* AI Processing Overlay */}
      <AIProcessingOverlay 
        isVisible={isGeneratingStrategies}
        progress={processingProgress}
      />
      
      {/* Feedback Toast */}
      <ActionFeedback
        message={feedbackMessage}
        isVisible={showFeedback}
      />
      
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Strategy Development</h2>
        <p className="text-gray-600">
          Select up to {maxStrategies} strategies that align with your business goals and market analysis.
          These will be used to generate your comprehensive strategy recommendation.
        </p>
        
        {/* Selected strategies count */}
        <div className="mt-4 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="font-medium text-blue-800">Selected Strategies: </span>
            <span className="text-blue-700">{selectedStrategies.length}/{maxStrategies}</span>
          </div>
          {selectedStrategies.length > 0 && (
            <button
              className="px-5 py-2 bg-[#0097A7] text-white rounded-lg text-sm font-medium hover:bg-[#00838F] transition-all shadow-md hover:shadow-lg flex items-center"
              onClick={handleContinue}
            >
              Continue to Assessment <ArrowRight size={16} className="ml-2" />
            </button>
          )}
        </div>
      </div>
      
      {/* Strategy category tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {STRATEGY_CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-t-lg font-medium whitespace-nowrap
                ${activeCategory === category.id 
                  ? 'bg-[#0097A7] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.title} Strategies
            </button>
          ))}
        </div>
      </div>
      
      {/* Strategy cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {strategies[activeCategory].map(strategy => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            isSelected={selectedStrategies.includes(strategy.id)}
            onClick={() => toggleStrategy(strategy.id)}
            disabled={selectedStrategies.length >= maxStrategies && !selectedStrategies.includes(strategy.id)}
          />
        ))}
      </div>
      
      {/* Strategy tips */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-gray-800 mb-2 flex items-center">
          <Lightbulb size={18} className="mr-2 text-[#0097A7]" />
          Strategy Selection Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-[#0097A7] mr-2">•</span>
            <span>Balance short-term goals with long-term sustainability</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#0097A7] mr-2">•</span>
            <span>Consider selecting strategies from different categories for a more comprehensive approach</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#0097A7] mr-2">•</span>
            <span>Align your selections with the key insights from your financial and market analysis</span>
          </li>
        </ul>
      </div>
      
      {/* Continue button - more prominent and fixed at bottom */}
      {selectedStrategies.length > 0 && (
        <div className="sticky bottom-4 pt-4 flex justify-center">
          <button
            className="px-6 py-3 bg-[#0097A7] text-white rounded-lg font-medium hover:bg-[#00838F] transition-all shadow-md hover:shadow-lg flex items-center"
            onClick={handleContinue}
          >
            <Brain size={18} className="mr-2" />
            Generate Strategy Assessment <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StrategyDevelopment; 