import React, { useState } from 'react';
import { Search, ExternalLink, List, Tag, Info, Hash, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchSuggestion {
  query: string;
  purpose: string;
}

interface SearchResultsProps {
  results: {
    main_subject: string;
    search_queries: string[];
    description: string;
    visual_elements?: string[];
    search_suggestions?: SearchSuggestion[];
    categories?: string[];
    timestamp?: string;
  };
  onExecuteSearch: (query: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onExecuteSearch }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("search_queries");
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Search size={20} className="text-blue-600 mr-2" />
          Search Results for
          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {results.main_subject}
          </span>
        </h3>
      </div>
      
      {/* Main description */}
      <div className="mb-4 p-3 bg-white rounded-md shadow-sm">
        <p className="text-gray-700">{results.description}</p>
      </div>
      
      {/* Search queries section */}
      <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
        <div 
          className="p-3 bg-blue-50 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('search_queries')}
        >
          <div className="flex items-center">
            <Search size={18} className="text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-800">Search Queries</h4>
          </div>
          <button className="text-blue-600">
            {expandedSection === 'search_queries' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        
        {expandedSection === 'search_queries' && (
          <div className="p-3 bg-white">
            <p className="text-sm text-gray-600 mb-3">
              Click on any query to search for it on Google:
            </p>
            <div className="flex flex-wrap gap-2">
              {results.search_queries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => onExecuteSearch(query)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md flex items-center"
                >
                  {query}
                  <ExternalLink size={14} className="ml-1.5 opacity-70" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Visual elements section */}
      {results.visual_elements && results.visual_elements.length > 0 && (
        <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
          <div 
            className="p-3 bg-purple-50 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('visual_elements')}
          >
            <div className="flex items-center">
              <List size={18} className="text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-800">Visual Elements</h4>
            </div>
            <button className="text-purple-600">
              {expandedSection === 'visual_elements' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          
          {expandedSection === 'visual_elements' && (
            <div className="p-3 bg-white">
              <p className="text-sm text-gray-600 mb-3">
                Key visual elements detected in the image:
              </p>
              <div className="flex flex-wrap gap-2">
                {results.visual_elements.map((element, index) => (
                  <div key={index} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md">
                    {element}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Search suggestions section */}
      {results.search_suggestions && results.search_suggestions.length > 0 && (
        <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
          <div 
            className="p-3 bg-green-50 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('search_suggestions')}
          >
            <div className="flex items-center">
              <Info size={18} className="text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">Search Suggestions</h4>
            </div>
            <button className="text-green-600">
              {expandedSection === 'search_suggestions' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          
          {expandedSection === 'search_suggestions' && (
            <div className="p-3 bg-white">
              <p className="text-sm text-gray-600 mb-3">
                Additional search suggestions with specific purposes:
              </p>
              <div className="space-y-2">
                {results.search_suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start">
                    <button
                      onClick={() => onExecuteSearch(suggestion.query)}
                      className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-md flex items-center"
                    >
                      {suggestion.query}
                      <ExternalLink size={14} className="ml-1.5 opacity-70" />
                    </button>
                    <ArrowRight size={16} className="mx-2 text-gray-400 mt-1.5" />
                    <div className="text-sm text-gray-600 mt-1">
                      {suggestion.purpose}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Categories section */}
      {results.categories && results.categories.length > 0 && (
        <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
          <div 
            className="p-3 bg-yellow-50 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('categories')}
          >
            <div className="flex items-center">
              <Tag size={18} className="text-yellow-600 mr-2" />
              <h4 className="font-medium text-yellow-800">Categories</h4>
            </div>
            <button className="text-yellow-600">
              {expandedSection === 'categories' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          
          {expandedSection === 'categories' && (
            <div className="p-3 bg-white">
              <p className="text-sm text-gray-600 mb-3">
                Relevant categories for this image:
              </p>
              <div className="flex flex-wrap gap-2">
                {results.categories.map((category, index) => (
                  <div key={index} className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-md flex items-center">
                    <Hash size={14} className="mr-1.5" />
                    {category}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p><strong>Tip:</strong> Click on any search query to open a Google search for that term.</p>
      </div>
    </div>
  );
};

export default SearchResults; 