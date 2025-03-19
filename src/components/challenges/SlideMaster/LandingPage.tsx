import React from 'react';
import { SlideMasterState } from './SlidesMasterMain';

interface LandingPageProps {
  state: SlideMasterState;
  updateState: (newState: Partial<SlideMasterState>) => void;
  onSelectOption: (option: 'paste' | 'generate' | 'import') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  state,
  updateState,
  onSelectOption
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen flex flex-col">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Create with AI
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          How would you like to get started?
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
        {/* Option 1: Paste in text */}
        <div 
          onClick={() => onSelectOption('paste')}
          className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-6 flex flex-col cursor-pointer hover:shadow-lg transition duration-300 transform hover:scale-[1.02]"
        >
          <div className="mb-6 flex-grow">
            <div className="bg-white w-full h-32 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF84B7" strokeWidth="1.5">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M8 10h8M8 14h4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Paste in text</h2>
            <p className="text-gray-600">Create from notes, an outline, or existing content</p>
          </div>
          <div className="text-right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Option 2: Generate */}
        <div 
          onClick={() => onSelectOption('generate')}
          className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl p-6 flex flex-col cursor-pointer hover:shadow-lg transition duration-300 transform hover:scale-[1.02]"
        >
          <div className="mb-4 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full inline-block w-fit">
            <span className="mr-1">⚡</span> Popular
          </div>
          <div className="mb-6 flex-grow">
            <div className="bg-white w-full h-32 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.5">
                <path d="M12 2L2 12 12 22 22 12 12 2z" />
                <path d="M12 2v20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Generate</h2>
            <p className="text-gray-600">Create from a one-line prompt in a few seconds</p>
          </div>
          <div className="text-right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Option 3: Import file */}
        <div 
          onClick={() => onSelectOption('import')}
          className="bg-gradient-to-br from-purple-50 to-fuchsia-100 rounded-xl p-6 flex flex-col cursor-pointer hover:shadow-lg transition duration-300 transform hover:scale-[1.02]"
        >
          <div className="mb-6 flex-grow">
            <div className="bg-white w-full h-32 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.5">
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                <path d="M12 11v6" />
                <path d="M9 14h6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Import file or URL</h2>
            <p className="text-gray-600">Enhance existing docs, presentations, or webpages</p>
          </div>
          <div className="text-right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 