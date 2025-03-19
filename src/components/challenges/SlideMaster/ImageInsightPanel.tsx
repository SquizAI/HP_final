import React, { useState } from 'react';

interface ImageInsightPanelProps {
  isVisible: boolean;
}

const ImageInsightPanel: React.FC<ImageInsightPanelProps> = ({ isVisible }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  
  if (!isVisible) return null;
  
  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  
  return (
    <div 
      className={`fixed right-5 ${isExpanded ? 'bottom-0' : 'bottom-[-530px]'} w-[500px] h-[580px] bg-white border border-gray-200 rounded-md shadow-xl transition-all duration-300 ease-in-out z-50 overflow-hidden`}
    >
      {/* Header */}
      <div 
        className="p-4 bg-blue-500 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold">AI Image Insights</h2>
        <button 
          className="px-2 py-1 text-sm text-white hover:bg-blue-600 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? '▼ Hide' : '▲ Show'}
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 overflow-y-auto h-[520px]">
        {/* Tabs */}
        <div className="mb-4">
          <div className="flex border-b">
            {['How It Works', 'Models', 'Prompt Tips', 'Examples'].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === index 
                    ? 'text-blue-600 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Panels */}
        <div className="mt-4">
          {/* How It Works Panel */}
          {activeTab === 0 && (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Presentation Image Generation</h3>
                <p className="text-sm">
                  Our system intelligently selects the right AI model for each slide type and optimizes prompts 
                  for the best results. Here's what happens behind the scenes:
                </p>
              </div>
              
              {/* Accordion */}
              <div className="space-y-2">
                {/* Content Analysis */}
                <div className="border rounded-md overflow-hidden">
                  <button
                    className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50"
                    onClick={() => toggleAccordion(0)}
                  >
                    <span>1. Content Analysis</span>
                    <span>{openAccordion === 0 ? '▼' : '▶'}</span>
                  </button>
                  
                  {openAccordion === 0 && (
                    <div className="p-3 border-t">
                      <p className="text-sm">
                        Each slide is analyzed to determine its type and content. We look for:
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Title/text patterns</span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Numerical data</span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Quote markers</span>
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Bullet points</span>
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Key terms</span>
                        <span className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded">Date references</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Model Selection */}
                <div className="border rounded-md overflow-hidden">
                  <button
                    className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50"
                    onClick={() => toggleAccordion(1)}
                  >
                    <span>2. Model Selection</span>
                    <span>{openAccordion === 1 ? '▼' : '▶'}</span>
                  </button>
                  
                  {openAccordion === 1 && (
                    <div className="p-3 border-t">
                      <p className="text-sm mb-2">
                        Based on the content analysis, we select the best AI model:
                      </p>
                      <div className="border rounded-md p-2 mb-2">
                        <p className="font-bold">Ideogram V2</p>
                        <p className="text-sm">Used for slides with text, diagrams, charts, and data visualization</p>
                      </div>
                      <div className="border rounded-md p-2">
                        <p className="font-bold">Recraft</p>
                        <p className="text-sm">Used for photo-realistic scenes, environments, and concept images</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Prompt Enhancement */}
                <div className="border rounded-md overflow-hidden">
                  <button
                    className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50"
                    onClick={() => toggleAccordion(2)}
                  >
                    <span>3. Prompt Enhancement</span>
                    <span>{openAccordion === 2 ? '▼' : '▶'}</span>
                  </button>
                  
                  {openAccordion === 2 && (
                    <div className="p-3 border-t">
                      <p className="text-sm mb-2">
                        The base prompt from slide content is enhanced with:
                      </p>
                      <div className="space-y-2">
                        <div className="border rounded-md p-2">
                          <p className="font-bold">Style Modifiers</p>
                          <p className="text-sm">Based on selected presentation style</p>
                        </div>
                        <div className="border rounded-md p-2">
                          <p className="font-bold">Quality Indicators</p>
                          <p className="text-sm">Professional, high-quality specifications</p>
                        </div>
                        <div className="border rounded-md p-2">
                          <p className="font-bold">Context Hints</p>
                          <p className="text-sm">Presentation-specific context</p>
                        </div>
                        <div className="border rounded-md p-2">
                          <p className="font-bold">Negative Prompts</p>
                          <p className="text-sm">What to avoid in the generated image</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Image Generation & Caching */}
                <div className="border rounded-md overflow-hidden">
                  <button
                    className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50"
                    onClick={() => toggleAccordion(3)}
                  >
                    <span>4. Image Generation & Caching</span>
                    <span>{openAccordion === 3 ? '▼' : '▶'}</span>
                  </button>
                  
                  {openAccordion === 3 && (
                    <div className="p-3 border-t">
                      <p className="text-sm">
                        Images are generated via AI APIs and cached for performance. The system:
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">• Batches requests for efficiency</p>
                        <p className="text-sm">• Caches results to avoid regenerating identical images</p>
                        <p className="text-sm">• Tracks credit usage to ensure fair allocation</p>
                        <p className="text-sm">• Provides fallback images if generation fails</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Models Panel */}
          {activeTab === 1 && (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">AI Models Comparison</h3>
                <p className="text-sm">
                  Each model has unique strengths that make it ideal for certain types of slides.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold">Ideogram V2</h4>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Text & Diagrams</span>
                  </div>
                  <hr className="mb-2" />
                  <p className="text-sm mb-2">
                    A powerful model from fal.ai that excels at creating images with text elements, diagrams, 
                    and data visualizations. Perfect for slides that need clear typography.
                  </p>
                  <p className="text-sm font-bold mt-2">Best for:</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <p className="text-xs">• Title slides</p>
                    <p className="text-xs">• Quote slides</p>
                    <p className="text-xs">• Data charts</p>
                    <p className="text-xs">• Timelines</p>
                    <p className="text-xs">• Process diagrams</p>
                    <p className="text-xs">• Comparison slides</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold">Recraft</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Realistic Images</span>
                  </div>
                  <hr className="mb-2" />
                  <p className="text-sm mb-2">
                    A fal.ai model specialized in creating photorealistic images with incredible detail. 
                    Excellent for creating environmental scenes and concept illustrations.
                  </p>
                  <p className="text-sm font-bold mt-2">Best for:</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <p className="text-xs">• Team photos</p>
                    <p className="text-xs">• Environmental shots</p>
                    <p className="text-xs">• Product visuals</p>
                    <p className="text-xs">• Concept illustrations</p>
                    <p className="text-xs">• Background imagery</p>
                    <p className="text-xs">• Scene compositions</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold">DALL-E (Fallback)</h4>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Versatile</span>
                  </div>
                  <hr className="mb-2" />
                  <p className="text-sm mb-2">
                    Used as a fallback option when the specialized models are unavailable. A versatile 
                    model that can handle most presentation image needs.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Prompt Tips Panel */}
          {activeTab === 2 && (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Writing Effective Prompts</h3>
                <p className="text-sm">
                  The quality of AI-generated images depends heavily on the prompts provided.
                  Here are tips to get the best results:
                </p>
              </div>
              
              <div className="space-y-2">
                {/* Be Specific */}
                <div className="border rounded-md overflow-hidden">
                  <button
                    className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50"
                    onClick={() => toggleAccordion(4)}
                  >
                    <span>Be Specific</span>
                    <span>{openAccordion === 4 ? '▼' : '▶'}</span>
                  </button>
                  
                  {openAccordion === 4 && (
                    <div className="p-3 border-t">
                      <p className="text-sm mb-2">Vague prompts produce unpredictable results.</p>
                      <div className="border rounded-md p-2 mb-2 bg-red-50">
                        <p className="text-sm font-bold">❌ Poor:</p>
                        <code className="block p-1 bg-gray-100 rounded text-sm">data chart</code>
                      </div>
                      <div className="border rounded-md p-2 bg-green-50">
                        <p className="text-sm font-bold">✅ Better:</p>
                        <code className="block p-1 bg-gray-100 rounded text-sm">professional line chart showing quarterly revenue growth, clean blue design, appropriate for business presentation</code>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Include Style Details */}
                <div className="border rounded-md overflow-hidden">
                  <button
                    className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50"
                    onClick={() => toggleAccordion(5)}
                  >
                    <span>Include Style Details</span>
                    <span>{openAccordion === 5 ? '▼' : '▶'}</span>
                  </button>
                  
                  {openAccordion === 5 && (
                    <div className="p-3 border-t">
                      <p className="text-sm mb-2">Mention style, colors, and mood to guide the AI.</p>
                      <div className="border rounded-md p-2 mb-2 bg-red-50">
                        <p className="text-sm font-bold">❌ Poor:</p>
                        <code className="block p-1 bg-gray-100 rounded text-sm">marketing strategy image</code>
                      </div>
                      <div className="border rounded-md p-2 bg-green-50">
                        <p className="text-sm font-bold">✅ Better:</p>
                        <code className="block p-1 bg-gray-100 rounded text-sm">marketing strategy visualization, modern design with blue and orange gradient, professional corporate style, minimalist approach</code>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Add Quality Indicators */}
                <div className="border rounded-md overflow-hidden">
                  <button
                    className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50"
                    onClick={() => toggleAccordion(6)}
                  >
                    <span>Add Quality Indicators</span>
                    <span>{openAccordion === 6 ? '▼' : '▶'}</span>
                  </button>
                  
                  {openAccordion === 6 && (
                    <div className="p-3 border-t">
                      <p className="text-sm mb-2">Signal the level of quality you expect.</p>
                      <div className="space-y-1">
                        <code className="block p-1 bg-gray-100 rounded text-sm">high quality</code>
                        <code className="block p-1 bg-gray-100 rounded text-sm">professional</code>
                        <code className="block p-1 bg-gray-100 rounded text-sm">detailed</code>
                        <code className="block p-1 bg-gray-100 rounded text-sm">crisp</code>
                        <code className="block p-1 bg-gray-100 rounded text-sm">clean composition</code>
                        <code className="block p-1 bg-gray-100 rounded text-sm">high resolution</code>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Use Negative Prompts */}
                <div className="border rounded-md overflow-hidden">
                  <button
                    className="w-full p-3 text-left font-medium flex justify-between items-center bg-gray-50"
                    onClick={() => toggleAccordion(7)}
                  >
                    <span>Use Negative Prompts</span>
                    <span>{openAccordion === 7 ? '▼' : '▶'}</span>
                  </button>
                  
                  {openAccordion === 7 && (
                    <div className="p-3 border-t">
                      <p className="text-sm mb-2">
                        Specify what you DON'T want in the image to avoid unwanted elements.
                      </p>
                      <div className="border rounded-md p-2">
                        <p className="text-sm font-bold">Example negative prompts:</p>
                        <div className="space-y-1 mt-2">
                          <code className="block p-1 bg-gray-100 rounded text-sm">text, words, letters, labels</code>
                          <code className="block p-1 bg-gray-100 rounded text-sm">blurry, low quality, distorted</code>
                          <code className="block p-1 bg-gray-100 rounded text-sm">cartoon style, childish, unprofessional</code>
                          <code className="block p-1 bg-gray-100 rounded text-sm">cluttered, busy, complex background</code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Examples Panel */}
          {activeTab === 3 && (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Example Transformations</h3>
                <p className="text-sm">
                  See how our system transforms slide content into optimized image prompts
                  that produce professional results.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 p-3">
                    <p className="text-sm font-bold">Title Slide</p>
                    <p className="text-sm">2024 Annual Market Report</p>
                  </div>
                  <hr />
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-500">ENHANCED PROMPT:</p>
                    <code className="block p-2 bg-gray-100 rounded text-xs mt-1">
                      2024 Annual Market Report, professional corporate style with blue and gray tones, 
                      clean typography, high quality presentation slide background, data visualization 
                      concept, professional lighting
                    </code>
                    <p className="text-xs font-bold text-gray-500 mt-3">MODEL SELECTED:</p>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded mt-1 inline-block">Ideogram V2</span>
                    <p className="text-xs font-bold text-gray-500 mt-3">REASONING:</p>
                    <p className="text-xs">
                      Title slide with text elements and potentially data visualization needs clear typography
                      that Ideogram V2 excels at producing.
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 p-3">
                    <p className="text-sm font-bold">Team Slide</p>
                    <p className="text-sm">Our Global Leadership Team</p>
                  </div>
                  <hr />
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-500">ENHANCED PROMPT:</p>
                    <code className="block p-2 bg-gray-100 rounded text-xs mt-1">
                      Our Global Leadership Team, diverse business professionals in modern office environment, 
                      collaborative atmosphere, professional corporate setting, high quality, realistic style, 
                      well-lit scene
                    </code>
                    <p className="text-xs font-bold text-gray-500 mt-3">MODEL SELECTED:</p>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded mt-1 inline-block">Recraft</span>
                    <p className="text-xs font-bold text-gray-500 mt-3">REASONING:</p>
                    <p className="text-xs">
                      Team slides benefit from photorealistic imagery of people in professional environments,
                      which is Recraft's strength.
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 p-3">
                    <p className="text-sm font-bold">Process Slide</p>
                    <p className="text-sm">5 Steps to Digital Transformation</p>
                  </div>
                  <hr />
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-500">ENHANCED PROMPT:</p>
                    <code className="block p-2 bg-gray-100 rounded text-xs mt-1">
                      5 Steps to Digital Transformation, step-by-step process visualization, flow diagram concept,
                      clear readable typography, professional text layout, clean vector style, minimalist design,
                      technical precise illustration
                    </code>
                    <p className="text-xs font-bold text-gray-500 mt-3">MODEL SELECTED:</p>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded mt-1 inline-block">Ideogram V2</span>
                    <p className="text-xs font-bold text-gray-500 mt-3">REASONING:</p>
                    <p className="text-xs">
                      Process flows with steps require clear typography and diagram elements which
                      Ideogram V2 can render effectively.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageInsightPanel; 