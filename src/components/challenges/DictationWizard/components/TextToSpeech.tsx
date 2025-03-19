import React, { useRef } from 'react';
import { Volume2, Download, RefreshCw, Play } from 'lucide-react';

interface TextToSpeechProps {
  translatedText: string;
  generatedVoiceUrl: string | null;
  selectedLanguage: string;
  onGenerateVoice: () => void;
  isLoading: boolean;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  translatedText,
  generatedVoiceUrl,
  selectedLanguage,
  onGenerateVoice,
  isLoading
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Play the generated audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Step 4: Generate Voice</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Turn your translated text into natural-sounding speech. The AI will attempt to match 
          accent and pronunciation appropriate for the language.
        </p>
        
        {/* Source text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            Translated Text ({selectedLanguage})
          </label>
          <div className="w-full border border-gray-300 rounded-md p-3 bg-purple-50 min-h-[80px] text-gray-800">
            {translatedText || "No text available for voice generation."}
          </div>
        </div>
        
        {/* Generate voice button */}
        {!generatedVoiceUrl && (
          <div className="flex justify-center mb-6">
            <button
              onClick={onGenerateVoice}
              disabled={isLoading || !translatedText.trim()}
              className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                isLoading || !translatedText.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={20} className="mr-2 animate-spin" />
                  Generating Voice...
                </>
              ) : (
                <>
                  <Volume2 size={20} className="mr-2" />
                  Generate Voice
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Voice preview */}
        {generatedVoiceUrl && (
          <div className="mb-6">
            <div className="bg-orange-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-orange-800">Generated Voice</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={playAudio}
                    className="p-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition-colors"
                  >
                    <Play size={18} />
                  </button>
                  <a
                    href={generatedVoiceUrl}
                    download={`ai-voice-${selectedLanguage}.mp3`}
                    className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
              <audio ref={audioRef} controls className="w-full">
                <source src={generatedVoiceUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={onGenerateVoice}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white flex items-center ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Regenerate Voice
              </button>
              
              <button
                onClick={onGenerateVoice}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
              >
                Complete Challenge
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-orange-50 p-4 rounded-md">
        <h3 className="font-medium text-orange-800 mb-2">Voice Generation Applications</h3>
        <ul className="text-sm text-orange-700 list-disc list-inside space-y-1">
          <li>Create multilingual announcements for global teams</li>
          <li>Develop accessible content for visually impaired users</li>
          <li>Record professional voiceovers for videos or presentations</li>
          <li>Generate voice responses for chatbots or voice assistants</li>
        </ul>
      </div>
    </div>
  );
};

export default TextToSpeech; 