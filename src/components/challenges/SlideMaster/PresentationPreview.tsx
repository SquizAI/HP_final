import React, { useState, useEffect } from 'react';
import { SlideMasterState, Slide, Theme } from './SlidesMasterMain';

// Add an improved loading indicator for image generation
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-white bg-opacity-80 rounded-md p-4">
    <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mb-3"></div>
    <p className="text-gray-700 font-medium text-sm">Generating AI image...</p>
    <p className="text-gray-500 text-xs mt-1">This may take a moment</p>
  </div>
);

interface PresentationPreviewProps {
  state: SlideMasterState;
  updateState: (newState: Partial<SlideMasterState>) => void;
  onNext: () => void;
  onBack: () => void;
  isGenerating?: boolean;
  setIsGenerating?: (isGenerating: boolean) => void;
  error?: string | null;
}

const PresentationPreview: React.FC<PresentationPreviewProps> = ({
  state,
  updateState,
  onNext,
  onBack
}) => {
  // Local state
  const [previewMode, setPreviewMode] = useState<'grid' | 'fullscreen'>('grid');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  
  // Handle keyboard navigation in fullscreen mode
  useEffect(() => {
    if (previewMode === 'fullscreen') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          navigateToSlide(Math.min(currentSlideIndex + 1, state.slides.length - 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          navigateToSlide(Math.max(currentSlideIndex - 1, 0));
        } else if (e.key === 'Escape') {
          setPreviewMode('grid');
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [previewMode, currentSlideIndex, state.slides.length]);
  
  // Navigate to a specific slide
  const navigateToSlide = (index: number) => {
    setCurrentSlideIndex(index);
    updateState({ currentSlideIndex: index });
  };
  
  // Start presentation mode
  const startPresentation = () => {
    setIsPresenting(true);
    setPreviewMode('fullscreen');
    navigateToSlide(0); // Start from the first slide
  };
  
  // End presentation mode
  const endPresentation = () => {
    setIsPresenting(false);
    setPreviewMode('grid');
  };
  
  // Format slide content based on type
  const renderSlideContent = (slide: Slide) => {
    // Default theme in case the state.theme is missing or incomplete
    const defaultTheme: Theme = {
      name: 'Default Theme',
      primaryColor: '#1A4B8C',
      secondaryColor: '#2D6CC0',
      accentColor: '#F39237',
      backgroundColor: '#FFFFFF',
      fontTitle: 'Arial, sans-serif',
      fontBody: 'Arial, sans-serif',
      backgroundStyle: 'solid'
    };
    
    // Use state.theme if available, otherwise use default
    const currentTheme = state.theme || defaultTheme;
    
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col justify-center items-center text-center h-full">
            <h1 className="text-3xl font-bold mb-4">{slide.title}</h1>
            <p className="text-xl">{slide.content.mainText}</p>
          </div>
        );
        
      case 'content':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
            <ul className="space-y-3">
              {(slide.content.bullets || []).map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'image':
        return (
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
            {slide.generatedImageUrl ? (
              <div className="flex-grow flex flex-col items-center justify-center">
                <img 
                  src={slide.generatedImageUrl} 
                  alt={slide.content.imageDescription || 'Slide image'} 
                  className="max-h-[70%] max-w-full object-contain rounded-md"
                />
                {slide.content.imageDescription && (
                  <p className="text-center mt-3 text-sm text-gray-600">
                    {slide.content.imageDescription}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center relative">
                {state.isGeneratingImages ? (
                  <LoadingSpinner />
                ) : (
                  <p className="text-gray-400">No image content</p>
                )}
              </div>
            )}
          </div>
        );
        
      case 'quote':
        return (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <div className="text-5xl text-gray-300 mb-4">"</div>
            <blockquote className="text-xl italic mb-6">
              {slide.content.quote || slide.content.mainText}
            </blockquote>
            {slide.content.source && (
              <cite className="text-lg">— {slide.content.source}</cite>
            )}
          </div>
        );
        
      case 'twoColumn':
        // Split bullets into two columns
        const bullets = slide.content.bullets || [];
        const midpoint = Math.ceil(bullets.length / 2);
        const leftColumn = bullets.slice(0, midpoint);
        const rightColumn = bullets.slice(midpoint);
        
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <ul className="space-y-3">
                  {leftColumn.map((bullet, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  {rightColumn.map((bullet, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'chart':
        if (slide.content.chartData) {
          return (
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: currentTheme.fontTitle }}>{slide.title}</h2>
              <div className="h-64 w-full">
                {/* Chart rendering would go here */}
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Chart visualization would render here based on chart data.
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return <div>No chart data available</div>;
        
      case 'table':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
            {slide.content.tableData ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {slide.content.tableData.headers.map((header, index) => (
                        <th 
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {slide.content.tableData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No table data available</p>
            )}
          </div>
        );
        
      case 'section':
        return (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <h2 className="text-3xl font-bold mb-3">{slide.title}</h2>
            {slide.content.mainText && (
              <p className="text-xl">{slide.content.mainText}</p>
            )}
          </div>
        );
        
      case 'conclusion':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
            <ul className="space-y-3">
              {(slide.content.bullets || []).map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'thankyou':
        return (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <h2 className="text-3xl font-bold mb-6">{slide.title}</h2>
            <p className="text-xl mb-6">{slide.content.mainText}</p>
            {slide.content.contactInfo && (
              <div className="text-lg text-gray-600">{slide.content.contactInfo}</div>
            )}
          </div>
        );
        
      default:
        return <div className="p-4">{slide.content.mainText || 'No content'}</div>;
    }
  };
  
  // Render a slide in the presentation view
  const renderSlide = (slide: Slide, index: number, mode: 'grid' | 'fullscreen') => {
    // Default theme in case the state.theme is missing or incomplete
    const defaultTheme: Theme = {
      name: 'Default Theme',
      primaryColor: '#1A4B8C',
      secondaryColor: '#2D6CC0',
      accentColor: '#F39237',
      backgroundColor: '#FFFFFF',
      fontTitle: 'Arial, sans-serif',
      fontBody: 'Arial, sans-serif',
      backgroundStyle: 'solid'
    };
    
    // Use state.theme if available, otherwise use default
    const currentTheme = state.theme || defaultTheme;
    
    // Define slide classes based on mode
    const slideClasses = mode === 'grid'
      ? 'flex flex-col overflow-hidden rounded shadow-sm h-40 cursor-pointer hover:shadow-md transition-shadow'
      : 'flex flex-col overflow-hidden rounded shadow-md h-[calc(100vh-8rem)] m-auto max-w-4xl';
    
    const contentClasses = mode === 'grid'
      ? 'flex-grow p-2 overflow-hidden'
      : 'flex-grow p-6 overflow-auto';
      
    return (
      <div 
        key={slide.id}
        onClick={mode === 'grid' ? () => {
          setPreviewMode('fullscreen');
          navigateToSlide(index);
        } : undefined}
        className={slideClasses}
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: (state.visualElements || []).includes('shadows') ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          borderRadius: (state.visualElements || []).includes('roundedCorners') ? '0.5rem' : '0.25rem',
          border: (state.visualElements || []).includes('borders') ? `1px solid ${currentTheme.accentColor}` : '1px solid #e5e7eb',
        }}
      >
        {/* Add a loading overlay when generating images */}
        {state.isGeneratingImages && !slide.generatedImageUrl && slide.type !== 'title' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 rounded">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto border-3 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs font-medium text-gray-600">Generating...</p>
            </div>
          </div>
        )}
        
        {/* Slide header */}
        <div 
          className="px-4 py-2 flex justify-between items-center"
          style={{
            backgroundColor: currentTheme.primaryColor,
            color: '#FFFFFF',
          }}
        >
          <span className="text-sm font-medium">{mode === 'grid' ? `Slide ${index + 1}` : state.title}</span>
          {mode === 'fullscreen' && (
            <div className="text-sm">{currentSlideIndex + 1} / {state.slides.length}</div>
          )}
        </div>
        
        {/* Slide content */}
        <div 
          className={contentClasses}
          style={{
            color: currentTheme.secondaryColor,
            fontFamily: currentTheme.fontBody,
            backgroundColor: currentTheme.backgroundColor,
          }}
        >
          {renderSlideContent(slide)}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Presentation Preview</h3>
        <p className="text-sm text-gray-600">
          Review your presentation before finalizing.
        </p>
      </div>
      
      {/* Presentation controls */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          onClick={startPresentation}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Start Presentation
        </button>
        
        <button 
          onClick={() => setShowPresenterNotes(!showPresenterNotes)}
          className={`px-4 py-2 rounded-md transition flex items-center ${
            showPresenterNotes 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {showPresenterNotes ? 'Hide Presenter Notes' : 'Show Presenter Notes'}
        </button>
      </div>
      
      {/* Grid view - thumbnails of all slides */}
      {previewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {state.slides.map((slide, index) => (
            <div key={slide.id} className="flex flex-col">
              {renderSlide(slide, index, 'grid')}
              {showPresenterNotes && slide.notes && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-gray-800">
                  <div className="font-medium text-yellow-800 mb-1">Presenter Notes:</div>
                  {slide.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Fullscreen view - single slide */}
      {previewMode === 'fullscreen' && (
        <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
          {/* Presentation controls */}
          <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={endPresentation}
                className="mr-4 text-gray-300 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="font-medium">{state.title}</h3>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateToSlide(Math.max(currentSlideIndex - 1, 0))}
                disabled={currentSlideIndex === 0}
                className={`p-1 rounded ${
                  currentSlideIndex === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-sm">
                {currentSlideIndex + 1} / {state.slides.length}
              </div>
              
              <button
                onClick={() => navigateToSlide(Math.min(currentSlideIndex + 1, state.slides.length - 1))}
                disabled={currentSlideIndex === state.slides.length - 1}
                className={`p-1 rounded ${
                  currentSlideIndex === state.slides.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Slide content */}
          <div className="flex-grow flex items-center justify-center p-8 overflow-hidden">
            <div className="w-full max-w-5xl aspect-video bg-white shadow-2xl">
              {renderSlide(state.slides[currentSlideIndex], currentSlideIndex, 'fullscreen')}
            </div>
          </div>
          
          {/* Presenter notes (if enabled) */}
          {showPresenterNotes && (
            <div className="bg-yellow-50 border-t border-yellow-200 p-4">
              <div className="max-w-5xl mx-auto">
                <div className="font-medium text-yellow-800 mb-1">Presenter Notes:</div>
                <div className="text-gray-800">
                  {state.slides[currentSlideIndex].notes || 'No notes for this slide.'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
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
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Complete Presentation
        </button>
      </div>
    </div>
  );
};

export default PresentationPreview; 