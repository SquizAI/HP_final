import React, { useState } from 'react';
import { BusinessScenario } from '../SmartSelectMain';

interface ScenarioSelectionProps {
  scenarios: BusinessScenario[];
  onSelectScenario: (scenario: BusinessScenario) => void;
}

export const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({
  scenarios,
  onSelectScenario
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  
  // Get unique categories from scenarios
  const categories = Array.from(new Set(scenarios.map(s => s.category)));
  
  // Filter scenarios based on search term and filters
  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = searchTerm === '' || 
      scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || scenario.category === selectedCategory;
    const matchesComplexity = selectedComplexity === null || scenario.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedComplexity(null);
  };
  
  // Handle hover events for scenarios
  const handleScenarioHover = (scenarioId: string | null) => {
    setHoveredScenario(scenarioId);
  };
  
  // Get complexity tooltip text
  const getComplexityTooltip = (complexity: string) => {
    switch(complexity) {
      case 'low': 
        return "Basic scenarios that require straightforward analysis and recommendations. Suitable for testing fundamental AI capabilities.";
      case 'medium': 
        return "Moderate complexity scenarios that involve multiple factors and require some nuanced analysis. Good for evaluating balanced AI performance.";
      case 'high': 
        return "Complex business challenges that require sophisticated analysis, consideration of many variables, and strategic thinking. Tests advanced AI capabilities.";
      default: 
        return "";
    }
  };
  
  // Render a scenario card
  const renderScenarioCard = (scenario: BusinessScenario) => {
    const complexityColor = 
      scenario.complexity === 'low' ? 'bg-green-100 text-green-800 border-green-200' :
      scenario.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
      'bg-red-100 text-red-800 border-red-200';
    
    const isHovered = hoveredScenario === scenario.id;
    
    return (
      <div 
        key={scenario.id}
        className={`
          border rounded-lg overflow-hidden shadow-sm transition-all duration-300 
          ${isHovered ? 'shadow-md transform translate-y-[-4px]' : 'border-gray-200 hover:shadow-md'}
          bg-white cursor-pointer relative
        `}
        onClick={() => onSelectScenario(scenario)}
        onMouseEnter={() => handleScenarioHover(scenario.id)}
        onMouseLeave={() => handleScenarioHover(null)}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-medium text-gray-900 flex-grow">{scenario.title}</h3>
            
            {/* Complexity badge with tooltip */}
            <div className="relative group">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${complexityColor}`}>
                {scenario.complexity.charAt(0).toUpperCase() + scenario.complexity.slice(1)}
              </span>
              
              {/* Tooltip */}
              <div className="absolute z-10 right-0 transform translate-y-2 w-64 hidden group-hover:block">
                <div className="bg-gray-800 text-white text-xs rounded py-1.5 px-2">
                  {getComplexityTooltip(scenario.complexity)}
                  <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -translate-y-1/2 top-0 right-4"></div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
          
          <div className="flex justify-between items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              {scenario.category}
            </span>
            
            <button
              className={`
                text-sm inline-flex items-center px-3 py-1.5 rounded
                ${isHovered ? 'bg-blue-600 text-white' : 'text-blue-600 hover:text-blue-800 hover:underline'}
                transition-colors duration-200
              `}
              onClick={(e) => {
                e.stopPropagation();
                onSelectScenario(scenario);
              }}
              aria-label={`Select ${scenario.title} scenario`}
            >
              <svg className={`h-4 w-4 mr-1 ${isHovered ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Select
            </button>
          </div>
        </div>
        
        {/* Preview prompt indicator */}
        {isHovered && (
          <div className="absolute top-2 right-2">
            <div className="relative group">
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
              {/* Prompt preview tooltip */}
              <div className="absolute z-10 right-0 transform translate-y-2 w-72 hidden group-hover:block">
                <div className="bg-gray-800 text-white text-xs rounded py-2 px-3">
                  <span className="font-semibold block mb-1">Prompt Preview:</span>
                  <span className="italic text-gray-300">{scenario.prompt}</span>
                  <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -translate-y-1/2 top-0 right-4"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Scenario Selection</h2>
          <p className="text-gray-600">
            Choose a business scenario to analyze how different AI models respond to the same prompt.
          </p>
        </div>
        
        {/* Scenario selection tooltip */}
        <div className="mt-4 md:mt-0 md:ml-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-800">AI Challenge Tip</h3>
              <p className="text-xs text-indigo-700 mt-1">
                Choose scenarios based on your business interests or those most relevant to your work. The scenario complexity affects how much reasoning the AI models need to demonstrate.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and filter controls */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          {/* Search input */}
          <div className="flex-grow mb-4 md:mb-0">
            <label htmlFor="search" className="sr-only">Search scenarios</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search business scenarios"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Category filter */}
          <div className="mb-4 md:mb-0">
            <label htmlFor="category" className="sr-only">Category</label>
            <div className="relative">
              <select
                id="category"
                name="category"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {/* Tooltip icon */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
                <div className="relative group">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Complexity filter */}
          <div className="mb-4 md:mb-0">
            <label htmlFor="complexity" className="sr-only">Complexity</label>
            <div className="relative">
              <select
                id="complexity"
                name="complexity"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedComplexity || ''}
                onChange={(e) => setSelectedComplexity(e.target.value === '' ? null : e.target.value)}
              >
                <option value="">All Complexity Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              
              {/* Tooltip icon */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
                <div className="relative group">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reset button */}
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleResetFilters}
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Complexity level guide */}
      <div className="mb-6 bg-white p-3 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Complexity Level Guide</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-100 border border-green-200 mr-1.5"></span>
            <span className="text-xs text-gray-600">Low: Straightforward analysis</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200 mr-1.5"></span>
            <span className="text-xs text-gray-600">Medium: Multi-factor consideration</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-100 border border-red-200 mr-1.5"></span>
            <span className="text-xs text-gray-600">High: Complex strategic thinking</span>
          </div>
        </div>
      </div>
      
      {/* Scenario cards */}
      {filteredScenarios.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No scenarios found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleResetFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map(scenario => renderScenarioCard(scenario))}
        </div>
      )}
    </div>
  );
}; 