import React, { useState } from 'react'
import { ChallengeState } from '../TrendSpotterMain'
import { staticTrendData } from '../../../../data/staticTrendData'

interface TrendsExplorationProps {
  state: ChallengeState;
  updateState: (newState: Partial<ChallengeState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TrendsExploration: React.FC<TrendsExplorationProps> = ({ 
  state, 
  updateState, 
  onNext, 
  onBack 
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  
  // Get current trends
  const trendsResponse = state.trendsData[state.selectedIndustryName] || { data: [], source: 'static' }
  const trends = trendsResponse.data
  const isApiData = trendsResponse.source === 'api'
  const references = trendsResponse.references || []
  
  // Get static references if available
  const staticReferences = staticTrendData.references[state.selectedIndustryName] || []
  const companyExamples = staticTrendData.companyExamples[state.selectedIndustryName] || []
  
  // Handle trend selection
  const handleTrendSelect = (trend: string) => {
    updateState({ selectedTrend: trend })
  }
  
  // Handle trend card interaction
  const handleCardClick = (index: number, trend: string) => {
    setActiveIndex(index)
    handleTrendSelect(trend)
  }
  
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-[#0097A7]">
          Step 2: Emerging Trends in {state.selectedIndustryName}
        </h2>
        <p className="text-gray-700 mt-2">
          {isApiData ? 'AI has identified' : 'We have analyzed'} these emerging trends for you. 
          Explore each one and select the most interesting to you.
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold text-[#5CB2CC]">Key Trends</div>
          <div className="text-sm px-3 py-1 bg-[#E0F7FA] text-[#0097A7] rounded-full">
            Select one to learn more
          </div>
        </div>
        
        <div className="space-y-6">
          {trends.map((trend, index) => (
            <div 
              key={index}
              className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                activeIndex === index 
                  ? 'border-[#5CB2CC] border-2 shadow-lg bg-white' 
                  : 'border border-gray-200 hover:border-[#5CB2CC] bg-white'
              }`}
              onClick={() => handleCardClick(index, trend)}
            >
              <div className="flex items-start">
                <div 
                  className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 transition-colors ${
                    activeIndex === index ? 'bg-[#5CB2CC] text-white' : 'bg-[#E0F7FA] text-[#0097A7]'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-gray-800 ${activeIndex === index ? 'font-medium' : ''}`}>
                    {trend}
                  </p>
                  
                  {activeIndex === index && (
                    <div className="mt-4 space-y-4 animate-fadeIn">
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-[#FF7F50] mb-2">
                          Why this trend matters:
                        </h4>
                        <p className="text-sm text-gray-600">
                          This trend represents a significant shift in how businesses operate and 
                          could provide substantial opportunities for innovation and growth.
                        </p>
                      </div>
                      
                      {/* References section */}
                      <div>
                        <h4 className="text-sm font-medium text-[#FF7F50] mb-2">
                          References & Examples:
                        </h4>
                        <div className="pl-3 border-l-2 border-gray-200">
                          <ul className="text-sm text-gray-600 space-y-1">
                            {/* Show API references if API data */}
                            {isApiData && references[index] && (
                              <li className="text-xs italic">
                                {references[index]}
                              </li>
                            )}
                            
                            {/* Show static references if not API data or as additional info */}
                            {staticReferences.length > 0 && (
                              <li className="text-xs italic">
                                {staticReferences[index % staticReferences.length]}
                              </li>
                            )}
                            
                            {/* Show company examples */}
                            {companyExamples.length > 0 && (
                              <li className="mt-2 text-xs">
                                <strong>Company Example:</strong> {companyExamples[index % companyExamples.length]}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-[#FF7F50] mb-2">
                          Key indicators:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                          <li>Growing adoption across multiple sectors</li>
                          <li>Significant investment in related technologies</li>
                          <li>Changing consumer/business expectations</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Source indicator */}
      <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: isApiData ? '#FF7F50' : '#5CB2CC' }}></span>
          <span>
            {isApiData ? 
              'This data was dynamically generated by GPT-4o based on your custom request.' : 
              'This data is from our curated knowledge base of validated industry trends.'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="px-6 py-2 bg-[#5CB2CC] text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4A90E2] transition-colors"
          disabled={!state.selectedTrend}
          onClick={onNext}
        >
          Next: Business Opportunities
        </button>
      </div>
    </div>
  )
}

export default TrendsExploration 