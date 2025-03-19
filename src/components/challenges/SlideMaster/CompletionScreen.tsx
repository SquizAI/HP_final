import React, { useState, useEffect } from 'react';
import { SlideMasterState } from './SlidesMasterMain';
import { useNavigate } from 'react-router-dom';
import { saveChallengeSlidemaster } from '../../../utils/userDataManager';

interface CompletionScreenProps {
  state: SlideMasterState;
  onRestart: () => void;
  challengeId?: string;
}

// Function to get saved presentations from localStorage
const getSavedPresentations = () => {
  try {
    const savedData = localStorage.getItem('savedPresentations');
    return savedData ? JSON.parse(savedData) : [];
  } catch (e) {
    console.error('Error getting saved presentations:', e);
    return [];
  }
};

// Function to save a presentation to localStorage
const savePresentation = (presentation: SlideMasterState) => {
  try {
    const savedPresentations = getSavedPresentations();
    
    // Check if this presentation already exists (by title) and update it instead
    const existingIndex = savedPresentations.findIndex((p: SlideMasterState) => p.title === presentation.title);
    
    if (existingIndex >= 0) {
      savedPresentations[existingIndex] = {
        ...presentation,
        lastUpdated: new Date().toISOString()
      };
    } else {
      savedPresentations.push({
        ...presentation,
        lastUpdated: new Date().toISOString()
      });
    }
    
    localStorage.setItem('savedPresentations', JSON.stringify(savedPresentations));
    return true;
  } catch (e) {
    console.error('Error saving presentation:', e);
    return false;
  }
};

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  state,
  onRestart,
  challengeId = 'slide-master'
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'pptx' | 'images'>('pptx');
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedPresentations, setSavedPresentations] = useState<SlideMasterState[]>([]);
  const navigate = useNavigate();
  
  // Load saved presentations on component mount
  useEffect(() => {
    setSavedPresentations(getSavedPresentations());
    
    // Also save the current presentation and track completion
    const success = savePresentation(state);
    if (success) {
      setIsSaved(true);
      
      // Track challenge completion
      saveChallengeSlidemaster(
        challengeId,
        state.title,
        state.theme.name,
        state.slides.length,
        state.slides.filter(slide => slide.generatedImageUrl).length
      );
    }
  }, [state, challengeId]);
  
  // Simulate export functionality
  const handleExport = () => {
    setExporting(true);
    
    // Simulate export delay
    setTimeout(() => {
      setExporting(false);
      setExportComplete(true);
      
      // Reset export complete status after 3 seconds
      setTimeout(() => {
        setExportComplete(false);
      }, 3000);
    }, 2000);
  };
  
  // Navigate to another challenge
  const navigateToChallenge = (challengePath: string) => {
    navigate(challengePath);
  };
  
  // Navigate to the presentation library
  const viewAllPresentations = () => {
    navigate('/challenges/slide-master/library');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Presentation Complete!</h1>
          <p className="text-xl text-gray-600">
            Your AI-generated presentation is ready to download or share
          </p>
          <div className="mt-4 inline-flex gap-2">
            <button 
              onClick={viewAllPresentations}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              View All Presentations
            </button>
            <button 
              onClick={() => navigate('/challenges')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.3 1.5A1.5 1.5 0 008.8 0H4.5A1.5 1.5 0 003 1.5v4.3a1.5 1.5 0 001.5 1.5h4.3a1.5 1.5 0 001.5-1.5V1.5zM10.3 12.8a1.5 1.5 0 00-1.5-1.5H4.5a1.5 1.5 0 00-1.5 1.5v4.3A1.5 1.5 0 004.5 20h4.3a1.5 1.5 0 001.5-1.5v-4.3zM20 10.3A1.5 1.5 0 0018.5 8.8h-4.3a1.5 1.5 0 00-1.5 1.5v4.3a1.5 1.5 0 001.5 1.5h4.3a1.5 1.5 0 001.5-1.5v-4.3z" />
              </svg>
              Go to Challenges
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Presentation summary */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-8">
            <h2 className="text-2xl font-bold mb-4">{state.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-white bg-opacity-20 rounded-md px-3 py-1.5">
                <span className="font-medium">{state.slides.length}</span> Slides
              </div>
              <div className="bg-white bg-opacity-20 rounded-md px-3 py-1.5">
                <span className="font-medium">{state.slides.filter(slide => slide.generatedImageUrl).length}</span> Images
              </div>
              <div className="bg-white bg-opacity-20 rounded-md px-3 py-1.5">
                <span className="font-medium">{state.theme.name}</span> Theme
              </div>
              <div className="bg-white bg-opacity-20 rounded-md px-3 py-1.5">
                <span className="font-medium">{state.presentationStyle}</span> Style
              </div>
            </div>
            {isSaved && (
              <div className="mt-4 text-sm bg-green-500 bg-opacity-20 inline-flex items-center px-3 py-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Saved locally
              </div>
            )}
          </div>
          
          {/* Presentation preview */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Presentation Preview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {state.slides.slice(0, 6).map((slide, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div 
                    className="h-32 flex items-center justify-center p-4 relative"
                    style={{
                      background: slide.generatedImageUrl 
                        ? `url(${slide.generatedImageUrl}) center/cover` 
                        : (state.theme.backgroundStyle === 'gradient' 
                            ? `linear-gradient(135deg, ${state.theme.primaryColor} 0%, ${state.theme.secondaryColor} 100%)` 
                            : state.theme.backgroundColor)
                    }}
                  >
                    {!slide.generatedImageUrl && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-40"
                      >
                        <h3 
                          className="text-white text-sm font-medium text-center"
                          style={{ fontFamily: state.theme.fontTitle }}
                        >
                          {slide.title}
                        </h3>
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-center text-xs text-gray-600">
                    Slide {index + 1}: {slide.type.charAt(0).toUpperCase() + slide.type.slice(1)}
                  </div>
                </div>
              ))}
              {state.slides.length > 6 && (
                <div className="border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 h-32">
                  <div className="text-gray-500 text-sm">+{state.slides.length - 6} more slides</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Export options */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  exportFormat === 'pptx' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setExportFormat('pptx')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">PowerPoint</h4>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Export as PowerPoint (.pptx) for editing in Microsoft PowerPoint</p>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  exportFormat === 'pdf' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setExportFormat('pdf')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">PDF</h4>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Export as PDF for easy sharing and printing</p>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  exportFormat === 'images' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setExportFormat('images')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Image Pack</h4>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Export as individual images for use in other tools</p>
              </div>
            </div>
            
            {/* Export button */}
            <div className="flex justify-between items-center">
              <button
                onClick={onRestart}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Another Presentation
              </button>
              
              <button
                onClick={handleExport}
                disabled={exporting}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  exporting || exportComplete
                    ? 'bg-green-500'
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {exporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : exportComplete ? (
                  <>
                    <svg className="-ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Exported!
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Export as {exportFormat.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Other presentations */}
        {savedPresentations.length > 1 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Other Presentations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPresentations
                .filter(p => p.title !== state.title)
                .slice(0, 3)
                .map((presentation, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div 
                      className="h-32 flex items-center justify-center p-4"
                      style={{
                        background: presentation.theme.backgroundStyle === 'gradient' 
                          ? `linear-gradient(135deg, ${presentation.theme.primaryColor} 0%, ${presentation.theme.secondaryColor} 100%)`
                          : presentation.theme.backgroundColor
                      }}
                    >
                      <h3 
                        className="text-center text-lg font-medium"
                        style={{ 
                          color: presentation.theme.backgroundStyle === 'gradient' ? '#fff' : presentation.theme.primaryColor,
                          fontFamily: presentation.theme.fontTitle
                        }}
                      >
                        {presentation.title}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-gray-600 mb-2">
                        {presentation.slides.length} slides • Created {new Date(presentation.lastUpdated).toLocaleDateString()}
                      </div>
                      <button 
                        className="w-full mt-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                        onClick={() => {/* View presentation functionality */}}
                      >
                        View Presentation
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {savedPresentations.length > 4 && (
              <div className="text-center mt-6">
                <button 
                  onClick={viewAllPresentations}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all {savedPresentations.length} presentations →
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Next challenges section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Try Another Challenge</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigateToChallenge('/challenges/content-transformer')}
            >
              <div className="h-20 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <h3 className="text-white text-lg font-medium">Content Transformer</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">
                  Transform content between different formats and optimize it for various platforms.
                </p>
              </div>
            </div>
            <div 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigateToChallenge('/challenges/social-media-strategist')}
            >
              <div className="h-20 bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center">
                <h3 className="text-white text-lg font-medium">Social Media Strategist</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">
                  Create engaging social media content and marketing campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen; 