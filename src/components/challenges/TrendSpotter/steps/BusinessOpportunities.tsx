import React, { useEffect, useState } from 'react'
import { ChallengeState } from '../TrendSpotterMain'
import { getBusinessOpportunities, ApiResponse } from '../../../../services/openai'
import { staticTrendData } from '../../../../data/staticTrendData'

interface BusinessOpportunitiesProps {
  state: ChallengeState;
  updateState: (newState: Partial<ChallengeState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const BusinessOpportunities: React.FC<BusinessOpportunitiesProps> = ({ 
  state, 
  updateState, 
  onNext, 
  onBack 
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  // Fetch business opportunities when component mounts
  useEffect(() => {
    const fetchOpportunities = async () => {
      // Check if we already have the data
      if (state.opportunitiesData[state.selectedIndustryName]) return;
      
      // Check if we have preloaded data
      const isPreloadedIndustry = Object.keys(staticTrendData.opportunities).includes(state.selectedIndustryName)
      
      if (isPreloadedIndustry) {
        const preloadedOpportunities: ApiResponse = {
          data: staticTrendData.opportunities[state.selectedIndustryName],
          source: 'static'
        }
        
        updateState({
          opportunitiesData: {
            ...state.opportunitiesData,
            [state.selectedIndustryName]: preloadedOpportunities
          }
        })
        return
      }
      
      // Only fetch from API for custom industries
      setIsLoading(true)
      try {
        const response = await getBusinessOpportunities(state.selectedIndustryName)
        updateState({
          opportunitiesData: {
            ...state.opportunitiesData,
            [state.selectedIndustryName]: response
          }
        })
      } catch (error) {
        console.error('Error fetching opportunities:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOpportunities()
  }, [state.selectedIndustryName, state.opportunitiesData, updateState])
  
  // Get current opportunities
  const opportunitiesResponse = state.opportunitiesData[state.selectedIndustryName] || { data: [], source: 'static' }
  const opportunities = opportunitiesResponse.data
  const isApiData = opportunitiesResponse.source === 'api'
  const references = opportunitiesResponse.references || []
  
  // Get static company examples if available
  const companyExamples = staticTrendData.companyExamples[state.selectedIndustryName] || []
  
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-[#FFECB3] to-[#FFE0B2] p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-[#FF7F50]">
          Step 3: Business Opportunities in {state.selectedIndustryName}
        </h2>
        <p className="text-gray-700 mt-2">
          Discover how businesses could capitalize on the emerging trends in this industry.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#5CB2CC] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#5CB2CC] font-medium">Analyzing business opportunities...</p>
          <p className="text-sm text-gray-600 mt-2">Using AI to explore potential business strategies</p>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          <div className="bg-white p-4 rounded-lg border border-[#FFE0B2] mb-4">
            <h3 className="text-[#FF7F50] font-medium mb-2">Selected Trend:</h3>
            <p className="text-gray-800 italic">{state.selectedTrend}</p>
          </div>
          
          <div className="bg-[#5CB2CC] bg-opacity-5 p-4 rounded-lg mb-6">
            <div className="flex items-center mb-4">
              <div className="text-[#0097A7] bg-[#E0F7FA] p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#0097A7]">How Businesses Can Capitalize</h3>
            </div>
            <p className="text-gray-700 mb-2">
              Based on the selected trend, here are key business opportunities that organizations could pursue:
            </p>
          </div>
          
          <div className="space-y-6">
            {opportunities.map((opportunity, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className="bg-[#FF7F50] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">
                      {opportunity}
                    </p>
                    
                    {/* References section for API-generated data */}
                    {isApiData && references[index] && (
                      <div className="mt-3 text-xs italic text-gray-500 pl-3 border-l-2 border-gray-200">
                        <p><strong>References:</strong> {references[index]}</p>
                      </div>
                    )}
                    
                    {/* Company examples for all opportunities */}
                    {companyExamples.length > 0 && (
                      <div className="mt-3 text-xs text-gray-600 pl-3 border-l-2 border-gray-200">
                        <p><strong>Example:</strong> {companyExamples[index % companyExamples.length]}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-block bg-[#E0F7FA] text-[#0097A7] text-xs px-2 py-1 rounded-full">
                        Business Strategy
                      </span>
                      <span className="inline-block bg-[#E0F7FA] text-[#0097A7] text-xs px-2 py-1 rounded-full">
                        Market Opportunity
                      </span>
                      <span className="inline-block bg-[#E0F7FA] text-[#0097A7] text-xs px-2 py-1 rounded-full">
                        Innovation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Source indicator */}
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: isApiData ? '#FF7F50' : '#5CB2CC' }}></span>
              <span>
                {isApiData ? 
                  'This data was dynamically generated by GPT-4o based on your custom request.' : 
                  'This data is from our curated knowledge base of validated business opportunities.'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <button
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="px-6 py-2 bg-[#5CB2CC] text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4A90E2] transition-colors"
          disabled={isLoading || opportunities.length === 0}
          onClick={onNext}
        >
          Next: Your Analysis
        </button>
      </div>
    </div>
  )
}

export default BusinessOpportunities 