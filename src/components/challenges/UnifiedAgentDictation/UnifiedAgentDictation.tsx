import React, { useState, useEffect, useRef, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { v4 as uuidv4 } from 'uuid';

// Import UI components
import {
  MessageSquare,
  Send,
  Mic,
  Zap,
  CheckCircle2,
  User,
  Search,
  FileText,
  ClipboardList,
  ShoppingCart,
  Globe,
  ChevronDown,
  ChevronUp,
  Save,
  Download,
  Share2,
  PenLine,
  Trash2,
  Check,
  X,
  Plus,
  AlertCircle,
  Lightbulb,
  Layers
} from 'lucide-react';

// Import DictationWizard components
import RecordButton from '../DictationWizard/components/RecordButton';
import AudioVisualizer from '../DictationWizard/components/AudioVisualizer';

// Interface definitions
// Agent related interfaces
interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'chart' | 'document' | 'link';
    url: string;
    caption?: string;
  }[];
  isLoading?: boolean;
  toolsUsed?: string[];
}

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  systemPrompt: string;
  capabilities: string[];
  icon: React.ReactNode;
}

// Web search result interface
interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  imageUrl?: string;
  imageAlt?: string;
}

// Dictation related interfaces
type ListType = 'tasks' | 'grocery' | 'notes';

interface TaskItem {
  task: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  text?: string; // Original text from the dictation
}

interface GroceryItem {
  item: string;
  quantity?: string;
  unit?: string;
  category?: string;
  text?: string; // Original text from the dictation
}

interface NoteItem {
  content: string;
  heading?: string;
  tags?: string[];
  text?: string; // Original text from the dictation
}

interface ListOutput {
  type: ListType;
  confidence?: number;
  items: (TaskItem | GroceryItem | NoteItem)[];
}

interface SavedList {
  id: string;
  name: string;
  type: ListType;
  items: string[];
  completedItems: number[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  color?: string;
  webSearchResults?: WebSearchResult[];
}

// Define the main component 
const UnifiedAgentDictation: React.FC<{
  isActive: boolean;
  onComplete: () => void;
  onChallengePrevious: () => void;
  challengeState: any;
}> = ({
  isActive,
  onComplete,
  onChallengePrevious,
  challengeState
}) => {
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'agent' | 'dictation'>('agent');
  
  // Agent-related state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<string>('research-analyst');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<WebSearchResult[]>([]);
  
  // Dictation-related state
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [transcriptionActive, setTranscriptionActive] = useState<boolean>(false);
  const [processingText, setProcessingText] = useState<boolean>(false);
  const [listType, setListType] = useState<ListType>('tasks');
  const [autoDetectedType, setAutoDetectedType] = useState<ListType | null>(null);
  const [processedList, setProcessedList] = useState<string[]>([]);
  const [structuredList, setStructuredList] = useState<ListOutput | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Saved lists state
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [showSavedLists, setShowSavedLists] = useState<boolean>(true);
  const [newListName, setNewListName] = useState<string>('');
  const [editingListName, setEditingListName] = useState<boolean>(false);
  
  // Web research states
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchQuery, setResearchQuery] = useState<string>('');
  const [webSearchResults, setWebSearchResults] = useState<WebSearchResult[]>([]);
  const [showWebResults, setShowWebResults] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<number>(0); // Add a state for forcing re-renders
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const hasMadeInitialPermissionRequestRef = useRef<boolean>(false);
  const isIncognitoRef = useRef<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Web Speech API setup
  const { 
    transcript: webSpeechTranscript, 
    listening: webSpeechListening,
    resetTranscript: resetWebSpeechTranscript,
    browserSupportsSpeechRecognition 
  } = useSpeechRecognition();
  
  // Voice search tracking
  const [voiceSearchActive, setVoiceSearchActive] = useState<boolean>(false);
  
  // Agent list
  const agents: Agent[] = [
    {
      id: 'research-analyst',
      name: 'Research Analyst',
      role: 'Research Assistant',
      avatar: '👩‍🔬',
      color: 'bg-blue-500',
      systemPrompt: 'You are a helpful research assistant that provides accurate information and cites sources.',
      capabilities: ['web_search', 'knowledge', 'analysis'],
      icon: <Globe className="w-4 h-4" />
    },
    {
      id: 'task-manager',
      name: 'Task Manager',
      role: 'Productivity Assistant',
      avatar: '📋',
      color: 'bg-green-500',
      systemPrompt: 'You are a productivity assistant that helps with task management, planning, and organization.',
      capabilities: ['planning', 'reminders', 'organization'],
      icon: <ClipboardList className="w-4 h-4" />
    }
  ];
  
