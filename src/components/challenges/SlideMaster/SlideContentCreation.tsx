import React, { useState } from 'react';
import { SlideMasterState, Slide, SlideType } from './SlidesMasterMain';
import AIAssistButton from '../../../components/common/AIAssistButton';

interface SlideContentCreationProps {
  state: SlideMasterState;
  updateState: (newState: Partial<SlideMasterState>) => void;
  onNext: () => void;
  onBack: () => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  error: string | null;
}

// Slide types definitions with descriptions
const SLIDE_TYPES: {[key in SlideType]: {title: string; description: string; icon: string}} = {
  'title': {
    title: 'Title Slide',
    description: 'Introduction slide with presentation title and subtitle',
    icon: '📌'
  },
  'content': {
    title: 'Content Slide',
    description: 'Standard slide with title and bulleted content',
    icon: '📄'
  },
  'twoColumn': {
    title: 'Two Column',
    description: 'Split content into two columns for comparison or organization',
    icon: '⫴'
  },
  'image': {
    title: 'Image Slide',
    description: 'Large image with optional caption or description',
    icon: '🖼️'
  },
  'quote': {
    title: 'Quote Slide',
    description: 'Highlight an important quote or testimonial',
    icon: '💬'
  },
  'chart': {
    title: 'Chart/Graph',
    description: 'Data visualization with optional explanation',
    icon: '📊'
  },
  'table': {
    title: 'Table Slide',
    description: 'Organized data in rows and columns',
    icon: '🗃️'
  },
  'comparison': {
    title: 'Comparison',
    description: 'Side-by-side comparison of concepts or options',
    icon: '⚖️'
  },
  'timeline': {
    title: 'Timeline',
    description: 'Sequential events or milestones',
    icon: '⏱️'
  },
  'agenda': {
    title: 'Agenda/Outline',
    description: 'Overview of presentation sections',
    icon: '📋'
  },
  'section': {
    title: 'Section Divider',
    description: 'Visual break between presentation sections',
    icon: '🔖'
  },
  'conclusion': {
    title: 'Conclusion',
    description: 'Summary of key points and takeaways',
    icon: '🏁'
  },
  'thankyou': {
    title: 'Thank You',
    description: 'Closing slide with contact information',
    icon: '🙏'
  }
};

// Example content templates for each slide type
const CONTENT_TEMPLATES: {[key in SlideType]?: string[]} = {
  'content': [
    'Key Benefits:\n• Increased efficiency\n• Cost reduction\n• Improved user experience\n• Scalable solution',
    'Critical Challenges:\n• Resource constraints\n• Technical complexity\n• Market competition\n• Implementation timeline',
    'Strategic Priorities:\n• Customer acquisition\n• Product development\n• Operational excellence\n• Market expansion'
  ],
  'quote': [
    '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
    '"Innovation distinguishes between a leader and a follower." - Steve Jobs',
    '"The best way to predict the future is to create it." - Peter Drucker'
  ],
  'comparison': [
    'Current Approach vs. Proposed Solution\nCurrent: Manual processes, high error rate\nProposed: Automated workflow, improved accuracy',
    'Competitor Analysis\nStrengths: Established market presence\nWeaknesses: Outdated technology\nOpportunities: Emerging market segments'
  ]
};

