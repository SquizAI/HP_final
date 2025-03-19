import React, { useState } from 'react';
import { SlideMasterState } from './SlidesMasterMain';
import AIAssistButton from '../../common/AIAssistButton';

interface PromptEditorProps {
  state: SlideMasterState;
  updateState: (newState: Partial<SlideMasterState>) => void;
  onGenerate: (prompt: string, style: string, audience: string) => Promise<void>;
  isGenerating: boolean;
}

/**
 * Enhanced prompt editor with AI suggestions
 */
const PromptEditor: React.FC<PromptEditorProps> = ({
  state,
  updateState,
  onGenerate,
  isGenerating
}) => {
  const [prompt, setPrompt] = useState('Create a presentation about');
  const [style, setStyle] = useState('professional');
  const [audience, setAudience] = useState('business professionals');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showAiTips, setShowAiTips] = useState(false);
  
  // Popular presentation styles
  const styleOptions = [
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'academic', name: 'Academic' },
    { id: 'modern', name: 'Modern' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'playful', name: 'Playful' },
    { id: 'elegant', name: 'Elegant' }
  ];

  // Common audience types
  const audienceOptions = [
    { id: 'business professionals', name: 'Business Professionals' },
    { id: 'executives', name: 'Executives' },
    { id: 'general audience', name: 'General Audience' },
    { id: 'students', name: 'Students' },
    { id: 'technical experts', name: 'Technical Experts' },
    { id: 'investors', name: 'Investors' },
    { id: 'clients', name: 'Clients' },
    { id: 'team members', name: 'Team Members' }
  ];

  // Sample prompt suggestions
  const promptSuggestions = [
    "Artificial Intelligence and its business applications",
    "Sustainable business practices for the coming decade",
    "Digital transformation strategies for traditional businesses",
    "Building effective remote work culture",
    "Customer experience in the digital age",
    "Data-driven decision making for small businesses",
    "Emerging market trends and opportunities"
  ];

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  
  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };
  
  const handleAudienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAudience(e.target.value);
  };
  
  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt, style, audience);
    }
  };
  
  const enhancePrompt = () => {
    setIsEnhancing(true);
    
    // Mock AI enhancement (would connect to OpenAI in production)
    setTimeout(() => {
      const enhancedPrompt = prompt + " covering: 1) introduction and background, 2) current landscape and challenges, 3) solutions and opportunities, 4) implementation strategies, and 5) future outlook. Include relevant examples for " + audience;
      setPrompt(enhancedPrompt);
      setIsEnhancing(false);
    }, 1000);
  };
  
  const selectSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
  };
  
  const toggleAiTips = () => {
    setShowAiTips(!showAiTips);
  };
  
  // AI tips for improving prompts - more detailed and directly insertable into presentation
  const aiTips = [
    {
      title: "Topic structure template",
      content: "Create a [style] presentation about [specific topic] covering: 1) introduction and background, 2) current landscape and challenges, 3) solutions and opportunities, 4) implementation strategies, and 5) future outlook. Include relevant examples for [audience]."
    },
    {
      title: "Product launch template",
      content: "Create a presentation for launching [product name], highlighting: 1) market gap and opportunity, 2) product features and benefits, 3) competitive advantages, 4) pricing and go-to-market strategy, 5) customer success stories or use cases, and 6) availability and next steps."
    },
    {
      title: "Business proposal template", 
      content: "Create a business proposal presentation for [specific business idea/service] that includes: 1) executive summary, 2) market analysis and opportunity, 3) business model and revenue streams, 4) marketing and sales strategy, 5) financial projections, and 6) implementation timeline."
    },
    {
      title: "Educational content template",
      content: "Create an educational presentation about [specific topic] for [audience level] that covers: 1) foundational concepts, 2) key principles with real-world examples, 3) practical applications, 4) common misconceptions, 5) hands-on activities or exercises, and 6) additional resources for continued learning."
    },
    {
      title: "Data analysis template",
      content: "Create a data-driven presentation analyzing [specific trend/market/issue] that includes: 1) key metrics and KPIs, 2) historical trends and patterns, 3) comparative analysis with [benchmark/competitor], 4) insights and implications, 5) actionable recommendations based on the data, and 6) future projections."
    },
    {
      title: "Workshop/training template",
      content: "Create a workshop presentation on [specific skill/topic] for [audience], structured as: 1) learning objectives, 2) key concepts explained simply, 3) step-by-step methodology, 4) interactive exercises or scenarios, 5) common pitfalls and how to avoid them, and 6) practical application in real-world settings."
    },
    {
      title: "Visual-heavy presentation",
      content: "Create a visually engaging presentation about [topic] using primarily images, diagrams, and minimal text. Include: 1) compelling opening visual, 2) concept visualizations or infographics, 3) before/after comparisons, 4) process flows or journey maps, 5) data visualizations, and 6) inspirational closing image with call to action."
    }
  ];
  
  // Example prompts
  const examplePrompts = [
    "Create a business proposal for a new AI-powered customer service solution targeting medium-sized online retailers",
    "Develop a 10-minute presentation on climate change impacts for high school students with engaging visuals",
    "Design a product launch presentation for our new fitness app with competitive analysis and market opportunity",
    "Create a workshop on effective team communication strategies for remote engineering teams",
    "Develop a sales presentation for our enterprise data analytics platform focusing on ROI and implementation ease"
  ];
  
  const setExample = (example: string) => {
    setPrompt(example);
    setShowExamples(false);
  };
  
  const insertAiTip = (tip: { title: string, content: string }) => {
    // Insert the complete template
    setPrompt(tip.content);
    setShowAiTips(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Presentation Generator</h1>
          <p className="text-xl text-gray-600">
            Describe what you want to present about, and our AI will create professional slides
          </p>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-gray-700 text-lg font-medium mb-2">
              What do you want to create a presentation about?
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={handlePromptChange}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Describe your presentation topic in detail. The more specific you are, the better the AI can help. Examples: 'A business strategy for expanding our coffee shop to new locations' or 'The impact of artificial intelligence on healthcare in the next decade'..."
                className="w-full min-h-[150px] p-4 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isGenerating}
              />
              
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="p-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700">Suggestions</h3>
                  </div>
                  <ul className="max-h-60 overflow-auto py-1">
                    {promptSuggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 border-t border-gray-100">
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800"
                      onClick={() => setShowSuggestions(false)}
                    >
                      Close suggestions
                    </button>
                  </div>
                </div>
              )}
              
              {/* AI Assistant Button */}
              <div className="absolute bottom-3 right-3 flex items-center">
                <AIAssistButton
                  onClick={toggleAiTips}
                  tooltip="Get AI writing tips for your prompt"
                  buttonStyle="standard"
                  label="AI Writing Tips"
                  disabled={isGenerating}
                />
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowExamples(!showExamples)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showExamples ? 'Hide examples' : 'Show me some examples'}
              </button>
              <span className="text-xs text-gray-500">{prompt.length} characters</span>
            </div>
            
            {/* AI Tips Panel */}
            {showAiTips && (
              <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg overflow-hidden shadow-md">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2">
                  <h3 className="font-medium text-white">Presentation Templates</h3>
                  <p className="text-xs text-blue-100 mt-1">Click a template to add it to your prompt</p>
                </div>
                <div className="divide-y divide-blue-100">
                  {aiTips.map((tip, index) => (
                    <div 
                      key={index}
                      className="p-3 hover:bg-blue-100 cursor-pointer transition-colors"
                      onClick={() => insertAiTip(tip)}
                    >
                      <div className="flex items-start">
                        <div className="text-blue-600 mt-0.5 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{tip.title}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{tip.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Example Prompts */}
            {showExamples && (
              <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2">
                  <h3 className="font-medium text-white">Example Prompts</h3>
                </div>
                <div className="divide-y divide-blue-100">
                  {examplePrompts.map((example, index) => (
                    <div 
                      key={index}
                      className="p-4 hover:bg-blue-100 cursor-pointer transition-colors"
                      onClick={() => setExample(example)}
                    >
                      <p className="text-sm text-gray-700">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="style" className="block text-gray-700 font-medium mb-2">
                Presentation Style
              </label>
              <select
                id="style"
                value={style}
                onChange={handleStyleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isGenerating}
              >
                {styleOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="audience" className="block text-gray-700 font-medium mb-2">
                Target Audience
              </label>
              <select
                id="audience"
                value={audience}
                onChange={handleAudienceChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isGenerating}
              >
                {audienceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={enhancePrompt}
              disabled={isEnhancing || prompt.length < 10}
              className={`text-sm px-3 py-1 rounded-md ${
                isEnhancing || prompt.length < 10
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              {isEnhancing ? (
                <>
                  <span className="inline-block animate-pulse">Enhancing</span>
                  <span className="inline-block animate-pulse delay-75">.</span>
                  <span className="inline-block animate-pulse delay-150">.</span>
                  <span className="inline-block animate-pulse delay-300">.</span>
                </>
              ) : (
                <>✨ Enhance with AI</>
              )}
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>Presentations are generated using AI and may require review and editing.</p>
            <p className="mt-1">Images will be generated with DALL-E. Your presentation will include speaker notes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEditor; 