import React, { useState } from 'react';
import { SlideMasterState } from './SlidesMasterMain';

interface PasteContentProps {
  state: SlideMasterState;
  updateState: (newState: Partial<SlideMasterState>) => void;
  onContinue: () => void;
  onBack: () => void;
}

const PasteContent: React.FC<PasteContentProps> = ({
  state,
  updateState,
  onContinue,
  onBack
}) => {
  const [content, setContent] = useState(state.pastedContent || '');
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleContinue = () => {
    updateState({ pastedContent: content });
    onContinue();
  };
  
  const handleImportFiles = () => {
    // In a real implementation, this would open a file picker
    alert('This would open a file picker to import documents');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            <svg className="w-8 h-8 inline-block mr-2 text-rose-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 10h8M8 14h4" />
            </svg>
            Paste in
          </h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Add the notes, outline or content you'd like to use
        </p>
        
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Type or paste in content here"
            className="w-full h-96 p-6 rounded-xl focus:outline-none focus:ring-0 resize-none text-gray-700"
          ></textarea>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={handleImportFiles}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            You can also import files
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!content.trim()}
            className={`px-8 py-3 rounded-full flex items-center font-medium transition ${
              content.trim() 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasteContent; 