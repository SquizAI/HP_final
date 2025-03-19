import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlideMasterState } from './SlidesMasterMain';

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

const PresentationLibrary: React.FC = () => {
  const [presentations, setPresentations] = useState<SlideMasterState[]>([]);
  const [filteredPresentations, setFilteredPresentations] = useState<SlideMasterState[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'slides'>('date');
  const [filter, setFilter] = useState('');
  const [selectedPresentation, setSelectedPresentation] = useState<SlideMasterState | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const navigate = useNavigate();

  // Load presentations on component mount
  useEffect(() => {
    const savedPresentations = getSavedPresentations();
    setPresentations(savedPresentations);
    setFilteredPresentations(savedPresentations);
  }, []);

  // Filter presentations when filter or sort changes
  useEffect(() => {
    let result = [...presentations];
    
    // Apply filter
    if (filter) {
      const searchTerm = filter.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm) || 
        p.targetAudience?.toLowerCase().includes(searchTerm) ||
        p.theme.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sort
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'slides') {
      result.sort((a, b) => b.slides.length - a.slides.length);
    }
    
    setFilteredPresentations(result);
  }, [filter, sortBy, presentations]);

  // View presentation details
  const viewPresentation = (presentation: SlideMasterState) => {
    setSelectedPresentation(presentation);
    setIsDetailsOpen(true);
  };

  // Close details modal
  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPresentation(null);
  };

  // Delete a presentation
  const deletePresentation = (title: string) => {
    const updatedPresentations = presentations.filter(p => p.title !== title);
    setPresentations(updatedPresentations);
    localStorage.setItem('savedPresentations', JSON.stringify(updatedPresentations));
    
    // Close details if the deleted presentation was being viewed
    if (selectedPresentation && selectedPresentation.title === title) {
      closeDetails();
    }
  };

  // Navigate back to challenge
  const goBack = () => {
    navigate('/challenges/slide-master');
  };

  // Create a new presentation
  const createNew = () => {
    navigate('/challenges/slide-master/new');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Presentations</h1>
            <p className="mt-1 text-gray-500">
              {presentations.length} {presentations.length === 1 ? 'presentation' : 'presentations'} saved locally
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={goBack}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Challenge
            </button>
            <button
              onClick={createNew}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New
            </button>
          </div>
        </div>
        
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search presentations..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-gray-700">Sort by:</span>
            <select
              className="border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'slides')}
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="slides">Slides</option>
            </select>
          </div>
        </div>
        
        {/* Presentations Grid */}
        {filteredPresentations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {filter ? (
              <>
                <p className="text-xl font-medium text-gray-700 mb-2">No matching presentations found</p>
                <p className="text-gray-500">Try changing your search criteria</p>
              </>
            ) : (
              <>
                <p className="text-xl font-medium text-gray-700 mb-2">No presentations saved yet</p>
                <p className="text-gray-500 mb-4">Create your first presentation to get started</p>
                <button 
                  onClick={createNew} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Presentation
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPresentations.map((presentation, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="h-40 flex items-center justify-center p-4 cursor-pointer"
                  style={{
                    background: presentation.theme.backgroundStyle === 'gradient' 
                      ? `linear-gradient(135deg, ${presentation.theme.primaryColor} 0%, ${presentation.theme.secondaryColor} 100%)`
                      : presentation.theme.backgroundColor
                  }}
                  onClick={() => viewPresentation(presentation)}
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
                    <div className="flex justify-between items-center">
                      <span>{presentation.slides.length} slides</span>
                      <span className="text-xs text-gray-500">{new Date(presentation.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 text-xs truncate">
                      Theme: {presentation.theme.name}
                    </div>
                  </div>
                  <div className="flex mt-3 gap-2">
                    <button 
                      className="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md"
                      onClick={() => viewPresentation(presentation)}
                    >
                      View
                    </button>
                    <button 
                      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      onClick={() => deletePresentation(presentation.title)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Presentation Details Modal */}
        {isDetailsOpen && selectedPresentation && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="presentation-detail-modal" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeDetails}></div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-2xl leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                        {selectedPresentation.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-600 text-sm">
                          {selectedPresentation.slides.length} slides
                        </div>
                        <div className="bg-purple-50 px-3 py-1 rounded-full text-purple-600 text-sm">
                          Theme: {selectedPresentation.theme.name}
                        </div>
                        <div className="bg-green-50 px-3 py-1 rounded-full text-green-600 text-sm">
                          {selectedPresentation.targetAudience || selectedPresentation.audience || "General"} audience
                        </div>
                        <div className="bg-yellow-50 px-3 py-1 rounded-full text-yellow-600 text-sm">
                          Created: {new Date(selectedPresentation.lastUpdated).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Slides Preview</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                          {selectedPresentation.slides.map((slide, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden">
                              <div 
                                className="h-28 flex items-center justify-center p-2 relative"
                                style={{
                                  background: slide.generatedImageUrl 
                                    ? `url(${slide.generatedImageUrl}) center/cover` 
                                    : (selectedPresentation.theme.backgroundStyle === 'gradient' 
                                      ? `linear-gradient(135deg, ${selectedPresentation.theme.primaryColor} 0%, ${selectedPresentation.theme.secondaryColor} 100%)` 
                                      : selectedPresentation.theme.backgroundColor)
                                }}
                              >
                                {!slide.generatedImageUrl && (
                                  <div 
                                    className="absolute inset-0 flex items-center justify-center p-2 bg-black bg-opacity-40"
                                  >
                                    <h3 
                                      className="text-white text-xs font-medium text-center"
                                      style={{ fontFamily: selectedPresentation.theme.fontTitle }}
                                    >
                                      {slide.title}
                                    </h3>
                                  </div>
                                )}
                              </div>
                              <div className="px-2 py-1 text-center text-xs text-gray-600 bg-white">
                                Slide {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="button" 
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      // Logic to edit or view the presentation would go here
                      closeDetails();
                    }}
                  >
                    Edit Presentation
                  </button>
                  <button 
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeDetails}
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      deletePresentation(selectedPresentation.title);
                      closeDetails();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationLibrary; 