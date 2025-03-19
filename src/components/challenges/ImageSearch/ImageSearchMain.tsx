import React, { useState, useEffect } from 'react';
import { Upload, Search, Image as ImageIcon, RefreshCw, Info, Trash2 } from 'lucide-react';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import axios from 'axios';
import ImageUploader from './components/ImageUploader';
import SearchResults from './components/SearchResults';
import SampleImages from './components/SampleImages';

// Import Gemini API configuration
import { getGeminiHeaders } from '../../../services/apiConfig';

// Define the search result interface
interface SearchSuggestion {
  query: string;
  purpose: string;
}

interface SearchResult {
  main_subject: string;
  search_queries: string[];
  description: string;
  visual_elements?: string[];
  search_suggestions?: SearchSuggestion[];
  categories?: string[];
  timestamp?: string;
  image_type?: string;
}

// Main component
const ImageSearchMain: React.FC = () => {
  // User progress tracking
  const [userProgress, setUserProgress] = useUserProgress();
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // State for managing the challenge flow
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string>('');
  const [searchCount, setSearchCount] = useState<number>(0);
  
  // Check if challenge is already completed
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-image-search')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Handle image upload
  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setSearchResults(null);
    setError(null);
  };
  
  // Clear the current image
  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setSearchResults(null);
    setError(null);
  };
  
  // Handle sample image selection
  const handleSampleImageSelect = (imageUrl: string) => {
    // Fetch the image from URL and convert to File
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `sample-${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleImageChange(file);
      })
      .catch(err => {
        console.error('Error loading sample image:', err);
        setError('Failed to load sample image. Please try uploading your own image.');
      });
  };
  
  // Search based on the image using Google Gemini 2.0 Flash
  const searchWithImage = async () => {
    if (!imageFile) {
      setError('Please upload or take a photo first.');
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      // Convert the image to base64
      const base64Image = await toBase64(imageFile);
      
      // Call the Gemini 2.0 Flash API
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-vision:generateContent',
        {
          contents: [
            {
              parts: [
                { 
                  text: "Look at this image and generate search queries that would help find more information about the main subject. Return a JSON with this structure: {\"main_subject\": string, \"search_queries\": [string], \"description\": string, \"visual_elements\": [string], \"search_suggestions\": [{\"query\": string, \"purpose\": string}]}. Also include potential categories and related topics a user might be interested in." 
                },
                {
                  inline_data: {
                    mime_type: imageFile.type,
                    data: base64Image.split(',')[1]
                  }
                }
              ]
            }
          ],
          generation_config: {
            temperature: 0.2,
            top_p: 1,
            top_k: 32,
            max_output_tokens: 1024,
          }
        },
        {
          headers: getGeminiHeaders()
        }
      );
      
      // Extract the JSON from the response
      const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse the JSON (might be surrounded by backticks or other formatting)
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        try {
          const parsedResults = JSON.parse(jsonStr);
          
          // Validate and structure the results
          if (parsedResults.main_subject && parsedResults.search_queries && Array.isArray(parsedResults.search_queries)) {
            // Enhance the results with some additional info
            const enhancedResults = {
              ...parsedResults,
              timestamp: new Date().toISOString(),
              image_type: imageFile.type,
              search_queries: parsedResults.search_queries.slice(0, 10), // Limit to 10 queries
              visual_elements: parsedResults.visual_elements || [],
              search_suggestions: parsedResults.search_suggestions || [],
              categories: parsedResults.categories || []
            };
            
            setSearchResults(enhancedResults);
            setSearchCount(prev => prev + 1);
          } else {
            throw new Error('Invalid response format');
          }
        } catch (parseError) {
          console.error('Error parsing Gemini response:', parseError);
          throw new Error('Could not parse search results from response');
        }
      } else {
        throw new Error('Could not find JSON in response');
      }
    } catch (err) {
      console.error('Error in image search:', err);
      setError('Failed to perform search based on the image. Please try again or try with a different image.');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Helper function to convert file to base64
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  // Handle completing the challenge
  const handleCompleteChallenge = () => {
    if (!searchFeedback.trim()) {
      setError('Please provide feedback about the image search experience before completing.');
      return;
    }
    
    if (searchCount < 2) {
      setError('Please search at least 2 different images before completing the challenge.');
      return;
    }
    
    const wasCompleted = markChallengeAsCompleted('challenge-image-search');
    
    if (wasCompleted) {
      setIsCompleted(true);
      setCompletionMessage('Challenge completed! You\'ve explored AI-powered visual search!');
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setCompletionMessage(null);
      }, 5000);
    }
  };
  
  // Execute a search query in a new tab
  const executeSearch = (query: string) => {
    if (!query) return;
    
    // Encode the query for use in a URL
    const encodedQuery = encodeURIComponent(query);
    
    // Open a new tab with the search query
    window.open(`https://www.google.com/search?q=${encodedQuery}`, '_blank');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-6 text-white">
          <div className="flex items-center mb-2">
            <Search size={36} className="mr-3" />
            <h1 className="text-3xl font-bold">Visual Search Explorer</h1>
          </div>
          <p className="text-lg opacity-90">
            Upload an image and discover search queries, visual elements, and information about what you see
          </p>
        </div>
        
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {/* Completion Message */}
          {completionMessage && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
              {completionMessage}
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Visual Search Challenge</h2>
            <p className="text-gray-600 mb-6">
              Upload an image and see how AI can generate search queries and information about what's in the image.
            </p>
            
            {/* Image upload section */}
            <ImageUploader 
              onImageChange={handleImageChange}
              imagePreview={imagePreview}
              clearImage={clearImage}
            />
            
            {/* Search button */}
            {imagePreview && !searchResults && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={searchWithImage}
                  disabled={isSearching || !imagePreview}
                  className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                    isSearching || !imagePreview ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSearching ? (
                    <>
                      <RefreshCw size={20} className="mr-2 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Search size={20} className="mr-2" />
                      Generate Search Queries
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Search results */}
            {searchResults && (
              <SearchResults 
                results={searchResults}
                onExecuteSearch={executeSearch}
              />
            )}
          </div>
          
          {/* Sample images */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Sample Images to Try</h3>
            <p className="text-gray-600 mb-4">
              Don't have an image handy? Try one of these sample images to test the visual search.
            </p>
            <SampleImages onSelectImage={handleSampleImageSelect} />
          </div>
          
          {/* User feedback section */}
          {(searchCount >= 1 || searchResults) && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-3 text-gray-800">Your Feedback</h3>
              <p className="text-gray-600 mb-4">
                Tell us about your experience with the AI-powered visual search:
              </p>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you think of the search queries generated? (required to complete)
                </label>
                <textarea
                  value={searchFeedback}
                  onChange={(e) => setSearchFeedback(e.target.value)}
                  placeholder="e.g., The search queries were relevant and helped me find what I was looking for..."
                  className="w-full border border-gray-300 rounded-md p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
          
          {/* Complete challenge button */}
          {searchCount >= 1 && (
            <div className="flex justify-between">
              <button
                onClick={clearImage}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Try Another Image
              </button>
              
              <button
                onClick={handleCompleteChallenge}
                disabled={!searchFeedback.trim() || isCompleted || searchCount < 2}
                className={`px-6 py-2 rounded-md text-white ${
                  !searchFeedback.trim() || isCompleted || searchCount < 2
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isCompleted ? "Challenge Completed!" : "Complete Challenge"}
              </button>
            </div>
          )}
          
          {/* Challenge tips */}
          <div className="mt-8 bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <Info size={20} className="text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Challenge Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Try images with distinct objects or landmarks</li>
                  <li>Complex scenes with multiple elements can generate diverse search queries</li>
                  <li>Click on the generated queries to see search results</li>
                  <li>Consider how visual search might be useful in different contexts</li>
                  <li>Compare the AI's description with the actual content of the image</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSearchMain; 