  // Check browser type
  const isChromeRef = useRef<boolean>(
    typeof window !== 'undefined' && 
    (navigator.userAgent.indexOf("Chrome") > -1 || navigator.userAgent.indexOf("Chromium") > -1)
  );
  
  // Load saved lists from localStorage on component mount
  useEffect(() => {
    try {
      const savedListsJSON = localStorage.getItem('unifiedApp_savedLists');
      if (savedListsJSON) {
        const parsed = JSON.parse(savedListsJSON) as SavedList[];
        setSavedLists(parsed);
      }
    } catch (error) {
      console.error('Error loading saved lists:', error);
    }
    
    // Initial message for agent chat
    if (isActive && messages.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          agentId: 'research-analyst',
          content: "Hello! I'm your AI assistant. How can I help you today?",
          timestamp: new Date()
        }
      ]);
    }
  }, [isActive, messages.length]);
  
  // Save lists to localStorage when they change
  useEffect(() => {
    if (savedLists.length > 0) {
      try {
        localStorage.setItem('unifiedApp_savedLists', JSON.stringify(savedLists));
      } catch (error) {
        console.error('Error saving lists to localStorage:', error);
      }
    }
  }, [savedLists]);
  
  // Update transcript when Web Speech API updates
  useEffect(() => {
    if (webSpeechTranscript && transcriptionActive) {
      setTranscript(webSpeechTranscript);
    }
  }, [webSpeechTranscript, transcriptionActive]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Error handling
  const showError = (message: string) => {
    setError(message);
    console.error(message);
    setTimeout(() => setError(null), 5000);
  };
  
  const handleError = (err: Error) => {
    console.error('Audio error:', err);
    showError(err.message);
  };
  
  // Agent chat functions
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      agentId: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentResponseId = uuidv4();
      const loadingMessage: Message = {
        id: agentResponseId,
        agentId: activeAgentId,
        content: '',
        timestamp: new Date(),
        isLoading: true
      };
      
      setMessages(prev => [...prev, loadingMessage]);
      
      // Simulate API response
      setTimeout(() => {
        const simulatedResponse = `I'm responding to your message: "${userMessage.content}". This is a simulated response as a placeholder for the actual integration with the backend API.`;
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === agentResponseId
              ? {
                  ...msg,
                  content: simulatedResponse,
                  isLoading: false,
                  toolsUsed: ['ai_model']
                }
              : msg
          )
        );
        setIsProcessing(false);
      }, 1500);
    }, 500);
  };
  
  // Make sure we have a consistent handling of isResearching state
  useEffect(() => {
    // When researching changes to false, make sure to update UI
    if (!isResearching && webSearchResults.length > 0) {
      console.log("Search completed, displaying results");
      setShowWebResults(true);
    }
  }, [isResearching, webSearchResults]);
  
  // Unified web search function that can be used from both tabs
  const performUnifiedWebSearch = async (query: string) => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }
    
    // Set state to indicate searching is in progress
    setIsResearching(true);
    setResearchQuery(query);
    setError(null);
    
    // Clear input message if searching from agent tab
    if (activeTab === 'agent') {
      setInputMessage('');
    }
    
    console.log(`Performing web search for: "${query}"`);
    
    try {
      // Clear previous results
      setWebSearchResults([]);
      
      // Simulate network delay
      setTimeout(() => {
        // Generate realistic search results with real images
        const cleanQuery = query.toLowerCase().replace(/\s+/g, '-');
        
        // Create search results with real images from Unsplash
        const simulatedResults: WebSearchResult[] = [
          {
            title: `${query} - Comprehensive Overview`,
            url: `https://example.com/result1/${cleanQuery}`,
            snippet: `This comprehensive guide provides detailed information about ${query}, including history, applications, and future trends.`,
            // Use Unsplash source API for real topic-based images
            imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}`,
            imageAlt: `Image related to ${query}`
          },
          {
            title: `Understanding ${query}: A Complete Guide`,
            url: `https://example.com/result2/${cleanQuery}`,
            snippet: `Learn everything you need to know about ${query} in this in-depth analysis with expert insights and practical examples.`,
            imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(query + " related")}`,
            imageAlt: `Visual representation of ${query}`
          },
          {
            title: `Latest Developments in ${query}`,
            url: `https://example.com/result3/${cleanQuery}`,
            snippet: `Stay updated with the most recent advancements and innovations in ${query}. This article covers all the latest trends.`,
            imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(query + " concept")}`,
            imageAlt: `Concept illustration of ${query}`
          }
        ];
        
        console.log("Setting web search results:", simulatedResults);
        setWebSearchResults(simulatedResults);
        setShowWebResults(true);
        setIsResearching(false);
        
        // Force a UI update
        setForceUpdate(prev => prev + 1);
        
        // If in agent tab, also add a message with the search results
        if (activeTab === 'agent') {
          const searchResultMessage: Message = {
            id: uuidv4(),
            agentId: activeAgentId,
            content: `I've found some information about "${query}" that might help:`,
            timestamp: new Date(),
            attachments: simulatedResults.map(result => ({
              type: 'link',
              url: result.url,
              caption: result.title
            }))
          };
          
          setMessages(prev => [...prev, searchResultMessage]);
        }
      }, 1500);
    } catch (error) {
      console.error("Error performing web search:", error);
      setError(`Web search failed: ${error instanceof Error ? error.message : String(error)}`);
      setIsResearching(false);
    }
  };
  
  // Replace individual search functions with the unified one
  const performWebSearch = performUnifiedWebSearch;
  const performAgentWebSearch = performUnifiedWebSearch;
  
  // Dictation functions
  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecording(null);
      setError(null);
      setTranscript('');
      
      // Reset Web Speech API if available
      if (browserSupportsSpeechRecognition) {
        resetWebSpeechTranscript();
      }
      
      console.log("Requesting microphone access...");
      
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio recording');
      }
      
      // Basic audio constraints
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true }
        }
      };
      
      // Request the stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        
        // Also stop web speech recognition if active
        if (browserSupportsSpeechRecognition && webSpeechListening) {
          SpeechRecognition.stopListening();
        }
        setTranscriptionActive(false);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsListening(true);
      
      // Start Web Speech API if supported
      if (browserSupportsSpeechRecognition) {
        try {
          await SpeechRecognition.startListening({ continuous: true });
          setTranscriptionActive(true);
        } catch (err) {
          console.error("Error starting speech recognition:", err);
        }
      }
      
    } catch (err) {
      console.error('Error starting recording:', err);
      showError(`Error accessing microphone: ${err instanceof Error ? err.message : String(err)}`);
      setIsListening(false);
      setTranscriptionActive(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log("Stopping recording...");
      mediaRecorderRef.current.stop();
    }
    
    // Ensure speech recognition is stopped
    if (browserSupportsSpeechRecognition && webSpeechListening) {
      SpeechRecognition.stopListening();
    }
    
    setIsListening(false);
    setTranscriptionActive(false);
  };
  
  // List management functions
  const processTranscriptToList = async () => {
    if (!transcript.trim()) {
      return;
    }
    
    setProcessingText(true);
    setAutoDetectedType(null);
    
    try {
      // Simple local processing - in a real app, you'd call an API
      setTimeout(() => {
        const detectedType = Math.random() > 0.7 ? 'grocery' : 
                             Math.random() > 0.5 ? 'notes' : 'tasks';
        
        setAutoDetectedType(detectedType as ListType);
        setListType(detectedType as ListType);
        
        // Split the transcript into lines or sentences
        const items = transcript
          .split(/[.,\n]/)
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        console.log("Processed list items:", items);
        setProcessedList(items);
        setProcessingText(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error processing transcript to list:', err);
      showError('Error processing your dictation. Please try again.');
      setProcessingText(false);
    }
  };
  
  // Item editing functions
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(processedList[index]);
  };
  
  const saveEdit = () => {
    if (editingIndex !== null) {
      const newList = [...processedList];
      newList[editingIndex] = editValue;
      setProcessedList(newList);
      setEditingIndex(null);
      setEditValue('');
      
      // Auto-save if this is a saved list
      if (currentListId) {
        setSavedLists(prev => 
          prev.map(list => 
            list.id === currentListId 
              ? {
                  ...list,
                  items: newList,
                  completedItems: Array.from(completedItems),
                  updatedAt: new Date().toISOString()
                }
              : list
          )
        );
      }
    }
  };
  
  const deleteItem = (index: number) => {
    const newList = [...processedList];
    newList.splice(index, 1);
    setProcessedList(newList);
    
    // Update completed items
    const newCompletedItems = new Set<number>();
    completedItems.forEach(i => {
      if (i < index) newCompletedItems.add(i);
      else if (i > index) newCompletedItems.add(i - 1);
    });
    setCompletedItems(newCompletedItems);
    
    // Auto-save if this is a saved list
    if (currentListId) {
      setSavedLists(prev => 
        prev.map(list => 
          list.id === currentListId 
            ? {
                ...list,
                items: newList,
                completedItems: Array.from(newCompletedItems),
                updatedAt: new Date().toISOString()
              }
            : list
        )
      );
    }
  };
  
  const addNewItem = () => {
    const newList = [...processedList, ''];
    setProcessedList(newList);
    startEditing(newList.length - 1);
  };
  
  // Toggle item completion for task lists
  const toggleItemCompletion = (index: number) => {
    const newCompletedItems = new Set(completedItems);
    if (completedItems.has(index)) {
      newCompletedItems.delete(index);
    } else {
      newCompletedItems.add(index);
    }
    setCompletedItems(newCompletedItems);
    
    // Auto-save if this is a saved list
    if (currentListId) {
      setSavedLists(prev => 
        prev.map(list => 
          list.id === currentListId 
            ? {
                ...list,
                completedItems: Array.from(newCompletedItems),
                updatedAt: new Date().toISOString()
              }
            : list
        )
      );
    }
  };
  
  // Saved list functions
  const loadList = (listId: string) => {
    const list = savedLists.find(l => l.id === listId);
    if (list) {
      setCurrentListId(listId);
      setProcessedList(list.items);
      setCompletedItems(new Set(list.completedItems));
      setListType(list.type);
    }
  };
  
  const deleteList = (listId: string) => {
    setSavedLists(prev => prev.filter(l => l.id !== listId));
    if (currentListId === listId) {
      setCurrentListId(null);
      setProcessedList([]);
      setCompletedItems(new Set());
    }
  };
  
  const saveCurrentList = () => {
    if (currentListId) {
      setSavedLists(prev => 
        prev.map(list => 
          list.id === currentListId 
            ? {
                ...list,
                items: processedList,
                completedItems: Array.from(completedItems),
                type: listType,
                updatedAt: new Date().toISOString()
              }
            : list
        )
      );
    } else if (processedList.length > 0) {
      const newList: SavedList = {
        id: Date.now().toString(),
        name: `${listType.charAt(0).toUpperCase() + listType.slice(1)} List ${new Date().toLocaleDateString()}`,
        type: listType,
        items: processedList,
        completedItems: Array.from(completedItems),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setSavedLists(prev => [...prev, newList]);
      setCurrentListId(newList.id);
    }
  };
  
  // Export list as text
  const exportListAsText = () => {
    try {
      let content = `# ${currentListId ? savedLists.find(l => l.id === currentListId)?.name : listType.toUpperCase()}\n`;
      content += `# Created: ${new Date().toLocaleString()}\n\n`;
      
      processedList.forEach((item, index) => {
        if (listType === 'tasks') {
          content += `- [${completedItems.has(index) ? 'x' : ' '}] ${item}\n`;
        } else {
          content += `- ${item}\n`;
        }
      });
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentListId ? savedLists.find(l => l.id === currentListId)?.name : listType}_list.txt`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting list:', error);
      setError('Failed to export list. Please try again.');
    }
  };
  
  // Share list
  const shareList = async () => {
    try {
      if (!navigator.share) {
        setError('Web Share API is not supported in your browser');
        return;
      }
      
      let content = `${currentListId ? savedLists.find(l => l.id === currentListId)?.name : listType.toUpperCase()}\n\n`;
      
      processedList.forEach((item, index) => {
        if (listType === 'tasks') {
          content += `- [${completedItems.has(index) ? 'DONE' : 'TODO'}] ${item}\n`;
        } else {
          content += `- ${item}\n`;
        }
      });
      
      await navigator.share({
        title: `${listType.charAt(0).toUpperCase() + listType.slice(1)} List`,
        text: content
      });
    } catch (error) {
      console.error('Error sharing list:', error);
      setError('Failed to share list. Please try again.');
    }
  };
  
  // Add items from web search results
  const addItemFromWebSearch = (content: string) => {
    setProcessedList(prev => [...prev, content]);
    
    // Auto-save if this is a saved list
    if (currentListId) {
      setSavedLists(prev => 
        prev.map(list => 
          list.id === currentListId 
            ? {
                ...list,
                items: [...list.items, content],
                updatedAt: new Date().toISOString()
              }
            : list
        )
      );
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-6 bg-gradient-to-b from-purple-50 to-white min-h-[85vh] rounded-2xl shadow-sm">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4 tracking-tight text-center">
        Smart Assistant & Dictation Wizard
      </h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-purple-200 mb-4">
        <button
          className={`px-4 py-2 font-medium rounded-t-lg transition ${
            activeTab === 'agent'
              ? 'bg-purple-100 text-purple-800 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
          }`}
          onClick={() => setActiveTab('agent')}
        >
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Smart Assistant
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium rounded-t-lg transition ${
            activeTab === 'dictation'
              ? 'bg-purple-100 text-purple-800 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
          }`}
          onClick={() => setActiveTab('dictation')}
        >
          <div className="flex items-center">
            <Mic className="w-4 h-4 mr-2" />
            Dictation Wizard
          </div>
        </button>
      </div>
      
      {/* Agent Tab Content */}
      {activeTab === 'agent' && (
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-4">
          <div className="flex flex-col h-[70vh]">
            {/* Agent Selection */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-purple-700 mb-2">Choose Your Assistant</h2>
              <div className="flex space-x-2">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    className={`flex items-center px-3 py-2 rounded-lg transition ${
                      agent.id === activeAgentId
                        ? `${agent.color} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveAgentId(agent.id)}
                  >
                    <span className="mr-2">{agent.avatar}</span>
                    <span>{agent.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Message History */}
            <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.agentId === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.agentId === 'user' 
                        ? 'bg-purple-100 text-purple-900' 
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    {message.agentId !== 'user' && (
                      <div className="flex items-center mb-1">
                        <span className="mr-2">
                          {agents.find(a => a.id === message.agentId)?.avatar || '🤖'}
                        </span>
                        <span className="font-medium text-sm">
                          {agents.find(a => a.id === message.agentId)?.name || 'Assistant'}
                        </span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    
                    {message.isLoading && (
                      <div className="mt-2 flex items-center">
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden border border-gray-200">
                            {attachment.type === 'image' && (
                              <div>
                                <img 
                                  src={attachment.url} 
                                  alt={attachment.caption || 'Search result'} 
                                  className="w-full h-auto object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                {attachment.caption && (
                                  <p className="text-xs text-gray-500 p-1">{attachment.caption}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {message.toolsUsed && message.toolsUsed.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.toolsUsed.map((tool, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${agents.find(a => a.id === activeAgentId)?.name} a question...`}
                className="w-full p-3 pr-12 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                disabled={isProcessing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // If message starts with "search", use web search
                    if (inputMessage.trim().toLowerCase().startsWith('search ')) {
                      const query = inputMessage.trim().substring(7);
                      performAgentWebSearch(query);
                    } else {
                      sendMessage();
                    }
                  }
                }}
              />
              <button
                className="absolute right-2 top-2 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
                disabled={isProcessing || !inputMessage.trim()}
                onClick={() => {
                  // If message starts with "search", use web search
                  if (inputMessage.trim().toLowerCase().startsWith('search ')) {
                    const query = inputMessage.trim().substring(7);
                    performAgentWebSearch(query);
                  } else {
                    sendMessage();
                  }
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Dictation Tab Content */}
      {activeTab === 'dictation' && (
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-4">
          <div className="flex flex-col">
            {/* Dictation Controls */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-purple-700 mb-2">Voice Dictation</h2>
              
              {/* Error message */}
              {error && (
                <div className="mb-4 bg-red-50 rounded-xl p-3 border border-red-100 shadow-sm">
                  <div className="flex items-start">
                    <div className="mr-2 text-red-500 mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Use a single research loading indicator outside tab-specific content */}
              {isResearching && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 flex flex-col items-center justify-center mb-4">
                  <div className="flex justify-center mb-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                  <p className="text-purple-700 text-center text-sm font-medium mb-1">Researching: {researchQuery}</p>
                  <p className="text-purple-600 text-center text-xs">Searching the web for relevant information...</p>
                </div>
              )}
              
              {/* Web search results display */}
              {!isResearching && webSearchResults.length > 0 && showWebResults && (
                <div className="mb-4 border border-purple-100 rounded-lg bg-purple-50 p-3" key={`search-results-${forceUpdate}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-purple-700 flex items-center">
                      <Globe className="w-3.5 h-3.5 mr-1 text-purple-500" />
                      Web Search Results for "{researchQuery}"
                    </h4>
                    <button
                      onClick={() => setShowWebResults(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                    {webSearchResults.map((result, index) => (
                      <div key={`${index}-${result.title}`} className="p-2 hover:bg-purple-50 transition-colors">
                        <div className="flex justify-between">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-blue-600 hover:underline truncate max-w-[80%]"
                          >
                            {result.title}
                          </a>
                          <button 
                            onClick={() => addItemFromWebSearch(result.title)}
                            className="text-purple-500 hover:text-purple-700"
                            title="Add to list"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{result.snippet}</p>
                        
                        {result.imageUrl && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 max-w-[200px]">
                            <img 
                              src={result.imageUrl} 
                              alt={result.imageAlt || result.title} 
                              className="w-full h-auto object-cover max-h-[100px]"
                              onError={(e) => {
                                console.log("Image failed to load:", result.imageUrl);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Centered controls */}
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="mb-4 transform hover:scale-105 transition-transform duration-200">
                  <RecordButton 
                    isListening={isListening} 
                    onClick={toggleRecording} 
                    size="lg"
                  />
                </div>
                <p className="text-sm text-center text-gray-500 mb-3">
                  {isListening ? "Recording... Click to stop" : "Click to start dictating"}
                </p>
                
                {/* Visualizer */}
                <div className="w-full max-w-md">
                  <AudioVisualizer 
                    isListening={isListening} 
                    onError={handleError} 
                  />
                </div>
                
                {/* Direct search input for testing */}
                <div className="w-full max-w-md mt-4">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={researchQuery}
                      onChange={(e) => setResearchQuery(e.target.value)}
                      placeholder="Search the web..."
                      className="flex-1 p-2 border border-purple-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-purple-300"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && researchQuery.trim()) {
                          performWebSearch(researchQuery);
                        }
                      }}
                    />
                    <button
                      onClick={() => researchQuery.trim() && performWebSearch(researchQuery)}
                      className="bg-purple-600 text-white py-2 px-4 rounded-r-lg hover:bg-purple-700 transition-colors"
                      disabled={isResearching || !researchQuery.trim()}
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Real-time transcript - visible when listening */}
              {isListening && (
                <div className="mt-3 max-w-md mx-auto">
                  <h4 className="text-sm font-medium text-purple-600 mb-1">I'm listening...</h4>
                  <div className="bg-gray-50 rounded-lg p-3 min-h-[60px] border border-gray-100">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {transcript || "Waiting for speech..."}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* List Type Selection - show when we have a transcript but not processed yet */}
            {transcript && !isListening && processedList.length === 0 && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mb-4">
                <h3 className="text-base font-semibold text-purple-700 mb-2">What type of list are you creating?</h3>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-2 rounded-lg flex items-center ${
                      listType === 'tasks' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
                    }`}
                    onClick={() => setListType('tasks')}
                  >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Tasks
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg flex items-center ${
                      listType === 'grocery' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
                    }`}
                    onClick={() => setListType('grocery')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Grocery
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg flex items-center ${
                      listType === 'notes' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
                    }`}
                    onClick={() => setListType('notes')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Notes
                  </button>
                </div>
                <button
                  className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  onClick={processTranscriptToList}
                >
                  Create List
                </button>
              </div>
            )}
            
            {/* Processing indicator */}
            {processingText && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 flex flex-col items-center justify-center mb-4">
                <div className="flex justify-center mb-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
                <p className="text-purple-700 text-center text-sm font-medium mb-1">Processing your dictation...</p>
                <p className="text-purple-600 text-center text-xs">This may take a few moments...</p>
              </div>
            )}
            
            {/* Processed List Display */}
            {!isListening && processedList.length > 0 && (
              <div className="bg-white border border-purple-100 rounded-xl shadow-sm p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-semibold text-purple-700 flex items-center">
                    {listType === 'tasks' ? 
                      <><ClipboardList className="w-4 h-4 mr-1 text-purple-500" /> Task List</> : 
                      listType === 'grocery' ? 
                      <><ShoppingCart className="w-4 h-4 mr-1 text-purple-500" /> Grocery List</> : 
                      <><FileText className="w-4 h-4 mr-1 text-purple-500" /> Notes</>
                    }
                    {autoDetectedType && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        Auto-detected
                      </span>
                    )}
                  </h3>
                  
                  <div className="flex space-x-1">
                    <button 
                      onClick={addNewItem}
                      className="px-2 py-1 text-xs bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </button>
                  </div>
                </div>
                
                {/* The actual list */}
                <div className="bg-gray-50 rounded-lg border border-gray-100">
                  <ul className="divide-y divide-gray-200">
                    {processedList.map((item, index) => (
                      <li key={index} className="p-2 hover:bg-white rounded-lg transition-colors">
                        {editingIndex === index ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300 bg-white text-sm"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            />
                            <button 
                              onClick={saveEdit}
                              className="ml-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {listType === 'tasks' && (
                              <button 
                                onClick={() => toggleItemCompletion(index)}
                                className={`mr-2 w-5 h-5 flex-shrink-0 border rounded-md flex items-center justify-center ${
                                  completedItems.has(index) 
                                    ? 'bg-purple-500 border-purple-600 text-white' 
                                    : 'border-gray-300 hover:border-purple-300'
                                } transition-colors`}
                              >
                                {completedItems.has(index) && <Check className="w-3 h-3" />}
                              </button>
                            )}
                            <span 
                              className={`flex-1 text-gray-800 text-sm ${
                                listType === 'tasks' && completedItems.has(index) 
                                  ? 'line-through text-gray-400' 
                                  : ''
                              }`}
                            >
                              {item}
                            </span>
                            <div className="flex space-x-1 ml-1">
                              <button 
                                onClick={() => {
                                  setResearchQuery(item);
                                  performWebSearch(item);
                                }}
                                className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Research this item"
                              >
                                <Search className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => startEditing(index)}
                                className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <PenLine className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => deleteItem(index)}
                                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Quick actions footer */}
                <div className="flex justify-between mt-3">
                  <button 
                    onClick={saveCurrentList}
                    className="p-1.5 text-xs bg-white border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    Save List
                  </button>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={shareList}
                      className="p-1.5 text-xs bg-white border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={exportListAsText}
                      className="p-1.5 text-xs bg-white border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                      title="Export"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Saved Lists */}
            <div className="bg-white border border-purple-100 rounded-xl shadow-sm overflow-hidden mb-4">
              <div 
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors"
                onClick={() => setShowSavedLists(!showSavedLists)}
              >
                <h3 className="font-medium text-sm text-purple-700 flex items-center">
                  <Layers className="w-3.5 h-3.5 mr-1 text-purple-500" />
                  My Lists
                </h3>
                {showSavedLists ? <ChevronUp className="text-purple-500 w-3.5 h-3.5" /> : <ChevronDown className="text-purple-500 w-3.5 h-3.5" />}
              </div>
              
              {showSavedLists && (
                <div className="px-4 pb-4 border-t border-purple-50">
                  {savedLists.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      <p>No saved lists yet.</p>
                      <p className="mt-1">Create your first list by dictating and saving!</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-purple-50">
                      {savedLists.map(list => (
                        <li 
                          key={list.id} 
                          className={`py-2 px-1 hover:bg-purple-50 rounded cursor-pointer transition-colors ${currentListId === list.id ? 'bg-purple-50' : ''}`}
                          onClick={() => loadList(list.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {list.type === 'tasks' ? 
                                <ClipboardList className="w-4 h-4 text-purple-500 mr-2" /> : 
                                list.type === 'grocery' ? 
                                <ShoppingCart className="w-4 h-4 text-purple-500 mr-2" /> : 
                                <FileText className="w-4 h-4 text-purple-500 mr-2" />
                              }
                              <span className="truncate text-sm font-medium text-gray-700" title={list.name}>
                                {list.name}
                              </span>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                              title="Delete list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                            <span>{list.items.length} items</span>
                            <span>{new Date(list.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            {/* Challenge complete message - we'll use the isActive and onComplete props here */}
            {processedList.length >= 3 && !isListening && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Challenge Completed!</h3>
                <p className="text-green-700 mb-4">You've successfully used the unified agent and dictation tools.</p>
                <button 
                  onClick={onComplete}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  Mark Challenge Complete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedAgentDictation; 