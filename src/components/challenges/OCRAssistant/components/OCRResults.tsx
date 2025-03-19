import React, { useState } from 'react';
import { FileText, Copy, Edit3, Save, CheckCircle, Award } from 'lucide-react';

interface OCRResultsProps {
  originalText: string;
  editedText: string;
  onTextEdit: (text: string) => void;
  onComplete?: () => void;
  isCompleted?: boolean;
  ocrCount?: number;
  handwritingTested?: boolean;
  imagePreview?: string | null;
  isHandwriting?: boolean;
}

const OCRResults: React.FC<OCRResultsProps> = ({ 
  originalText, 
  editedText, 
  onTextEdit,
  onComplete,
  isCompleted = false,
  ocrCount = 0,
  handwritingTested = false,
  imagePreview = null,
  isHandwriting = false
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
  // Handle copying text to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(editedText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };
  
  // Handle entering edit mode
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  
  // Handle saving changes
  const handleSaveChanges = () => {
    setIsEditing(false);
  };
  
  // Handle text changes in the textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextEdit(e.target.value);
  };
  
  // Check if challenge can be completed
  const canCompleteChallenge = ocrCount >= 2 && handwritingTested && !isCompleted && onComplete;
  
  return (
    <div className="mt-2">
      {/* Image preview (if available) */}
      {imagePreview && (
        <div className="mb-6 flex flex-col items-center">
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Processed Image" 
              className="rounded-lg max-h-[300px] max-w-full border border-gray-200"
            />
            {isHandwriting && (
              <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                Handwritten
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <FileText size={20} className="text-indigo-600 mr-2" />
          Extracted Text
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCopyText}
            className="p-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors flex items-center"
            title="Copy to clipboard"
          >
            {copySuccess ? (
              <>
                <CheckCircle size={16} className="mr-1 text-green-600" />
                <span className="text-sm text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} className="mr-1" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>
          
          {!isEditing ? (
            <button
              onClick={handleStartEditing}
              className="p-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors flex items-center"
              title="Edit text"
            >
              <Edit3 size={16} className="mr-1" />
              <span className="text-sm">Edit</span>
            </button>
          ) : (
            <button
              onClick={handleSaveChanges}
              className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors flex items-center"
              title="Save changes"
            >
              <Save size={16} className="mr-1" />
              <span className="text-sm">Save</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={handleTextChange}
            className="w-full p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-mono"
            placeholder="Edit the extracted text here..."
          />
        ) : (
          <div className="p-4 min-h-[200px] whitespace-pre-wrap text-gray-700 font-mono">
            {editedText || 'No text extracted.'}
          </div>
        )}
      </div>
      
      {originalText !== editedText && !isEditing && (
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <CheckCircle size={12} className="mr-1 text-green-600" /> 
          You've edited the text for improved accuracy
        </div>
      )}
      
      {isHandwriting && !isEditing && (
        <div className="mt-2 text-xs text-amber-600 flex items-center">
          <CheckCircle size={12} className="mr-1" /> 
          Handwritten text successfully processed
        </div>
      )}
      
      {canCompleteChallenge && (
        <div className="mt-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-indigo-800 flex items-center mb-2">
              <Award className="h-4 w-4 mr-2" />
              Challenge Progress
            </h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li className="flex items-center">
                <CheckCircle size={12} className="mr-2 text-green-600" />
                Extracted text from {ocrCount} different images
              </li>
              <li className="flex items-center">
                <CheckCircle size={12} className="mr-2 text-green-600" />
                Successfully processed handwritten text
              </li>
            </ul>
            <button
              onClick={onComplete}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Complete Challenge
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <div className="flex items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Tips for OCR Accuracy:</h4>
        </div>
        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Common OCR errors include mistaking 'O' for '0' or '1' for 'l'</li>
          <li>Fix paragraph breaks or formatting issues to match the original document</li>
          <li>Some special characters may not be recognized correctly</li>
          <li>For tables, you may need to restructure the layout manually</li>
          <li>Click Edit to make corrections to the extracted text</li>
        </ul>
      </div>
    </div>
  );
};

export default OCRResults; 