import React, { useState } from 'react';
import { Globe, ChevronDown, ChevronUp, RefreshCw, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface TranslationComponentProps {
  text: string;
  translatedText: string;
  selectedLanguage: string;
  setSelectedLanguage: (code: string) => void;
  languages: Language[];
  onTranslate: () => void;
  isLoading: boolean;
}

const TranslationComponent: React.FC<TranslationComponentProps> = ({
  text,
  translatedText,
  selectedLanguage,
  setSelectedLanguage,
  languages,
  onTranslate,
  isLoading
}) => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  
  // Get the selected language details
  const getSelectedLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Step 3: Translate Text</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Translate your transcript to another language using AI. Choose a language and click translate.
        </p>
        
        {/* Source text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Text (English)
          </label>
          <div className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 min-h-[80px] text-gray-800">
            {text || "No text available for translation."}
          </div>
        </div>
        
        {/* Language selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Target Language
          </label>
          <div className="relative">
            <button
              type="button"
              className="bg-white w-full border border-gray-300 rounded-md px-4 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <span className="flex items-center">
                <span className="mr-2 text-lg">{getSelectedLanguage().flag}</span>
                {getSelectedLanguage().name}
              </span>
              {isLanguageDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto border border-gray-200">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    className={`cursor-pointer select-none relative px-4 py-2 hover:bg-purple-50 ${
                      selectedLanguage === language.code ? 'bg-purple-100' : ''
                    }`}
                    onClick={() => {
                      setSelectedLanguage(language.code);
                      setIsLanguageDropdownOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{language.flag}</span>
                      <span className="font-medium">{language.name}</span>
                      {selectedLanguage === language.code && (
                        <Check size={16} className="ml-auto text-purple-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Translate button */}
        {!translatedText && (
          <div className="flex justify-center mb-6">
            <button
              onClick={onTranslate}
              disabled={isLoading || !text.trim()}
              className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                isLoading || !text.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={20} className="mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Globe size={20} className="mr-2" />
                  Translate
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Translation result */}
        {translatedText && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="mr-1">{getSelectedLanguage().flag}</span>
              Translated Text ({getSelectedLanguage().name})
            </label>
            <div className="w-full border border-gray-300 rounded-md p-3 bg-purple-50 min-h-[80px] text-gray-800">
              {translatedText}
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={onTranslate}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white flex items-center ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Retranslate
              </button>
              
              <button
                onClick={onTranslate}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
              >
                Continue to Voice Generation
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-purple-50 p-4 rounded-md">
        <h3 className="font-medium text-purple-800 mb-2">Translation Benefits</h3>
        <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
          <li>Instantly reach global audiences with your content</li>
          <li>Create multilingual documentation for international teams</li>
          <li>Prepare for meetings with international clients or partners</li>
          <li>Develop localized versions of important messages</li>
        </ul>
      </div>
    </div>
  );
};

export default TranslationComponent; 