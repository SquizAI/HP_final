import React, { useState } from 'react'
import { ChallengeState } from '../TrendSpotterMain'

interface TrendAnalysisProps {
  state: ChallengeState;
  updateState: (newState: Partial<ChallengeState>) => void;
  onComplete: () => void;
  onBack: () => void;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ 
  state, 
  updateState, 
  onComplete, 
  onBack 
}) => {
  const [isChatActive, setIsChatActive] = useState<boolean>(false)
  const [chatInput, setChatInput] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([
    { 
      role: 'ai', 
      content: `I'm your AI assistant for analyzing the trend "${state.selectedTrend}" in ${state.selectedIndustryName}. How do you think this trend could significantly change how companies operate?` 
    }
  ])
  
  // Handle justification input
  const handleJustificationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateState({ justification: e.target.value })
  }
  
  // Handle chat input
  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value)
  }
  
  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    
    // Add user message
    const newUserMessage = { role: 'user' as const, content: chatInput }
    const updatedMessages = [...chatMessages, newUserMessage]
    setChatMessages(updatedMessages)
    setChatInput('')
    
    // Simulate AI response based on the question
    setTimeout(() => {
      let aiResponse = `That's an interesting perspective on "${state.selectedTrend}" in the ${state.selectedIndustryName} industry.`
      
      if (chatInput.toLowerCase().includes('example')) {
        aiResponse = `A great example of how "${state.selectedTrend}" is changing business operations is through increased efficiency, improved customer experiences, and new business models. Companies that adopt this trend can gain competitive advantages through innovation and operational excellence.`
      } else if (chatInput.toLowerCase().includes('challenge')) {
        aiResponse = `The main challenges businesses face when implementing "${state.selectedTrend}" include technical complexity, organizational resistance, and integration with existing systems. However, with proper planning and incremental adoption, these challenges can be overcome.`
      } else if (chatInput.toLowerCase().includes('future')) {
        aiResponse = `In the future, "${state.selectedTrend}" will likely evolve to become more sophisticated, accessible, and integrated into core business processes. Companies that invest early will have a significant advantage in their market position.`
      }
      
      const newAiMessage = { role: 'ai' as const, content: aiResponse }
      setChatMessages([...updatedMessages, newAiMessage])
    }, 1000)
  }
  
  // Submit form and complete challenge
  const handleSubmit = () => {
    if (state.justification.trim().length > 20) {
      onComplete()
    }
  }
  
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-[#0097A7]">
          Step 4: Your Strategic Analysis
        </h2>
        <p className="text-gray-700 mt-2">
          Explain why you think your selected trend could significantly change how companies operate.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-[#B2EBF2]">
            <h3 className="text-[#5CB2CC] font-medium mb-2">Selected Trend:</h3>
            <p className="text-gray-800 italic">{state.selectedTrend}</p>
          </div>
          
          <div className="space-y-3">
            <label className="block font-medium text-gray-800">
              Your Analysis
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-4 h-64 focus:ring-2 focus:ring-[#5CB2CC] focus:border-transparent transition"
              placeholder="Explain why this trend could significantly change how companies operate. Consider its potential impact on business models, operations, customer experiences, and competitive advantages..."
              value={state.justification}
              onChange={handleJustificationChange}
            ></textarea>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{state.justification.length} characters</span>
              <span>{state.justification.length < 20 ? 'Please write at least 20 characters' : 'Looking good!'}</span>
            </div>
          </div>
        </div>
        
        <div className={`bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 flex flex-col ${isChatActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
          <div className="bg-[#5CB2CC] text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="font-medium">AI Assistant</div>
            <button 
              className="text-white bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-sm"
              onClick={() => setIsChatActive(!isChatActive)}
            >
              {isChatActive ? '−' : '+'}
            </button>
          </div>
          
          {isChatActive && (
            <>
              <div className="flex-1 p-4 overflow-y-auto max-h-64 space-y-4">
                {chatMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3/4 rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-[#E0F7FA] text-gray-800 ml-12' 
                          : 'bg-white border border-gray-200 text-gray-800 mr-12'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t border-gray-200">
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB2CC]"
                    placeholder="Ask about this trend's impact..."
                    value={chatInput}
                    onChange={handleChatInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    className="bg-[#5CB2CC] text-white px-4 py-2 rounded-r-md hover:bg-[#4A90E2] transition-colors"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Try asking: "Can you give me an example?" or "What challenges might businesses face?"
                </div>
              </div>
            </>
          )}
          
          {!isChatActive && (
            <div className="p-4 text-center text-gray-500">
              Click the + button to get AI assistance with your analysis
            </div>
          )}
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
          disabled={state.justification.trim().length < 20}
          onClick={handleSubmit}
        >
          Complete Challenge
        </button>
      </div>
    </div>
  )
}

export default TrendAnalysis 