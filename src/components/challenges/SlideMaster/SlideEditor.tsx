import React, { useState } from 'react';
import { SlideMasterState, Slide } from './SlidesMasterMain';
import { generateImage } from '../../../utils/imageGenerator';
import AIAssistButton from '../../common/AIAssistButton';

interface SlideEditorProps {
  state: SlideMasterState;
  updateState: (newState: Partial<SlideMasterState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SlideEditor: React.FC<SlideEditorProps> = ({
  state,
  updateState,
  onNext,
  onBack
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSlide, setEditingSlide] = useState(false);
  const [showRawContent, setShowRawContent] = useState(false);
  const [regeneratingImage, setRegeneratingImage] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  
  // Navigate to a specific slide
  const goToSlide = (index: number) => {
    if (index >= 0 && index < state.slides.length) {
      setCurrentSlideIndex(index);
    }
  };
  
  // Get the current slide
  const currentSlide = state.slides[currentSlideIndex] || null;
  
  // Handle slide title edit
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentSlide) return;
    
    const updatedSlides = [...state.slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      title: e.target.value
    };
    
    updateState({ slides: updatedSlides });
  };
  
  // Handle slide content edit
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'mainText' | 'notes') => {
    if (!currentSlide) return;
    
    const updatedSlides = [...state.slides];
    
    if (field === 'mainText') {
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        content: {
          ...currentSlide.content,
          mainText: e.target.value
        }
      };
    } else if (field === 'notes') {
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        notes: e.target.value
      };
    }
    
    updateState({ slides: updatedSlides });
  };
  
  // Handle bullet point edit
  const handleBulletChange = (index: number, value: string) => {
    if (!currentSlide || !currentSlide.content.bullets) return;
    
    const updatedSlides = [...state.slides];
    const updatedBullets = [...currentSlide.content.bullets];
    updatedBullets[index] = value;
    
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      content: {
        ...currentSlide.content,
        bullets: updatedBullets
      }
    };
    
    updateState({ slides: updatedSlides });
  };
  
  // Add a new bullet point
  const addBulletPoint = () => {
    if (!currentSlide) return;
    
    const updatedSlides = [...state.slides];
    const bullets = currentSlide.content.bullets || [];
    
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      content: {
        ...currentSlide.content,
        bullets: [...bullets, '']
      }
    };
    
    updateState({ slides: updatedSlides });
  };
  
  // Remove a bullet point
  const removeBulletPoint = (index: number) => {
    if (!currentSlide || !currentSlide.content.bullets) return;
    
    const updatedSlides = [...state.slides];
    const updatedBullets = [...currentSlide.content.bullets];
    updatedBullets.splice(index, 1);
    
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      content: {
        ...currentSlide.content,
        bullets: updatedBullets
      }
    };
    
    updateState({ slides: updatedSlides });
  };
  
  // Add regenerateSlideImage function
  const regenerateSlideImage = async () => {
    if (!currentSlide || !currentSlide.imagePrompt) return;
    
    try {
      setRegeneratingImage(true);
      
      // Generate a new image using the same prompt
      const imageUrl = await generateImage(currentSlide.imagePrompt, {
        size: 'large',
        style: state.presentationStyle === 'professional' ? 'professional' : 'natural'
      });
      
      // Update the slide with the new image
      const updatedSlides = [...state.slides];
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        generatedImageUrl: imageUrl
      };
      
      updateState({ slides: updatedSlides });
    } catch (error) {
      console.error('Error regenerating image:', error);
    } finally {
      setRegeneratingImage(false);
    }
  };
  
  // Render the slide thumbnail
  const renderSlideThumbnail = (slide: Slide, index: number) => {
    const isActive = index === currentSlideIndex;
    
    return (
      <div 
        key={slide.id}
        className={`flex flex-col p-2 cursor-pointer transition-all ${
          isActive 
            ? 'bg-blue-100 border-blue-500' 
            : 'bg-white hover:bg-gray-100 border-transparent'
        } border-2 rounded-lg`}
        onClick={() => goToSlide(index)}
      >
        <div className="text-xs text-gray-500 mb-1">Slide {index + 1}</div>
        <div 
          className="h-20 border border-gray-200 rounded bg-white flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: state.theme.backgroundColor,
          }}
        >
          {slide.type === 'image' && slide.generatedImageUrl && (
            <img 
              src={slide.generatedImageUrl} 
              alt={slide.title} 
              className="object-cover h-full w-full"
            />
          )}
          {(!slide.generatedImageUrl || slide.type !== 'image') && (
            <div className="p-1 text-xs overflow-hidden text-center">
              <div className="font-bold truncate" style={{ color: state.theme.primaryColor }}>
                {slide.title}
              </div>
              {slide.content.bullets && slide.content.bullets.length > 0 && (
                <div className="text-xxs" style={{ color: state.theme.secondaryColor }}>
                  {slide.content.bullets.length} bullet points
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render current slide in edit mode
  const renderSlideEdit = () => {
    if (!currentSlide) return <div>No slide selected</div>;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            {editingTitle ? (
              <input
                type="text"
                value={currentSlide.title}
                onChange={handleTitleChange}
                onBlur={() => setEditingTitle(false)}
                autoFocus
                className="w-full text-xl font-bold border-b border-blue-300 focus:outline-none focus:border-blue-500 px-2"
              />
            ) : (
              <h2 
                className="text-xl font-bold"
                onClick={() => setEditingTitle(true)}
              >
                {currentSlide.title}
                <span className="ml-2 text-xs text-blue-500">(click to edit)</span>
              </h2>
            )}
            <div className="text-sm text-gray-500">Slide {currentSlideIndex + 1} of {state.slides.length} • Type: {currentSlide.type}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-gray-700">Slide Content</label>
            <button
              onClick={() => setEditingSlide(!editingSlide)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {editingSlide ? 'View Mode' : 'Edit Mode'}
            </button>
          </div>
          
          {currentSlide.type === 'title' && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {editingSlide ? (
                <textarea
                  value={currentSlide.content.mainText || ''}
                  onChange={(e) => handleContentChange(e, 'mainText')}
                  className="w-full h-20 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter main text for title slide..."
                />
              ) : (
                <div className="text-lg text-center font-medium">
                  {currentSlide.content.mainText || 'No main text content'}
                </div>
              )}
            </div>
          )}
          
          {['content', 'conclusion'].includes(currentSlide.type) && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {editingSlide ? (
                <div className="space-y-2">
                  {currentSlide.content.bullets?.map((bullet, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="mr-2">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleBulletChange(idx, e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => removeBulletPoint(idx)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addBulletPoint}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Bullet Point
                  </button>
                </div>
              ) : (
                <ul className="list-disc pl-6 space-y-2">
                  {currentSlide.content.bullets?.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  )) || <li className="text-gray-500">No bullet points</li>}
                </ul>
              )}
            </div>
          )}
          
          {currentSlide.type === 'image' && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Prompt</label>
                {editingSlide ? (
                  <textarea
                    value={currentSlide.imagePrompt || ''}
                    onChange={(e) => {
                      const updatedSlides = [...state.slides];
                      updatedSlides[currentSlideIndex] = {
                        ...currentSlide,
                        imagePrompt: e.target.value
                      };
                      updateState({ slides: updatedSlides });
                    }}
                    className="w-full h-20 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter image description for DALL-E..."
                  />
                ) : (
                  <p className="text-sm bg-gray-100 p-2 rounded">
                    {currentSlide.imagePrompt || 'No image prompt specified'}
                  </p>
                )}
              </div>
              
              <div className="flex justify-center">
                {currentSlide.generatedImageUrl ? (
                  <div className="relative">
                    <img 
                      src={currentSlide.generatedImageUrl} 
                      alt={currentSlide.title} 
                      className="max-h-64 rounded-lg shadow-sm"
                    />
                    {editingSlide && (
                      <button
                        onClick={() => {
                          const updatedSlides = [...state.slides];
                          updatedSlides[currentSlideIndex] = {
                            ...currentSlide,
                            generatedImageUrl: undefined
                          };
                          updateState({ slides: updatedSlides });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-3">No image generated yet</p>
                    {currentSlide.imagePrompt && (
                      <button
                        onClick={regenerateSlideImage}
                        disabled={regeneratingImage}
                        className={`px-4 py-2 rounded ${
                          regeneratingImage 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {regeneratingImage 
                          ? 'Regenerating...' 
                          : 'Regenerate Image with DALL-E'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Presenter Notes</label>
          {editingSlide ? (
            <textarea
              value={currentSlide.notes || ''}
              onChange={(e) => handleContentChange(e, 'notes')}
              className="w-full h-24 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter presenter notes..."
            />
          ) : (
            <div className="border border-gray-200 rounded-lg p-3 bg-yellow-50 text-sm">
              {currentSlide.notes || 'No presenter notes'}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render preview of all slides
  const renderSlidePreview = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Preview: {state.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.slides.map((slide, index) => (
            <div
              key={slide.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div 
                className="bg-gray-100 p-3 font-medium text-sm flex justify-between items-center"
                style={{ backgroundColor: state.theme.primaryColor, color: 'white' }}
              >
                <span>Slide {index + 1}: {slide.title}</span>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                  {slide.type}
                </span>
              </div>
              
              <div className="p-4" style={{ backgroundColor: state.theme.backgroundColor }}>
                {slide.type === 'title' && (
                  <div className="text-center py-6">
                    <h2 
                      className="text-2xl font-bold mb-3"
                      style={{ color: state.theme.primaryColor, fontFamily: state.theme.fontTitle }}
                    >
                      {slide.title}
                    </h2>
                    <p 
                      className="text-lg"
                      style={{ color: state.theme.secondaryColor, fontFamily: state.theme.fontBody }}
                    >
                      {slide.content.mainText}
                    </p>
                  </div>
                )}
                
                {['content', 'conclusion'].includes(slide.type) && (
                  <div>
                    <h3 
                      className="text-lg font-semibold mb-3"
                      style={{ color: state.theme.primaryColor, fontFamily: state.theme.fontTitle }}
                    >
                      {slide.title}
                    </h3>
                    <ul className="space-y-2 pl-5 list-disc">
                      {slide.content.bullets?.map((bullet, idx) => (
                        <li 
                          key={idx}
                          style={{ color: state.theme.secondaryColor, fontFamily: state.theme.fontBody }}
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {slide.type === 'image' && (
                  <div>
                    <h3 
                      className="text-lg font-semibold mb-3"
                      style={{ color: state.theme.primaryColor, fontFamily: state.theme.fontTitle }}
                    >
                      {slide.title}
                    </h3>
                    
                    {slide.generatedImageUrl ? (
                      <div className="flex justify-center">
                        <img 
                          src={slide.generatedImageUrl} 
                          alt={slide.title}
                          className="max-h-48 object-contain rounded" 
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-200 h-32 flex items-center justify-center rounded">
                        <p className="text-gray-500 text-sm">
                          {slide.imagePrompt 
                            ? 'Image not generated yet'
                            : 'No image prompt specified'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {slide.notes && (
                <div className="bg-yellow-50 p-2 text-xs border-t border-yellow-100">
                  <div className="font-medium text-yellow-800">Presenter Notes:</div>
                  <p className="text-yellow-900">{slide.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">{state.title}</h1>
            <p className="text-sm text-gray-500">
              {state.slides.length} slides • {state.targetAudience} • {state.presentationStyle} style
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Back to Prompt
            </button>
            <button
              onClick={onNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export Presentation
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'edit'
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Edit Mode
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'preview'
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Preview All Slides
              </button>
            </div>
            
            <div>
              <button
                onClick={() => setShowRawContent(!showRawContent)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showRawContent ? 'Hide Raw Content' : 'Show Raw Content'}
              </button>
            </div>
          </div>
          
          {/* Show raw content */}
          {showRawContent && (
            <div className="mb-6 bg-gray-800 text-white p-4 rounded-lg overflow-auto max-h-60">
              <pre className="text-xs">{state.rawGeneratedContent}</pre>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Slide thumbnails - only in edit mode */}
            {viewMode === 'edit' && (
              <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-medium text-gray-700 mb-2">Slides</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 max-h-[calc(100vh-250px)] overflow-y-auto p-1">
                  {state.slides.map((slide, index) => renderSlideThumbnail(slide, index))}
                </div>
                
                {/* Navigation controls */}
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={() => goToSlide(currentSlideIndex - 1)}
                    disabled={currentSlideIndex === 0}
                    className={`p-2 rounded ${
                      currentSlideIndex === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ← Prev
                  </button>
                  <span className="p-2 text-sm text-gray-600">
                    Slide {currentSlideIndex + 1} of {state.slides.length}
                  </span>
                  <button
                    onClick={() => goToSlide(currentSlideIndex + 1)}
                    disabled={currentSlideIndex === state.slides.length - 1}
                    className={`p-2 rounded ${
                      currentSlideIndex === state.slides.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
            
            {/* Main content area */}
            <div className={viewMode === 'edit' ? 'lg:col-span-3' : 'lg:col-span-4'}>
              {viewMode === 'edit' ? renderSlideEdit() : renderSlidePreview()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SlideEditor; 