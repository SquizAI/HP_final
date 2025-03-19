import React from 'react'
import { Link } from 'react-router-dom'
import { ChallengeState } from '../TrendSpotterMain'
import { staticTrendData } from '../../../../data/staticTrendData'

interface CompletionScreenProps {
  state: ChallengeState;
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ state, onRestart }) => {
  // Get references and source type
  const trendsResponse = state.trendsData[state.selectedIndustryName] || { data: [], source: 'static' }
  const isApiData = trendsResponse.source === 'api'
  
  // Get static references if available
  const staticReferences = staticTrendData.references[state.selectedIndustryName] || []
  const companyExamples = staticTrendData.companyExamples[state.selectedIndustryName] || []
  
  // Find index of selected trend
  const selectedTrendIndex = trendsResponse.data.findIndex(trend => trend === state.selectedTrend)
  const relevantReference = selectedTrendIndex !== -1 && trendsResponse.references ? 
    trendsResponse.references[selectedTrendIndex] : 
    null
  
  // Get a relevant company example
  const relevantCompanyExample = companyExamples.length > 0 && selectedTrendIndex !== -1 ? 
    companyExamples[selectedTrendIndex % companyExamples.length] : 
    null
  
  return (
    <div className="p-6 space-y-8">
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] p-8 rounded-lg text-center">
        <div className="inline-block bg-white rounded-full p-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-[#5CB2CC] fill-current">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#0097A7] mb-2">
          Challenge Complete!
        </h2>
        <p className="text-gray-700">
          You've successfully completed the AI Trend Spotter challenge.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg text-[#FF7F50] font-bold mb-4 border-b pb-2">Your Analysis Summary</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Industry</h4>
            <p className="text-lg font-medium">{state.selectedIndustryName}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Selected Trend</h4>
            <p className="text-lg border-l-4 border-[#5CB2CC] pl-3 py-2 bg-gray-50">{state.selectedTrend}</p>
            
            {/* Show references if available */}
            {(relevantReference || (staticReferences.length > 0 && selectedTrendIndex !== -1)) && (
              <div className="mt-2 text-xs text-gray-500">
                <p className="font-medium">References:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  {relevantReference && (
                    <li>{relevantReference}</li>
                  )}
                  {!relevantReference && staticReferences.length > 0 && selectedTrendIndex !== -1 && (
                    <li>{staticReferences[selectedTrendIndex % staticReferences.length]}</li>
                  )}
                </ul>
              </div>
            )}
            
            {/* Show company example if available */}
            {relevantCompanyExample && (
              <div className="mt-2 text-xs text-gray-500">
                <p className="font-medium">Company Example:</p>
                <p className="pl-5 mt-1">{relevantCompanyExample}</p>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Your Justification</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800">{state.justification}</p>
            </div>
          </div>
          
          {/* Data source indicator */}
          <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center text-xs text-gray-600">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: isApiData ? '#FF7F50' : '#5CB2CC' }}></span>
              <span>
                {isApiData ? 
                  'This analysis used AI-generated data from GPT-4o based on your custom request.' : 
                  'This analysis used curated data from our verified industry trends database.'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg text-[#5CB2CC] font-bold mb-4 border-b pb-2">What You've Learned</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-[#E0F7FA] text-[#0097A7] rounded-full p-1 mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Trend Identification</p>
              <p className="text-sm text-gray-600">You learned how to use AI to identify emerging trends in various industries</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-[#E0F7FA] text-[#0097A7] rounded-full p-1 mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Business Opportunity Analysis</p>
              <p className="text-sm text-gray-600">You explored how businesses can capitalize on emerging trends to create value</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-[#E0F7FA] text-[#0097A7] rounded-full p-1 mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Strategic Impact Assessment</p>
              <p className="text-sm text-gray-600">You developed critical thinking skills to evaluate how trends change business operations</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-[#E0F7FA] text-[#0097A7] rounded-full p-1 mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Evidence-Based Analysis</p>
              <p className="text-sm text-gray-600">You learned to support your analysis with references and real-world examples</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onRestart}
        >
          Try Again
        </button>
        <Link 
          to="/" 
          className="px-6 py-2 bg-[#5CB2CC] text-white rounded-md font-medium hover:bg-[#4A90E2] transition-colors"
        >
          Back to Challenges
        </Link>
      </div>
    </div>
  )
}

export default CompletionScreen 