import React, { useRef } from 'react';
import { FileText, Play, RefreshCw } from 'lucide-react';

interface TranscriptionProps {
  audioUrl: string | null;
  transcription: string;
  editedTranscription: string;
  setEditedTranscription: (text: string) => void;
  onTranscribe: () => void;
  isLoading: boolean;
}

const Transcription: React.FC<TranscriptionProps> = ({
  audioUrl,
  transcription,
  editedTranscription,
  setEditedTranscription,
  onTranscribe,
  isLoading
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Play the audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Step 2: Transcribe Audio</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Convert your audio to text using AI. Review and edit the transcript to ensure accuracy.
        </p>
        
        {/* Audio player */}
        {audioUrl && (
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-800">Review Your Audio</h3>
              <button
                onClick={playAudio}
                className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
              >
                <Play size={18} />
              </button>
            </div>
            <audio ref={audioRef} src={audioUrl} className="w-full" controls />
          </div>
        )}
        
        {/* Transcription button */}
        {!transcription && (
          <div className="flex justify-center mb-6">
            <button
              onClick={onTranscribe}
              disabled={isLoading || !audioUrl}
              className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                isLoading || !audioUrl ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={20} className="mr-2 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <FileText size={20} className="mr-2" />
                  Transcribe Audio
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Transcription result */}
        {transcription && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edit Transcription (if needed)
            </label>
            <textarea
              value={editedTranscription}
              onChange={(e) => setEditedTranscription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your transcription will appear here for review and editing."
            />
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={onTranscribe}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white flex items-center ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Retranscribe
              </button>
              
              <button
                onClick={() => setEditedTranscription(transcription)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Reset Edits
              </button>
            </div>
          </div>
        )}
        
        {/* Continue button */}
        {transcription && (
          <div className="flex justify-center">
            <button
              onClick={() => onTranscribe()}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            >
              Continue to Translation
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Transcription Tips</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>AI transcription works best with clear speech and minimal background noise</li>
          <li>Check proper nouns, technical terms, and specialized vocabulary</li>
          <li>Add punctuation if needed for better readability</li>
          <li>Remove filler words (um, ah) if they distract from the message</li>
        </ul>
      </div>
    </div>
  );
};

export default Transcription; 