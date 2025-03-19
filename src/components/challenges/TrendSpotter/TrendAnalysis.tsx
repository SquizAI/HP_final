import React, { useState, useEffect, useRef } from 'react'
import { ChallengeState } from './TrendSpotterMain'
import { getApiKey } from '../../../services/openai'

interface TrendAnalysisProps {
  state: ChallengeState;
  updateState: (newState: Partial<ChallengeState>) => void;
  onComplete: () => void;
  onBack: () => void;
}

// Chat message interface
interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  isLoading?: boolean;
}

// Structured output for AI analysis
interface StructuredAnalysis {
  summary: string;
  businessImpact: string;
  challenges: string;
  opportunities: string;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ 
  state, 
  updateState, 
  onComplete, 
  onBack 
}) => {
  const [isChatActive, setIsChatActive] = useState<boolean>(true) // Open by default
  const [chatInput, setChatInput] = useState<string>('')
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false)
  const [structuredOutput, setStructuredOutput] = useState<StructuredAnalysis | null>(null)
  const [showHelpTip, setShowHelpTip] = useState<boolean>(true)
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // Initial welcome message based on the selected trend and industry
  const initialMessage = `Hey there, trend explorer! 👋 I see you've selected **"${state.selectedTrend}"** in the ${state.selectedIndustryName} space. Need help turning this into a killer analysis? Just ask me anything or try one of the quick buttons below!`
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: initialMessage }
  ])
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])
  
  // Handle justification input
  const handleJustificationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateState({ justification: e.target.value })
  }
  
  // Handle chat input
  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value)
  }
  
  // Apply AI suggestion to textarea
  const applyAiSuggestion = (text: string) => {
    updateState({ justification: text })
  }
  
  // Get AI response using API
  const getAiResponse = async (userMessage: string): Promise<string> => {
    try {
      // Get API key from openai service
      const apiKey = getApiKey();
      if (!apiKey) {
        return "Sorry, I can't access my thinking capabilities right now. The API key seems to be missing. But I'd love to hear your thoughts on this trend!"
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert AI analyst helping a user analyze the business trend "${state.selectedTrend}" in the ${state.selectedIndustryName} industry. 
              Be concise but insightful. Max 3 paragraphs. Sound enthusiastic and occasionally use emojis. 
              If the user asks questions about implementation, challenges, or future of this trend, provide specific examples 
              based on real companies. Share surprising insights when possible. Be conversational but precise.`
            },
            ...chatMessages.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })
      
      const data = await response.json()
      
      if (data.error) {
        console.error('API error:', data.error)
        return "I seem to be having trouble connecting to my knowledge base. Let me know what you think about this trend, and we can discuss your perspective!"
      }
      
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error getting AI response:', error)
      return "Oops! I hit a temporary glitch. While I reboot, I'm curious - what's your take on how this trend could affect businesses?"
    }
  }
  
  // Get structured analysis
  const getStructuredAnalysis = async (): Promise<StructuredAnalysis | null> => {
    try {
      const apiKey = getApiKey()
      if (!apiKey) return null
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Create a structured business analysis of the trend "${state.selectedTrend}" in the ${state.selectedIndustryName} industry.
              Return as a JSON object with the following structure:
              {
                "summary": "A concise 1-paragraph summary of the trend",
                "businessImpact": "How this trend will impact business operations and models",
                "challenges": "Key challenges businesses might face when implementing this trend",
                "opportunities": "Business opportunities that this trend creates"
              }
              Make it insightful, forward-looking, and specific.`
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
          response_format: { type: "json_object" }
        })
      })
      
      const data = await response.json()
      
      if (data.error) {
        console.error('API error in structured analysis:', data.error)
        return null
      }
      
      try {
        const jsonContent = JSON.parse(data.choices[0].message.content)
        return jsonContent as StructuredAnalysis
      } catch (e) {
        console.error('Error parsing JSON:', e)
        return null
      }
    } catch (error) {
      console.error('Error getting structured analysis:', error)
      return null
    }
  }
  
  // Handle generating a structured analysis
  const handleGenerateAnalysis = async () => {
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: "Can you generate a structured analysis for this trend?" },
      { role: 'ai', content: '', isLoading: true }
    ])
    
    setIsAiTyping(true)
    const analysis = await getStructuredAnalysis()
    setIsAiTyping(false)
    
    if (analysis) {
      setStructuredOutput(analysis)
      const responseMessage = "I've created a structured analysis for you! You can see it in the panel above and use the 'Apply to Analysis' button to add it to your submission. Feel free to modify it to make it your own!"
      
      setChatMessages(prev => [
        ...prev.filter(msg => !msg.isLoading),
        { role: 'ai', content: responseMessage }
      ])
    } else {
      setChatMessages(prev => [
        ...prev.filter(msg => !msg.isLoading),
        { role: 'ai', content: "I wasn't able to generate a structured analysis right now. Would you like to try asking me specific questions about this trend instead?" }
      ])
    }
  }
  
  // Simulate typing delay for more natural chat
  const simulateTyping = (text: string): Promise<string> => {
    setIsAiTyping(true)
    return new Promise(resolve => {
      // Calculate a natural delay based on message length
      const delay = Math.min(1000, Math.max(500, text.length * 10))
      setTimeout(() => {
        setIsAiTyping(false)
        resolve(text)
      }, delay)
    })
  }
  
  // Handle sending a chat message
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiTyping) return
    
    // Add user message
    const newUserMessage: ChatMessage = { role: 'user', content: chatInput }
    setChatMessages(prev => [...prev, newUserMessage])
    setChatInput('')
    
    // Add AI typing indicator
    setChatMessages(prev => [...prev, { role: 'ai', content: '', isLoading: true }])
    
    // Get AI response
    const aiResponseText = await getAiResponse(chatInput)
    const typedResponse = await simulateTyping(aiResponseText)
    
    // Replace typing indicator with actual response
    setChatMessages(prev => [
      ...prev.filter(msg => !msg.isLoading),
      { role: 'ai', content: typedResponse }
    ])
  }
  
  // Submit form and complete challenge
  const handleSubmit = () => {
    if (state.justification.trim().length > 20) {
      onComplete()
    }
  }
  
  // Apply structured analysis to textarea
  const applyStructuredAnalysis = () => {
    if (!structuredOutput) return
    
    const formattedText = `
# Analysis of "${state.selectedTrend}" in ${state.selectedIndustryName}

## Summary
${structuredOutput.summary}

## Business Impact
${structuredOutput.businessImpact}

## Challenges
${structuredOutput.challenges}

## Opportunities
${structuredOutput.opportunities}

My personal takeaway: This trend is particularly significant because it represents a fundamental shift in how businesses operate and engage with customers. The organizations that adapt quickly will likely emerge as industry leaders.
`.trim()
    
    updateState({ justification: formattedText })
    setShowHelpTip(false)
  }
  
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-[#0097A7]">
          Your Strategic Analysis
        </h2>
        <p className="text-gray-700 mt-2">
          Explain why you think your selected trend could significantly change how companies operate.
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-[#B2EBF2] mb-4">
        <h3 className="text-[#5CB2CC] font-medium mb-2">Selected Trend:</h3>
        <p className="text-gray-800 italic">{state.selectedTrend}</p>
      </div>
      
      {structuredOutput && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5 border border-blue-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#0097A7] flex items-center">
              <span className="mr-2">✨</span> AI-Generated Analysis
            </h3>
            <button 
              onClick={applyStructuredAnalysis}
              className="px-4 py-2 bg-[#5CB2CC] text-white rounded-md text-sm font-medium hover:bg-[#4A90E2] transition-all flex items-center"
            >
              <span className="mr-1">📝</span> Apply to Analysis
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md border border-blue-100">
              <h4 className="font-medium text-[#5CB2CC] mb-2">Summary</h4>
              <p className="text-sm">{structuredOutput.summary}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-blue-100">
              <h4 className="font-medium text-[#5CB2CC] mb-2">Business Impact</h4>
              <p className="text-sm">{structuredOutput.businessImpact}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-blue-100">
              <h4 className="font-medium text-[#5CB2CC] mb-2">Challenges</h4>
              <p className="text-sm">{structuredOutput.challenges}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-blue-100">
              <h4 className="font-medium text-[#5CB2CC] mb-2">Opportunities</h4>
              <p className="text-sm">{structuredOutput.opportunities}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6 relative">
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
        
        {showHelpTip && !structuredOutput && (
          <div className="absolute top-24 right-4 bg-yellow-50 border border-yellow-100 p-3 rounded-lg shadow-md max-w-xs animate-pulse">
            <button 
              className="absolute -top-2 -right-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs"
              onClick={() => setShowHelpTip(false)}
            >
              ×
            </button>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Pro Tip:</span> Ask our AI assistant to generate a structured analysis for you! Just click the "Generate Analysis" button below.
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg border border-gray-200 mb-6">
        <div className="bg-[#5CB2CC] text-white p-3 rounded-t-lg flex justify-between items-center">
          <div className="font-medium flex items-center">
            <span className="mr-2">🤖</span> AI Analysis Assistant
          </div>
        </div>
        
        <div className="p-4 max-h-80 overflow-y-auto space-y-4">
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
                {message.isLoading ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <div className="p-3 border-t border-gray-200">
          <div className="flex mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB2CC]"
              placeholder="Ask about this trend's impact..."
              value={chatInput}
              onChange={handleChatInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isAiTyping}
            />
            <button
              className={`px-4 py-2 rounded-r-md text-white transition-colors ${
                isAiTyping 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#5CB2CC] hover:bg-[#4A90E2]'
              }`}
              onClick={handleSendMessage}
              disabled={isAiTyping}
            >
              {isAiTyping ? 'Thinking...' : 'Send'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              className="px-3 py-2 bg-[#0097A7] text-white rounded-md text-sm font-medium hover:bg-[#00838F] transition-all flex-grow"
              onClick={handleGenerateAnalysis}
              disabled={isAiTyping || structuredOutput !== null}
            >
              <span className="mr-1">✨</span> Generate Analysis
            </button>
            
            <button 
              className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-all"
              onClick={() => setChatInput("What are the key benefits of this trend?")}
              disabled={isAiTyping}
            >
              Benefits?
            </button>
            
            <button 
              className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-all"
              onClick={() => setChatInput("How would you explain this trend to executives?")}
              disabled={isAiTyping}
            >
              For executives
            </button>
            
            <button 
              className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-all"
              onClick={() => setChatInput("Tell me something surprising about this trend")}
              disabled={isAiTyping}
            >
              Surprise me!
            </button>
          </div>
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