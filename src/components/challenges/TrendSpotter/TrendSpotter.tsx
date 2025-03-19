import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTrendsForIndustry, getBusinessOpportunities } from '../../../services/openai'

// Define the industry options
const industries = [
  { id: 'ai-education', name: 'AI in Education', icon: '🎓' },
  { id: 'remote-work', name: 'Remote Work Technology', icon: '💻' },
  { id: 'retail', name: 'Future of Retail', icon: '🛍️' },
  { id: 'healthcare', name: 'Healthcare Innovation', icon: '🏥' },
  { id: 'finance', name: 'Financial Technology', icon: '💰' },
  { id: 'sustainability', name: 'Sustainable Business', icon: '🌱' }
]

// Type for the trend data state
interface TrendsState {
  [key: string]: string[];
}

// Type for the business opportunities state
interface OpportunitiesState {
  [key: string]: string[];
}

const TrendSpotterChallenge: React.FC = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [selectedTrend, setSelectedTrend] = useState<string>('')
  const [justification, setJustification] = useState<string>('')
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  
  // State for API data
  const [trendsData, setTrendsData] = useState<TrendsState>({})
  const [opportunitiesData, setOpportunitiesData] = useState<OpportunitiesState>({})
  const [isLoadingTrends, setIsLoadingTrends] = useState<boolean>(false)
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState<boolean>(false)
  
  // Get the industry name for API calls
  const getIndustryName = (industryId: string): string => {
    return industries.find(i => i.id === industryId)?.name || '';
  }
  
  // Get trends for the selected industry
  const fetchTrends = async (industryId: string) => {
    const industryName = getIndustryName(industryId);
    if (!industryName) return;
    
    if (trendsData[industryName]) {
      // Data already cached, no need to fetch
      return;
    }
    
    setIsLoadingTrends(true);
    try {
      const trends = await getTrendsForIndustry(industryName);
      setTrendsData(prev => ({
        ...prev,
        [industryName]: trends
      }));
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setIsLoadingTrends(false);
    }
  };
  
  // Get business opportunities for the selected industry
  const fetchOpportunities = async (industryId: string) => {
    const industryName = getIndustryName(industryId);
    if (!industryName) return;
    
    if (opportunitiesData[industryName]) {
      // Data already cached, no need to fetch
      return;
    }
    
    setIsLoadingOpportunities(true);
    try {
      const opportunities = await getBusinessOpportunities(industryName);
      setOpportunitiesData(prev => ({
        ...prev,
        [industryName]: opportunities
      }));
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoadingOpportunities(false);
    }
  };
  
  // Get the current trends based on selected industry
  const getCurrentTrends = (): string[] => {
    const industryName = getIndustryName(selectedIndustry);
    return trendsData[industryName] || [];
  }
  
  // Get business opportunities based on selected industry
  const getBusinessOppData = (): string[] => {
    const industryName = getIndustryName(selectedIndustry);
    return opportunitiesData[industryName] || [];
  }
  
  // Handle industry selection
  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    fetchTrends(industryId);
  }
  
  // Handle trend selection
  const handleTrendSelect = (trend: string) => {
    setSelectedTrend(trend);
  }
  
  // Effect to fetch opportunities when moving to the opportunities step
  useEffect(() => {
    if (currentStep === 2 && selectedIndustry) {
      fetchOpportunities(selectedIndustry);
    }
  }, [currentStep, selectedIndustry]);
  
  // Move to next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  }
  
  // Submit the justification and complete the challenge
  const handleSubmitJustification = () => {
    if (justification.trim().length > 0) {
      setIsCompleted(true);
    }
  }
  
  // Render the industry selection step
  const renderIndustrySelection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-purple-800">
          Choose a Business Topic
        </h2>
        <p className="text-gray-600 mt-2">
          Select an industry or business area you'd like to explore for emerging trends
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {industries.map(industry => (
          <div 
            key={industry.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedIndustry === industry.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'
            }`}
            onClick={() => handleIndustrySelect(industry.id)}
          >
            <div className="text-3xl mb-2">{industry.icon}</div>
            <h3 className="font-medium">{industry.name}</h3>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button
          className="btn btn-primary"
          disabled={!selectedIndustry || isLoadingTrends}
          onClick={handleNextStep}
        >
          {isLoadingTrends ? 'Loading Trends...' : 'Next: Discover Trends'}
        </button>
      </div>
    </div>
  )
  
  // Render the trends exploration step
  const renderTrendsExploration = () => {
    const trends = getCurrentTrends();
    const industryName = getIndustryName(selectedIndustry);
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800">
            Emerging Trends
          </h2>
          <p className="text-gray-600 mt-2">
            AI has identified these emerging trends in {industryName}
          </p>
        </div>
        
        <div className="p-6 border border-blue-100 rounded-lg bg-blue-50">
          <h3 className="text-lg font-medium text-blue-800 mb-3">
            Your AI Query: "What are three emerging trends in {industryName}?"
          </h3>
          
          {isLoadingTrends ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse text-center">
                <div className="text-xl text-blue-600 mb-2">Asking GPT-4o...</div>
                <div className="text-sm text-gray-500">Retrieving the latest trends</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {trends.map((trend, index) => (
                <div 
                  key={index} 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTrend === trend ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => handleTrendSelect(trend)}
                >
                  <div className="flex items-start">
                    <div className="text-green-600 font-bold mr-2">{index + 1}.</div>
                    <p>{trend}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentStep(0)}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            disabled={isLoadingTrends || trends.length === 0}
            onClick={handleNextStep}
          >
            Next: Business Opportunities
          </button>
        </div>
      </div>
    )
  }
  
  // Render the business opportunities step
  const renderBusinessOpportunities = () => {
    const opportunities = getBusinessOppData();
    const industryName = getIndustryName(selectedIndustry);
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800">
            Business Opportunities
          </h2>
          <p className="text-gray-600 mt-2">
            Here's how businesses could capitalize on these trends
          </p>
        </div>
        
        <div className="p-6 border border-blue-100 rounded-lg bg-blue-50">
          <h3 className="text-lg font-medium text-blue-800 mb-3">
            Your AI Query: "How might businesses capitalize on these trends?"
          </h3>
          
          {isLoadingOpportunities ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse text-center">
                <div className="text-xl text-blue-600 mb-2">Asking GPT-4o...</div>
                <div className="text-sm text-gray-500">Analyzing business opportunities</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-start">
                    <div className="text-blue-600 font-bold mr-2">{index + 1}.</div>
                    <p>{opportunity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentStep(1)}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            disabled={isLoadingOpportunities || opportunities.length === 0}
            onClick={handleNextStep}
          >
            Next: Your Analysis
          </button>
        </div>
      </div>
    )
  }
  
  // Render the trend analysis step
  const renderTrendAnalysis = () => {
    const trends = getCurrentTrends();
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800">
            Your Strategic Analysis
          </h2>
          <p className="text-gray-600 mt-2">
            Identify one trend you think could significantly change how companies operate
          </p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-medium mb-3">Select a High-Impact Trend</h3>
          
          <div className="space-y-3 mb-6">
            {trends.map((trend, index) => (
              <div key={index} className="flex items-start">
                <input 
                  type="radio" 
                  id={`trend-${index}`} 
                  name="selectedTrend" 
                  className="mt-1 mr-2"
                  checked={selectedTrend === trend}
                  onChange={() => handleTrendSelect(trend)}
                />
                <label htmlFor={`trend-${index}`} className="cursor-pointer">
                  {trend}
                </label>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Why is this trend significant?</h3>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 h-32"
              placeholder="Explain why this trend could significantly change how companies operate..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentStep(2)}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            disabled={!selectedTrend || justification.trim().length === 0}
            onClick={handleSubmitJustification}
          >
            Complete Challenge
          </button>
        </div>
      </div>
    )
  }
  
  // Render the completion screen
  const renderCompletion = () => (
    <div className="space-y-8 text-center">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-800">
          Challenge Complete!
        </h2>
        <p className="text-gray-600 mt-2">
          You've successfully completed the AI Trend Spotter challenge!
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Trend Analysis</h3>
        
        <div className="mb-4 p-4 border-l-4 border-purple-400 bg-purple-50 text-left">
          <p className="italic text-purple-700">{selectedTrend}</p>
        </div>
        
        <div className="text-left">
          <h4 className="font-medium mb-2">Your Justification:</h4>
          <p className="bg-gray-50 p-3 rounded">{justification}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What you've learned:</h3>
        <ul className="space-y-2 max-w-md mx-auto text-left">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>How to use AI to identify emerging trends in various industries</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Analyzing trends for strategic business opportunities</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Evaluating the potential impact of trends on business operations</span>
          </li>
        </ul>
      </div>
      
      <div className="flex justify-center space-x-4 pt-4">
        <Link to="/" className="btn btn-primary">
          Return to Hub
        </Link>
      </div>
    </div>
  )
  
  // Render step progress indicator
  const renderStepIndicator = () => {
    if (isCompleted) return null;
    
    const steps = [
      "Select Industry",
      "Explore Trends",
      "Business Opportunities",
      "Your Analysis"
    ];
    
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`text-xs font-medium ${
                index === currentStep ? 'text-purple-600' : 
                index < currentStep ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill bg-purple-600" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Main render function
  return (
    <div className="max-w-4xl mx-auto">
      <div className="challenge-header mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Trend Spotter</h1>
          <p className="text-gray-600">Identify emerging trends and business opportunities using AI</p>
        </div>
        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          Uses GPT-4o
        </div>
      </div>
      
      {!isCompleted && renderStepIndicator()}
      
      {isCompleted ? renderCompletion() : (
        <>
          {currentStep === 0 && renderIndustrySelection()}
          {currentStep === 1 && renderTrendsExploration()}
          {currentStep === 2 && renderBusinessOpportunities()}
          {currentStep === 3 && renderTrendAnalysis()}
        </>
      )}
    </div>
  )
}

export default TrendSpotterChallenge 