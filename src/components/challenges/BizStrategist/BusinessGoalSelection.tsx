import React, { useState } from 'react';
import { BizStrategyState } from './BizStrategistMain';

// Predefined business goal options
const BUSINESS_GOALS = [
  { 
    id: 'market-expansion', 
    name: 'Market Expansion', 
    description: 'Enter new markets or expand presence in existing ones',
    icon: '🌎',
    color: '#0097A7'
  },
  { 
    id: 'revenue-growth', 
    name: 'Revenue Growth', 
    description: 'Increase sales and overall revenue performance',
    icon: '📈',
    color: '#00796B'
  },
  { 
    id: 'customer-acquisition', 
    name: 'Customer Acquisition', 
    description: 'Attract and convert new customers to your business',
    icon: '🧲',
    color: '#E53935'
  },
  { 
    id: 'product-launch', 
    name: 'Product Launch', 
    description: 'Successfully introduce a new product to the market',
    icon: '🚀',
    color: '#7B1FA2'
  },
  { 
    id: 'digital-transformation', 
    name: 'Digital Transformation', 
    description: 'Leverage technology to reimagine business processes',
    icon: '💻',
    color: '#1E88E5'
  },
  { 
    id: 'cost-reduction', 
    name: 'Cost Reduction', 
    description: 'Optimize operations and reduce business expenses',
    icon: '💰',
    color: '#FBC02D'
  }
];

// Business types
const BUSINESS_TYPES = [
  { id: 'startup', name: 'Startup', icon: '🚀' },
  { id: 'small-business', name: 'Small Business', icon: '🏪' },
  { id: 'mid-market', name: 'Mid-sized Company', icon: '🏢' },
  { id: 'enterprise', name: 'Enterprise', icon: '🏙️' },
  { id: 'nonprofit', name: 'Non-profit', icon: '🤲' }
];

