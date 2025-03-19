import React, { useState } from 'react';
import { Idea } from './BrainstormBuddyMain';

// Creativity technique interface
interface CreativityTechnique {
  id: string;
  name: string;
  description: string;
  example: string;
}

interface IdeaGenerationProps {
  ideas: Idea[];
  problemStatement: string;
  selectedCategory: string;
  onSelectIdea: (idea: Idea) => void;
  onGenerateImplementation: () => Promise<void>;
  onBack: () => void;
  selectedIdea: Idea | null;
  isGenerating: boolean;
  creativityTechniques: CreativityTechnique[];
  error?: string;
}

// Fun ratings for ideas
const IDEA_RATINGS = [
  "Genius Level: Einstein would be jealous!",
  "Game-Changer: You might want to patent this one!",
  "Eureka Moment: Archimedes would be proud!",
  "Mind = Blown: This could rewrite the rulebook!",
  "Revolutionary: The committee will see you now!",
  "Bold Move: Fortune favors the brave!"
];

const IdeaGeneration: React.FC<IdeaGenerationProps> = ({
  ideas,
  problemStatement,
  selectedCategory,
  onSelectIdea,
  onGenerateImplementation,
  onBack,
  selectedIdea,
  isGenerating,
  creativityTechniques,
  error
}) => {
  const [activeTechniqueId, setActiveTechniqueId] = useState<string | null>(null);
  const [showIdeasHelp, setShowIdeasHelp] = useState(false);
  
  // Get a random rating for an idea
  const getRandomRating = () => {
    const randomIndex = Math.floor(Math.random() * IDEA_RATINGS.length);
    return IDEA_RATINGS[randomIndex];
  };
  
  // Toggle the creativity technique info panel
  const toggleTechnique = (id: string) => {
    if (activeTechniqueId === id) {
      setActiveTechniqueId(null);
    } else {
      setActiveTechniqueId(id);
    }
  };
  
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-blue-800 flex items-center">
          <span className="mr-2">💡</span>
          Creative Ideas for Your Challenge
        </h2>
        <p className="text-gray-700 mt-2">
          Review these AI-generated ideas for your problem: <span className="font-medium">{problemStatement}</span>
        </p>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-lg text-red-800 animate-pulse">
          <div className="flex">
            <span className="text-xl mr-2">🚨</span>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {selectedIdea ? (
        <div className="mb-8">
          <div className="bg-white border-2 border-blue-500 rounded-lg p-6 shadow-lg mb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{selectedIdea.title}</h3>
              {selectedIdea.aiRating && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedIdea.aiRating}/100
                </div>
              )}
            </div>
            
            <p className="text-gray-700 mb-4">{selectedIdea.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Potential Benefits
                </h4>
                <ul className="space-y-1">
                  {selectedIdea.pros.map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-600">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <span className="text-red-500 mr-2">!</span>
                  Potential Challenges
                </h4>
                <ul className="space-y-1">
                  {selectedIdea.cons.map((con, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span className="text-gray-600">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {selectedIdea.tags && selectedIdea.tags.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedIdea.inspirationSource && (
              <div className="mb-4 text-sm text-gray-600">
                <span className="font-medium">Inspired by:</span> {selectedIdea.inspirationSource}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <button
                className="text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => onSelectIdea({...selectedIdea, isSelected: false})}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to ideas
              </button>
              
              <button
                className={`px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 
                  transition-all hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={onGenerateImplementation}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Plan...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📝</span>
                    Create Implementation Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <span className="mr-2">💭</span>
              Generated Ideas
            </h3>
            
            <button
              className="text-sm text-blue-600 flex items-center hover:text-blue-800"
              onClick={() => setShowIdeasHelp(!showIdeasHelp)}
            >
              <span className="mr-1">{showIdeasHelp ? 'Hide' : 'Show'}</span>
              Ideas Help
            </button>
          </div>
          
          {showIdeasHelp && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">How to Select the Best Idea</h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Consider both pros and cons - the idea with the most pros isn't always the best</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Think about feasibility - can you realistically implement this idea?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Consider impact - which idea would make the biggest difference?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Trust your intuition - sometimes the most exciting idea is the right one</span>
                </li>
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:border-blue-300 cursor-pointer"
                onClick={() => onSelectIdea({...idea, isSelected: true})}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-medium text-gray-800">{idea.title}</h4>
                  {idea.aiRating && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Rating: {idea.aiRating}/100
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{idea.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <span className="text-green-500 mr-1">✓</span>
                      Pros
                    </h5>
                    <ul className="text-sm space-y-1">
                      {idea.pros.slice(0, 2).map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-1">•</span>
                          <span className="text-gray-600">{pro}</span>
                        </li>
                      ))}
                      {idea.pros.length > 2 && (
                        <li className="text-blue-600 text-sm">+{idea.pros.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <span className="text-red-500 mr-1">!</span>
                      Cons
                    </h5>
                    <ul className="text-sm space-y-1">
                      {idea.cons.slice(0, 2).map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-1">•</span>
                          <span className="text-gray-600">{con}</span>
                        </li>
                      ))}
                      {idea.cons.length > 2 && (
                        <li className="text-blue-600 text-sm">+{idea.cons.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {idea.tags && idea.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {idea.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔄</span>
          Creativity Techniques
        </h3>
        
        <div className="bg-white border border-gray-200 rounded-lg">
          {creativityTechniques.map((technique) => (
            <div key={technique.id} className="border-b border-gray-200 last:border-b-0">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleTechnique(technique.id)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">{technique.name}</h4>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${
                      activeTechniqueId === technique.id ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {activeTechniqueId === technique.id && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600 mb-2">{technique.description}</p>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Example</h5>
                    <p className="text-sm text-gray-600">{technique.example}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onBack}
        >
          Back to Problem Definition
        </button>
      </div>
    </div>
  );
};

export default IdeaGeneration; 