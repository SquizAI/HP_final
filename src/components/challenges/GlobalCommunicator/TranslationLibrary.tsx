import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChallengeGlobalCommunicator } from '../../../utils/userDataManager';

// Interface for translation records
interface TranslationRecord {
  id: string;
  timestamp: string;
  sourceMessage: string;
  targetLanguage: string;
  translation: string;
  adaptations: string[];
  context: string;
}

const TranslationLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [translations, setTranslations] = useState<TranslationRecord[]>([]);
  const [selectedTranslation, setSelectedTranslation] = useState<TranslationRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  
  // Load saved translations
  useEffect(() => {
    // In a real implementation, this would get data from local storage
    // For now, we'll use sample data
    const savedTranslations = getChallengeGlobalCommunicator() || sampleTranslations;
    setTranslations(savedTranslations);
  }, []);
  
  // Handle translation selection
  const handleSelectTranslation = (translation: TranslationRecord) => {
    setSelectedTranslation(translation);
  };
  
  // Navigate to the main challenge page
  const goToChallenge = () => {
    navigate('/challenges/global-communicator');
  };
  
  // Create a new translation
  const createNewTranslation = () => {
    navigate('/challenges/global-communicator/new');
  };
  
  // Filter translations based on search query and language filter
  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = 
      translation.sourceMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.context.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = 
      filterLanguage === 'all' || 
      translation.targetLanguage === filterLanguage;
    
    return matchesSearch && matchesLanguage;
  });
  
  // Get unique languages for filter
  const uniqueLanguages = Array.from(new Set(translations.map(t => t.targetLanguage)));
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Play audio for a translation
  const playAudio = (text: string, language: string) => {
    // In a real implementation, this would use a text-to-speech service
    console.log(`Playing audio for ${language} text: ${text}`);
    alert('In a real implementation, this would play audio of the translation.');
  };
  
  // Export translation to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Translation copied to clipboard!');
  };
  
  // Sample translations for demo purposes
  const sampleTranslations: TranslationRecord[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      sourceMessage: 'We would like to schedule a meeting next week to discuss the new project timeline. Please let me know your availability as soon as possible.',
      targetLanguage: 'Japanese',
      translation: '新プロジェクトのスケジュールについて話し合うため、来週会議を設定したいと思います。できるだけ早くご都合を教えていただければ幸いです。',
      adaptations: [
        'Changed "as soon as possible" to a more polite Japanese expression',
        'Added honorific language appropriate for business context',
        'Removed direct request and used a more indirect approach',
        'Used formal grammatical structures common in Japanese business communication'
      ],
      context: 'business-email'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      sourceMessage: 'I am pleased to announce that our new product will be launched next month. We believe it will significantly improve your workflow.',
      targetLanguage: 'French',
      translation: 'J\'ai le plaisir de vous annoncer que notre nouveau produit sera lancé le mois prochain. Nous sommes convaincus qu\'il améliorera considérablement votre flux de travail.',
      adaptations: [
        'Used more formal language consistent with French business announcements',
        'Added politeness markers typical in French business communication',
        'Maintained confident but not overly assertive tone appropriate for French business culture'
      ],
      context: 'product-announcement'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      sourceMessage: 'Due to unexpected circumstances, we need to reschedule our meeting. Please let me know when you are available this week.',
      targetLanguage: 'Chinese (Simplified)',
      translation: '由于一些意外情况，我们需要重新安排会议时间。请告知您本周的可用时间。',
      adaptations: [
        'Maintained concise structure preferred in Chinese business communications',
        'Used appropriate level of formality for business context',
        'Chose neutral language to avoid negative connotations around scheduling changes'
      ],
      context: 'meeting-invitation'
    }
  ];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Translations Library</h1>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-800"
            onClick={goToChallenge}
          >
            Back to Challenge
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={createNewTranslation}
          >
            Create New Translation
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left panel: Search and list */}
        <div className="lg:w-1/3 mb-6 lg:mb-0">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Search Translations</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Search messages, translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Filter by Language</label>
              <select
                className="w-full p-2 border rounded-md bg-white"
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
              >
                <option value="all">All Languages</option>
                {uniqueLanguages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              {filteredTranslations.length} translation{filteredTranslations.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y">
              {filteredTranslations.length > 0 ? (
                filteredTranslations.map(translation => (
                  <li 
                    key={translation.id}
                    className={`cursor-pointer p-4 hover:bg-blue-50 transition-colors ${
                      selectedTranslation?.id === translation.id ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleSelectTranslation(translation)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">
                          {translation.context.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h3>
                        <p className="text-sm text-gray-600">To: {translation.targetLanguage}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(translation.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm line-clamp-2 text-gray-800">
                      {translation.sourceMessage}
                    </p>
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-gray-500">
                  No translations found
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Right panel: Selected translation details */}
        <div className="lg:w-2/3">
          {selectedTranslation ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedTranslation.context.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h2>
                  <p className="text-gray-600">
                    {formatDate(selectedTranslation.timestamp)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 bg-blue-100 text-blue-800 rounded-md text-sm"
                    onClick={() => playAudio(selectedTranslation.translation, selectedTranslation.targetLanguage)}
                  >
                    🔊 Listen
                  </button>
                  <button
                    className="p-2 bg-gray-100 text-gray-800 rounded-md text-sm"
                    onClick={() => copyToClipboard(selectedTranslation.translation)}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Original Message (English)</h3>
                  <div className="p-4 bg-gray-50 rounded-md min-h-32 whitespace-pre-wrap">
                    {selectedTranslation.sourceMessage}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">{selectedTranslation.targetLanguage} Translation</h3>
                  <div className="p-4 bg-blue-50 rounded-md min-h-32 whitespace-pre-wrap">
                    {selectedTranslation.translation}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Cultural Adaptations</h3>
                <div className="p-4 bg-yellow-50 rounded-md">
                  <ul className="list-disc pl-5">
                    {selectedTranslation.adaptations.map((adaptation, index) => (
                      <li key={index} className="mb-1">{adaptation}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Export Options</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm">
                    📝 Export as Text
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm">
                    📊 Export as PDF
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm">
                    📧 Email Translation
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">🌐</div>
              <h2 className="text-2xl font-bold mb-2">Select a Translation</h2>
              <p className="text-gray-600 mb-6">
                Choose a translation from the list to view details, or create a new translation.
              </p>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-md"
                onClick={createNewTranslation}
              >
                Create New Translation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationLibrary; 