// Industry options
const INDUSTRIES = [
  { id: 'tech', name: 'Technology', icon: '📱' },
  { id: 'retail', name: 'Retail & E-commerce', icon: '🛍️' },
  { id: 'finance', name: 'Finance & Banking', icon: '💳' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
  { id: 'hospitality', name: 'Hospitality & Tourism', icon: '🏨' },
  { id: 'entertainment', name: 'Entertainment & Media', icon: '🎬' }
];

interface BusinessGoalSelectionProps {
  state: BizStrategyState;
  updateState: (newState: Partial<BizStrategyState>) => void;
  onNext: () => void;
}

const BusinessGoalSelection: React.FC<BusinessGoalSelectionProps> = ({ state, updateState, onNext }) => {
  const [selectedGoal, setSelectedGoal] = useState<string>(state.businessGoal || '');
  const [customGoal, setCustomGoal] = useState<string>('');
  const [showCustomGoal, setShowCustomGoal] = useState<boolean>(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>(state.businessType || '');
  const [selectedIndustry, setSelectedIndustry] = useState<string>(state.industryContext || '');
  const [customIndustry, setCustomIndustry] = useState<string>('');
  const [showCustomIndustry, setShowCustomIndustry] = useState<boolean>(false);
  
  const handleGoalSelect = (goalId: string) => {
    if (goalId === 'custom') {
      setShowCustomGoal(true);
      setSelectedGoal('');
    } else {
      setSelectedGoal(goalId);
      setShowCustomGoal(false);
      
      // Find the name of the selected goal
      const goalName = BUSINESS_GOALS.find(goal => goal.id === goalId)?.name || '';
      updateState({ businessGoal: goalName });
    }
  };
  
  const handleCustomGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomGoal(e.target.value);
  };
  
  const handleCustomGoalSubmit = () => {
    if (customGoal.trim()) {
      updateState({ businessGoal: customGoal });
      setSelectedGoal('custom');
    }
  };
  
  const handleBusinessTypeSelect = (typeId: string) => {
    setSelectedBusinessType(typeId);
    
    // Find the name of the selected business type
    const typeName = BUSINESS_TYPES.find(type => type.id === typeId)?.name || '';
    updateState({ businessType: typeName });
  };
  
  const handleIndustrySelect = (industryId: string) => {
    if (industryId === 'custom') {
      setShowCustomIndustry(true);
      setSelectedIndustry('');
    } else {
      setSelectedIndustry(industryId);
      setShowCustomIndustry(false);
      
      // Find the name of the selected industry
      const industryName = INDUSTRIES.find(industry => industry.id === industryId)?.name || '';
      updateState({ industryContext: industryName });
    }
  };
  
  const handleCustomIndustryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomIndustry(e.target.value);
  };
  
  const handleCustomIndustrySubmit = () => {
    if (customIndustry.trim()) {
      updateState({ industryContext: customIndustry });
      setSelectedIndustry('custom');
    }
  };
  
  const handleContinue = () => {
    // Ensure all required fields are filled
    const businessGoal = selectedGoal === 'custom' ? customGoal : BUSINESS_GOALS.find(goal => goal.id === selectedGoal)?.name || '';
    const businessType = BUSINESS_TYPES.find(type => type.id === selectedBusinessType)?.name || '';
    const industryContext = selectedIndustry === 'custom' ? customIndustry : INDUSTRIES.find(industry => industry.id === selectedIndustry)?.name || '';
    
    if (businessGoal && businessType && industryContext) {
      updateState({
        businessGoal,
        businessType,
        industryContext
      });
      onNext();
    }
  };
  
  // Check if all required fields are filled
  const isFormComplete = () => {
    const hasGoal = selectedGoal && (selectedGoal !== 'custom' || customGoal.trim() !== '');
    const hasBusinessType = selectedBusinessType !== '';
    const hasIndustry = selectedIndustry && (selectedIndustry !== 'custom' || customIndustry.trim() !== '');
    
    return hasGoal && hasBusinessType && hasIndustry;
  };
  
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#E0F2F1] p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-[#0097A7]">
          Define Your Business Strategy Focus
        </h2>
        <p className="text-gray-700 mt-2">
          To develop an effective AI-driven business strategy, we'll start by understanding your business context.
          Select your primary business goal, the type of business, and the industry you're operating in.
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Business Goal Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What's your primary business goal?</h3>
          <p className="text-gray-600 mb-4">
            Choose the main objective you want your business strategy to accomplish. This will help AI generate 
            the most relevant recommendations for your specific needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {BUSINESS_GOALS.map(goal => (
              <div
                key={goal.id}
                className={`p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                  selectedGoal === goal.id
                    ? `bg-${goal.color} text-white shadow-md`
                    : 'bg-white border border-gray-200 hover:border-[#0097A7] shadow-sm'
                }`}
                onClick={() => handleGoalSelect(goal.id)}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{goal.icon}</div>
                  <div>
                    <div className={`font-medium ${selectedGoal === goal.id ? 'text-white' : 'text-gray-800'}`}>
                      {goal.name}
                    </div>
                    <div className={`text-sm ${selectedGoal === goal.id ? 'text-white opacity-90' : 'text-gray-600'}`}>
                      {goal.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Custom Goal Option */}
            <div
              className={`p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                showCustomGoal
                  ? 'bg-[#0097A7] text-white shadow-md'
                  : 'bg-white border border-dashed border-gray-300 hover:border-[#0097A7] shadow-sm'
              }`}
              onClick={() => handleGoalSelect('custom')}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">✏️</div>
                <div>
                  <div className={`font-medium ${showCustomGoal ? 'text-white' : 'text-gray-800'}`}>
                    Custom Goal
                  </div>
                  <div className={`text-sm ${showCustomGoal ? 'text-white opacity-90' : 'text-gray-600'}`}>
                    Define your own specific business objective
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Custom Goal Input */}
          {showCustomGoal && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your specific business goal?
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
                  value={customGoal}
                  onChange={handleCustomGoalChange}
                  placeholder="e.g., Reduce customer acquisition cost by 20%"
                />
                <button
                  className="bg-[#0097A7] text-white px-4 py-2 rounded-r-md hover:bg-[#00838F] transition-colors"
                  onClick={handleCustomGoalSubmit}
                >
                  Set Goal
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Be specific about what you want to achieve to get the best strategy recommendations.
              </p>
            </div>
          )}
        </div>
        
        {/* Business Type Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What type of business are you strategizing for?</h3>
          <p className="text-gray-600 mb-4">
            Different types of businesses face unique challenges and opportunities. 
            AI will tailor its strategic recommendations based on your business type.
          </p>
          <div className="flex flex-wrap gap-3 mb-2">
            {BUSINESS_TYPES.map(type => (
              <button
                key={type.id}
                className={`px-4 py-2 rounded-full flex items-center transition-colors ${
                  selectedBusinessType === type.id
                    ? 'bg-[#0097A7] text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleBusinessTypeSelect(type.id)}
              >
                <span className="mr-2">{type.icon}</span>
                {type.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Industry Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Which industry are you operating in?</h3>
          <p className="text-gray-600 mb-4">
            Industry context is crucial for effective strategy development. The AI will incorporate 
            industry-specific trends, challenges, and opportunities into your strategy recommendations.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
            {INDUSTRIES.map(industry => (
              <button
                key={industry.id}
                className={`p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
                  selectedIndustry === industry.id
                    ? 'bg-[#0097A7] text-white'
                    : 'bg-white border border-gray-200 text-gray-800 hover:border-[#0097A7]'
                }`}
                onClick={() => handleIndustrySelect(industry.id)}
              >
                <span className="text-2xl mb-1">{industry.icon}</span>
                <span className="text-sm">{industry.name}</span>
              </button>
            ))}
            
            {/* Custom Industry Option */}
            <button
              className={`p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
                showCustomIndustry
                  ? 'bg-[#0097A7] text-white'
                  : 'bg-white border border-dashed border-gray-300 text-gray-700 hover:border-[#0097A7]'
              }`}
              onClick={() => handleIndustrySelect('custom')}
            >
              <span className="text-2xl mb-1">✏️</span>
              <span className="text-sm">Other</span>
            </button>
          </div>
          
          {/* Custom Industry Input */}
          {showCustomIndustry && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your specific industry?
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
                  value={customIndustry}
                  onChange={handleCustomIndustryChange}
                  placeholder="e.g., Renewable Energy"
                />
                <button
                  className="bg-[#0097A7] text-white px-4 py-2 rounded-r-md hover:bg-[#00838F] transition-colors"
                  onClick={handleCustomIndustrySubmit}
                >
                  Set Industry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom section with explanation and continue button */}
      <div className="mt-10">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <div className="text-blue-500 text-xl mr-3">💡</div>
            <div>
              <h4 className="font-medium text-blue-700 mb-1">What Happens Next</h4>
              <p className="text-blue-800 text-sm">
                After defining your business context, you'll explore AI-generated market analysis relevant to your industry 
                and business goals. Then you'll select strategic elements to achieve your objectives, and finally receive 
                an AI assessment of your strategy's strengths, weaknesses, risks, and opportunities.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            className="px-6 py-2 bg-[#0097A7] text-white rounded-md font-medium hover:bg-[#00838F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleContinue}
            disabled={!isFormComplete()}
          >
            Continue to Market Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessGoalSelection; 