const SlideContentCreation: React.FC<SlideContentCreationProps> = ({
  state,
  updateState,
  onNext,
  onBack,
  isGenerating,
  setIsGenerating,
  error
}) => {
  // Local state
  const [showSlideTypeMenu, setShowSlideTypeMenu] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState(state.currentSlideIndex);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  
  // Get current slide
  const currentSlide = state.slides[editingSlideIndex] || state.slides[0];
  
  // Create a new slide
  const createNewSlide = (type: SlideType) => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type,
      title: SLIDE_TYPES[type].title,
      content: { mainText: '', bullets: [] },
      notes: ''
    };
    
    const updatedSlides = [...state.slides, newSlide];
    updateState({ 
      slides: updatedSlides,
      currentSlideIndex: updatedSlides.length - 1
    });
    setEditingSlideIndex(updatedSlides.length - 1);
    setShowSlideTypeMenu(false);
  };
  
  // Update current slide
  const updateCurrentSlide = (slideUpdate: Partial<Slide>) => {
    const updatedSlides = [...state.slides];
    updatedSlides[editingSlideIndex] = {
      ...updatedSlides[editingSlideIndex],
      ...slideUpdate
    };
    updateState({ slides: updatedSlides });
  };
  
  // Delete current slide
  const deleteCurrentSlide = () => {
    if (state.slides.length <= 1) {
      alert('You must have at least one slide in your presentation.');
      return;
    }
    
    const updatedSlides = state.slides.filter((_, index) => index !== editingSlideIndex);
    const newIndex = editingSlideIndex >= updatedSlides.length 
      ? updatedSlides.length - 1 
      : editingSlideIndex;
      
    updateState({ 
      slides: updatedSlides,
      currentSlideIndex: newIndex
    });
    setEditingSlideIndex(newIndex);
  };
  
  // Navigate to another slide
  const navigateToSlide = (index: number) => {
    updateState({ currentSlideIndex: index });
    setEditingSlideIndex(index);
  };
  
  // Handle slide title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentSlide({ title: e.target.value });
  };
  
  // Handle slide content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentSlide({ 
      content: { 
        ...currentSlide.content,
        mainText: e.target.value 
      } 
    });
  };
  
  // Handle slide notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCurrentSlide({ notes: e.target.value });
  };
  
  // Handle bullet points change
  const handleBulletChange = (value: string, index: number) => {
    const bullets = [...(currentSlide.content.bullets || [])];
    bullets[index] = value;
    
    updateCurrentSlide({
      content: { 
        ...currentSlide.content,
        bullets 
      }
    });
  };
  
  // Add a new bullet point
  const addBullet = () => {
    const bullets = [...(currentSlide.content.bullets || []), ''];
    updateCurrentSlide({
      content: { 
        ...currentSlide.content,
        bullets 
      }
    });
  };
  
  // Remove a bullet point
  const removeBullet = (index: number) => {
    const bullets = (currentSlide.content.bullets || []).filter((_, i) => i !== index);
    updateCurrentSlide({
      content: { 
        ...currentSlide.content,
        bullets 
      }
    });
  };
  
  // Generate slide content using AI
  const generateSlideContent = () => {
    setIsGenerating(true);
    
    // Simulate AI generation (In a real app, this would call an API)
    setTimeout(() => {
      const slideType = currentSlide.type;
      let generatedContent: Partial<Slide> = {};
      
      if (slideType === 'content' || slideType === 'twoColumn') {
        // Generate bullet points
        generatedContent = {
          title: `Key Points on ${state.title.split(':')[0]}`,
          content: {
            ...currentSlide.content,
            bullets: [
              "Understand your audience's specific needs and pain points",
              "Focus on clear, measurable objectives that align with your goals",
              "Develop a structured approach with defined milestones",
              "Implement systems for feedback and continuous improvement",
              "Leverage available resources efficiently and strategically"
            ]
          }
        };
      } else if (slideType === 'quote') {
        // Generate a relevant quote
        const quotes = CONTENT_TEMPLATES.quote || [];
        generatedContent = {
          content: {
            ...currentSlide.content,
            quote: quotes[Math.floor(Math.random() * quotes.length)]
          }
        };
      } else if (slideType === 'image') {
        // Just update the title for now, image will be handled separately
        generatedContent = {
          title: `Visual Representation: ${state.title.split(':')[0]}`
        };
      } else if (slideType === 'chart') {
        // Generate chart data
        generatedContent = {
          title: `Data Analysis: ${state.title.split(':')[0]}`,
          content: {
            ...currentSlide.content,
            chartData: {
              type: 'bar',
              labels: ['Q1', 'Q2', 'Q3', 'Q4'],
              datasets: [
                {
                  label: 'Performance',
                  data: [12, 19, 8, 15],
                  backgroundColor: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B']
                }
              ]
            }
          }
        };
      } else if (slideType === 'conclusion') {
        // Generate conclusion points
        generatedContent = {
          title: "Key Takeaways",
          content: {
            ...currentSlide.content,
            bullets: [
              "We've explored the core concepts and strategic approaches",
              "Implementation will require cross-functional collaboration",
              "The ROI potential is significant with proper execution",
              "Next steps include detailed planning and resource allocation",
              "Questions and discussion are welcome"
            ]
          }
        };
      } else {
        // Default content generation for other slide types
        generatedContent = {
          title: `${SLIDE_TYPES[slideType].title}: ${state.title.split(':')[0]}`,
          content: {
            ...currentSlide.content,
            mainText: `This slide contains auto-generated content for ${SLIDE_TYPES[slideType].title.toLowerCase()} based on your presentation topic and audience.`
          }
        };
      }
      
      // Update the slide with generated content
      updateCurrentSlide(generatedContent);
      setIsGenerating(false);
      setShowContentGenerator(false);
    }, 2000);
  };
  
  // Generate an image for the slide
  const generateImage = () => {
    if (!imagePrompt) {
      alert('Please enter an image description first.');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI image generation (In a real app, this would call an API like DALL-E)
    setTimeout(() => {
      // For demo purposes, we'll use placeholder images
      const placeholderImages = [
        'https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=AI+Generated+Image',
        'https://via.placeholder.com/800x450/7C3AED/FFFFFF?text=AI+Generated+Image',
        'https://via.placeholder.com/800x450/EC4899/FFFFFF?text=AI+Generated+Image',
        'https://via.placeholder.com/800x450/F59E0B/FFFFFF?text=AI+Generated+Image'
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      
      updateCurrentSlide({
        imagePrompt: imagePrompt,
        generatedImageUrl: randomImage,
        content: {
          ...currentSlide.content,
          imageDescription: imagePrompt
        }
      });
      
      setIsGenerating(false);
      setShowImageGenerator(false);
    }, 3000);
  };
  
  // Calculate recommended number of slides based on presentation length
  const recommendedSlides = Math.ceil(state.lengthMinutes / 2); // ~1 slide per 2 minutes
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Slide Content Creation</h3>
        <div className="text-sm text-gray-500">
          {state.slides.length} slide{state.slides.length !== 1 ? 's' : ''} created
          {recommendedSlides > 0 && ` (recommended: ${recommendedSlides})`}
        </div>
      </div>
      
      {/* Slide navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-3 pb-2">
          {state.slides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => navigateToSlide(index)}
              className={`flex-shrink-0 w-32 h-24 border rounded-md cursor-pointer transition ${
                index === editingSlideIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-2">
                <span className="text-xs truncate">{slide.type}</span>
                <span className="text-xs text-gray-500">{index + 1}</span>
              </div>
              <div className="p-2 text-xs truncate">{slide.title}</div>
              {slide.generatedImageUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                  <span className="text-xs bg-black bg-opacity-50 text-white px-1 rounded">Image</span>
                </div>
              )}
            </div>
          ))}
          
          {/* Add new slide button */}
          <div
            onClick={() => setShowSlideTypeMenu(!showSlideTypeMenu)}
            className="flex-shrink-0 w-32 h-24 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="text-center">
              <div className="text-xl text-gray-400">+</div>
              <div className="text-xs text-gray-500">Add Slide</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slide type selection menu */}
      {showSlideTypeMenu && (
        <div className="mb-6 p-4 bg-white border rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-800">Select Slide Type</h4>
            <button 
              onClick={() => setShowSlideTypeMenu(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(SLIDE_TYPES).map(([type, details]) => (
              <button
                key={type}
                onClick={() => createNewSlide(type as SlideType)}
                className="p-3 border rounded-md text-left hover:bg-blue-50 hover:border-blue-300 transition"
              >
                <div className="flex items-center mb-1">
                  <span className="text-lg mr-2">{details.icon}</span>
                  <span className="font-medium">{details.title}</span>
                </div>
                <p className="text-xs text-gray-600">{details.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Current slide editor */}
      <div className="bg-white border rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-800 flex items-center">
            <span className="mr-2">{SLIDE_TYPES[currentSlide.type].icon}</span>
            {SLIDE_TYPES[currentSlide.type].title} (Slide {editingSlideIndex + 1})
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={deleteCurrentSlide}
              disabled={state.slides.length <= 1}
              className={`p-1 text-red-500 hover:bg-red-50 rounded ${
                state.slides.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Delete slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Slide title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Slide Title</label>
          <input
            type="text"
            value={currentSlide.title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter slide title"
          />
        </div>
        
        {/* Different content editor based on slide type */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Slide Content</label>
            <div>
              <AIAssistButton
                onClick={() => setShowContentGenerator(!showContentGenerator)}
                tooltip="Generate content with AI"
                buttonStyle="minimal"
              />
            </div>
          </div>
          
          {/* Content input based on slide type */}
          {(currentSlide.type === 'title' || currentSlide.type === 'section' || 
            currentSlide.type === 'thankyou' || currentSlide.type === 'quote') && (
            <textarea
              value={currentSlide.content.mainText || ''}
              onChange={handleContentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Enter content for ${SLIDE_TYPES[currentSlide.type].title}`}
              rows={4}
            />
          )}
          
          {/* Bullet point editor for content and similar slides */}
          {(currentSlide.type === 'content' || currentSlide.type === 'conclusion' || 
            currentSlide.type === 'agenda' || currentSlide.type === 'twoColumn') && (
            <div>
              {(currentSlide.content.bullets || []).map((bullet, index) => (
                <div key={index} className="flex items-center mb-2">
                  <span className="text-gray-500 mr-2">•</span>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(e.target.value, index)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Bullet point ${index + 1}`}
                  />
                  <button
                    onClick={() => removeBullet(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addBullet}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Bullet Point
              </button>
            </div>
          )}
          
          {/* Image content for image slides */}
          {currentSlide.type === 'image' && (
            <div>
              {currentSlide.generatedImageUrl ? (
                <div className="mb-3">
                  <img 
                    src={currentSlide.generatedImageUrl} 
                    alt="Slide image"
                    className="w-full h-auto rounded-md border border-gray-200" 
                  />
                  <p className="mt-2 text-sm text-gray-500 italic">
                    Image prompt: {currentSlide.imagePrompt}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 border border-gray-200 rounded-md p-8 flex items-center justify-center mb-3">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">No image generated yet</p>
                    <button 
                      onClick={() => setShowImageGenerator(true)}
                      className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Generate Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Chart content for chart slides */}
          {currentSlide.type === 'chart' && (
            <div className="bg-gray-100 border border-gray-200 rounded-md p-8 flex items-center justify-center mb-3">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {currentSlide.content.chartData ? (
                  <p className="text-gray-500">Chart data available (chart visualization in preview)</p>
                ) : (
                  <p className="text-gray-500">No chart data yet. Use AI to generate sample data.</p>
                )}
              </div>
            </div>
          )}
          
          {/* AI Content Generator */}
          {showContentGenerator && (
            <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-blue-800">AI Content Generator</h4>
                <button 
                  onClick={() => setShowContentGenerator(false)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <p className="text-sm text-blue-700 mb-3">
                Generate content for your {SLIDE_TYPES[currentSlide.type].title.toLowerCase()} based on your presentation topic and audience.
              </p>
              
              {/* Show content templates if available */}
              {CONTENT_TEMPLATES[currentSlide.type] && !isGenerating && (
                <div className="mb-3">
                  <p className="text-xs text-blue-800 mb-2">Choose a template:</p>
                  <div className="space-y-2">
                    {CONTENT_TEMPLATES[currentSlide.type]?.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (currentSlide.type === 'content' || currentSlide.type === 'conclusion') {
                            updateCurrentSlide({
                              content: {
                                ...currentSlide.content,
                                bullets: template.split('\n').filter(line => line.includes('•')).map(line => line.replace('• ', ''))
                              }
                            });
                          } else {
                            updateCurrentSlide({
                              content: {
                                ...currentSlide.content,
                                mainText: template
                              }
                            });
                          }
                          setShowContentGenerator(false);
                        }}
                        className="w-full text-left p-2 bg-white border border-blue-100 rounded hover:bg-blue-50 transition text-sm"
                      >
                        <div className="whitespace-pre-line">{template}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <AIAssistButton
                onClick={generateSlideContent}
                label={isGenerating ? "Generating Content..." : "Generate Custom Content"}
                buttonStyle="prominent"
                disabled={isGenerating}
              />
              
              <p className="text-xs text-blue-600 mt-2">
                The AI will create content aligned with the purpose of your presentation.
              </p>
            </div>
          )}
          
          {/* AI Image Generator */}
          {showImageGenerator && (
            <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-blue-800">AI Image Generator</h4>
                <button 
                  onClick={() => setShowImageGenerator(false)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <p className="text-sm text-blue-700 mb-3">
                Describe the image you want to create for your slide.
              </p>
              
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="E.g., A professional team collaborating in a modern office environment with charts and graphs visible on screens"
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
                rows={3}
              />
              
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const suggestions = [
                      "A professional team collaborating in a modern office",
                      "Minimalist business concept with clean lines and blue tones",
                      "A visual metaphor for growth with plants and upward arrows",
                      "Data visualization with colorful charts on a dark background",
                      "Futuristic technology concept with glowing connections"
                    ];
                    setImagePrompt(suggestions[Math.floor(Math.random() * suggestions.length)]);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Suggest prompt
                </button>
                
                <AIAssistButton
                  onClick={generateImage}
                  label={isGenerating ? "Generating Image..." : "Generate Image"}
                  buttonStyle="prominent"
                  disabled={isGenerating || !imagePrompt}
                />
              </div>
              
              {isGenerating && (
                <div className="mt-3 flex justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Creating your image (this would use DALL-E in a real app)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Presenter Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Presenter Notes</label>
          <textarea
            value={currentSlide.notes}
            onChange={handleNotesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Notes visible only to the presenter (not shown on the slide)"
            rows={3}
          />
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          Back
        </button>
        
        <button
          onClick={onNext}
          disabled={state.slides.length === 0}
          className={`px-6 py-2 rounded-md font-medium ${
            state.slides.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isGenerating ? 'Please wait...' : 'Continue to Visual Customization'}
        </button>
      </div>
    </div>
  );
};

export default SlideContentCreation; 