import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  Image as ImageIcon, 
  Database, 
  HelpCircle, 
  Award, 
  RefreshCw, 
  Check,
  Volume,
  Mic,
  FileText,
  User,
  Globe,
  Smile,
  Video,
  BarChart2,
  Wrench
} from 'lucide-react';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';

// Agent types and interfaces
interface Message {
  role: 'user' | 'agent' | 'system';
  agentName?: string;
  content: string;
  timestamp: Date;
  includedTool?: ToolUsage | null;
}

interface ToolUsage {
  name: string;
  description: string;
  result: string;
}

interface AgentConfig {
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  systemPrompt: string;
  specialty: string[];
}

// Enhanced detective cases with more detailed information
const DETECTIVE_CASES = [
  {
    id: 'missing-artifact',
    title: 'The Missing Artifact',
    description: 'A valuable ancient tablet has disappeared from the Metropolitan Museum. Work with the AI Detective League to uncover what happened.',
    longDescription: "The 'Tablet of Wisdom' - a 3,000-year-old artifact valued at $5 million - has vanished from its secure display case during normal museum hours. Security cameras experienced a 'mysterious' 3-minute outage during the estimated time of theft. Museum staff found no signs of forced entry to the display case.",
    difficulty: 'Easy',
    status: 'ready',
    backstory: "The museum director insists it's an inside job. The tablet was rumored to contain secret codes that, when deciphered, could lead to an even greater treasure. The insurance company is offering a substantial reward for information leading to its recovery.",
    clues: [
      "Security footage shows a maintenance worker leaving through a side entrance at an unusual time",
      "The display case alarm was disabled using a valid security code",
      "A partial fingerprint was found on the glass that doesn't match any museum employees",
      "Several visitors reported seeing a drone hovering near the museum skylight that day"
    ],
    image: 'https://images.pexels.com/photos/842953/pexels-photo-842953.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'data-breach',
    title: 'Corporate Data Breach',
    description: 'TechGlobal Inc. has suffered a mysterious data breach. Investigate how it happened and what data was compromised.',
    longDescription: "TechGlobal Inc., a Fortune 500 company, discovered that sensitive customer data and proprietary software code was exfiltrated from their servers. Initial investigations suggest the breach went undetected for weeks. The company's reputation and $2.3 billion in market value are at stake.",
    difficulty: 'Medium',
    status: 'ready',
    backstory: "The CEO recently fired the head of cybersecurity after a public disagreement about budget allocations for security infrastructure. Several employees had recently accepted positions at a major competitor. The company had just passed a security audit last month with flying colors, raising questions about how this could have happened.",
    clues: [
      "Login attempts from unusual IP addresses originating in Eastern Europe",
      "An unexplained server reboot at 3:27 AM on three consecutive nights",
      "A new employee in accounting received a suspicious phishing email one week prior",
      "System logs show large data transfers during off-hours",
      "The company recently migrated to a new cloud service provider"
    ],
    image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pattern-analysis',
    title: 'The Connected Disappearances',
    description: 'Several people have gone missing in the same neighborhood over the past month. Analyze patterns to predict future incidents and prevent them.',
    longDescription: "Five individuals with seemingly no connection to each other have disappeared from the Oakwood neighborhood in the past 30 days. Local police are baffled as there's no obvious pattern - the missing persons range in age from 19 to 67, different genders, professions, and backgrounds. The only commonality is the neighborhood and the fact that all disappeared between 9 PM and midnight.",
    difficulty: 'Hard',
    status: 'ready',
    backstory: "The neighborhood recently installed a new automated streetlight system that has been experiencing glitches, leaving certain areas in darkness at random times. A local community app shows increased reports of suspicious vans parked in the area. The city has refused to release complete surveillance footage to the public, citing 'ongoing investigation protocols.'",
    clues: [
      "All victims had recently used the same food delivery app within 24 hours of disappearing",
      "Cell phone signals of all victims last pinged near the neighborhood park",
      "Two of the missing persons had reported strange symbols appearing on their doorsteps",
      "Weather data shows unusual electromagnetic activity in the area on nights of disappearances",
      "Social media analysis reveals all victims had interacted with a local community event page"
    ],
    image: 'https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

// Agent configurations
const AGENTS_CONFIG: AgentConfig[] = [
  {
    name: 'Sherlock',
    role: 'Lead Detective',
    icon: <Search size={24} />,
    color: '#4A6FDC',
    systemPrompt: 'You are Sherlock, the lead detective who coordinates the investigation and synthesizes findings.',
    specialty: ['Case Management', 'Deduction', 'Evidence Synthesis']
  },
  {
    name: 'DataMiner',
    role: 'Data Analyst',
    icon: <Database size={24} />,
    color: '#38B2AC',
    systemPrompt: 'You are DataMiner, specialized in analyzing data patterns and extracting insights from structured information.',
    specialty: ['Data Analysis', 'Pattern Recognition', 'Statistics']
  },
  {
    name: 'Inspector',
    role: 'Visual Analyst',
    icon: <ImageIcon size={24} />,
    color: '#ED8936',
    systemPrompt: 'You are Inspector, an expert in analyzing images, videos, and visual evidence.',
    specialty: ['Image Analysis', 'Object Detection', 'Visual Clues']
  },
  {
    name: 'Watson',
    role: 'Research Assistant',
    icon: <MessageSquare size={24} />,
    color: '#9F7AEA',
    systemPrompt: 'You are Watson, specializing in research, information gathering, and contextual knowledge.',
    specialty: ['Research', 'Knowledge Base', 'Context Building']
  }
];

// Tool definitions
const AVAILABLE_TOOLS = [
  {
    name: 'web_search',
    description: 'Search the web for information',
    humorousDescription: 'Like having a librarian who never sleeps and occasionally goes down rabbit holes',
    category: 'Research',
    icon: <Search size={18} />
  },
  {
    name: 'image_analysis',
    description: 'Analyze images for objects, text, or other content',
    humorousDescription: 'Sees things in photos that even your mom with her Facebook investigation skills would miss',
    category: 'Visual',
    icon: <ImageIcon size={18} />
  },
  {
    name: 'data_analysis',
    description: 'Analyze datasets to extract patterns or insights',
    humorousDescription: 'Turns messy spreadsheets into actionable insights (and occasionally existential crises)',
    category: 'Analysis',
    icon: <Database size={18} />
  },
  {
    name: 'text_to_speech',
    description: 'Convert text into natural-sounding speech',
    humorousDescription: 'For when your eyes are tired but your ears still want the tea',
    category: 'Audio',
    icon: <Volume size={18} />
  },
  {
    name: 'speech_to_text',
    description: 'Transcribe spoken words into written text',
    humorousDescription: 'Listens better than your ex ever did',
    category: 'Audio',
    icon: <Mic size={18} />
  },
  {
    name: 'ocr_tool',
    description: 'Extract text from images or documents',
    humorousDescription: 'Reads messy handwriting better than a pharmacist deciphering prescriptions',
    category: 'Visual',
    icon: <FileText size={18} />
  },
  {
    name: 'face_detection',
    description: 'Detect and analyze faces in images',
    humorousDescription: 'Finds faces faster than your mom spots your childhood crush at the supermarket',
    category: 'Visual',
    icon: <User size={18} />
  },
  {
    name: 'language_translation',
    description: 'Translate text between different languages',
    humorousDescription: 'Like having a multilingual friend without the constant humble-bragging',
    category: 'Language',
    icon: <Globe size={18} />
  },
  {
    name: 'sentiment_analysis',
    description: 'Analyze the emotional tone of text',
    humorousDescription: 'Detects passive-aggression in emails with frightening accuracy',
    category: 'Analysis',
    icon: <Smile size={18} />
  },
  {
    name: 'object_tracking',
    description: 'Track objects across video frames',
    humorousDescription: 'Follows suspects with the dedication of a true crime podcast fan',
    category: 'Visual',
    icon: <Video size={18} />
  },
  {
    name: 'data_visualization',
    description: 'Create visual representations of data',
    humorousDescription: 'Turns boring numbers into charts that even your boss will understand',
    category: 'Analysis',
    icon: <BarChart2 size={18} />
  }
];

// Group tools by category for easier navigation
const TOOL_CATEGORIES = [...new Set(AVAILABLE_TOOLS.map(tool => tool.category))];

const DetectiveLeagueMain: React.FC = () => {
  // User progress tracking
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // Case state
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [caseDetail, setCaseDetail] = useState<any | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgent, setActiveAgent] = useState<string>('Sherlock');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [activeToolCategory, setActiveToolCategory] = useState<string | null>(null);
  
  // Check if challenge is already completed
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-detective-league')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Select a case
  const handleCaseSelect = (caseId: string) => {
    setSelectedCase(caseId);
    const selected = DETECTIVE_CASES.find(c => c.id === caseId);
    
    if (selected) {
      setCaseDetail(selected);
      
      // Initialize the conversation with a welcome message
      setMessages([
        {
          role: 'system',
          content: 'Welcome to the AI Detective League. Your case has been assigned.',
          timestamp: new Date()
        },
        {
          role: 'agent',
          agentName: 'Sherlock',
          content: `Greetings, I'm Sherlock, the lead detective. We're investigating ${selected.title}. What information do you have about this case?`,
          timestamp: new Date()
        }
      ]);
    }
  };
  
  // Handle user input submission
  const handleSubmit = () => {
    if (!userInput.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsProcessing(true);
    
    // Simulate agent processing and response
    setTimeout(() => {
      processAgentResponse();
    }, 1500);
  };
  
  // Process and generate agent responses
  const processAgentResponse = () => {
    // This is a simulation. In a real implementation, this would call an AI API
    const currentCase = caseDetail;
    const lastMessage = messages[messages.length - 1];
    
    // Simulate tool usage
    if (Math.random() > 0.5 || activeTool) {
      // Either use the tool selected by the user, or randomly select one
      const selectedTool = activeTool 
        ? AVAILABLE_TOOLS.find(t => t.name === activeTool) 
        : AVAILABLE_TOOLS[Math.floor(Math.random() * AVAILABLE_TOOLS.length)];
      
      if (!selectedTool) return;
      
      setActiveTool(selectedTool.name);
      
      // Simulate tool processing
      setTimeout(() => {
        // Generate results based on the tool
        let toolResult = '';
        
        switch (selectedTool.name) {
          case 'web_search':
            toolResult = `Found several articles about ${currentCase.title}. 
              Key information includes related incidents at other locations and similar patterns.
              I also discovered that there were 3 similar cases reported in neighboring areas in the past month.
              One witness statement mentions ${currentCase.id === 'missing-artifact' ? 'seeing unusual drone activity near the skylight' : currentCase.id === 'data-breach' ? 'suspicious emails from spoofed domains' : 'a black van with tinted windows'}.`;
            break;
          case 'image_analysis':
            toolResult = `Analyzed the scene images. 
              Detected unusual patterns near the ${currentCase.id === 'missing-artifact' ? 'display case' : currentCase.id === 'data-breach' ? 'server room' : 'last known locations'}.
              Image metadata shows the photos were taken at ${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}.
              Identified ${Math.floor(Math.random() * 5) + 1} persons of interest in the background of the images.`;
            break;
          case 'data_analysis':
            toolResult = `Analyzed the data patterns. 
              Found anomalies in the ${currentCase.id === 'data-breach' ? 'access logs' : currentCase.id === 'missing-artifact' ? 'visitor records' : 'reported incidents'} that correlate with the incident timeframe.
              Statistical analysis shows a ${Math.floor(Math.random() * 70) + 30}% probability that these events are connected.
              Identified unusual patterns in ${Math.floor(Math.random() * 3) + 1} related datasets.`;
            break;
          case 'text_to_speech':
            toolResult = `Converted the witness statement to speech for analysis.
              Voice stress analysis indicates a ${Math.random() > 0.5 ? 'high' : 'moderate'} level of anxiety in the narration.
              Audio enhancement revealed background noise consistent with ${currentCase.id === 'missing-artifact' ? 'museum ventilation systems' : currentCase.id === 'data-breach' ? 'server cooling fans' : 'urban residential areas at night'}.`;
            break;
          case 'speech_to_text':
            toolResult = `Transcribed the audio recording from ${currentCase.id === 'missing-artifact' ? 'museum security' : currentCase.id === 'data-breach' ? 'IT department emergency meeting' : 'neighborhood watch calls'}.
              Transcript includes mention of "${currentCase.clues[Math.floor(Math.random() * currentCase.clues.length)]}".
              Multiple speakers detected, with one unidentified voice.`;
            break;
          case 'ocr_tool':
            toolResult = `Extracted text from ${currentCase.id === 'missing-artifact' ? 'museum security logs' : currentCase.id === 'data-breach' ? 'server maintenance records' : 'neighborhood flyers'}.
              Found unusual entry: "${Math.random() > 0.5 ? 'Access granted - Override Code: PROMETHEUS' : 'System maintenance - unscheduled - tech_id: JD7734'}"
              Document date matches the incident timeline.`;
            break;
          case 'face_detection':
            toolResult = `Analyzed faces in surveillance footage.
              Detected ${Math.floor(Math.random() * 5) + 2} individuals in the frame.
              One face matches partially (${Math.floor(Math.random() * 30) + 70}% confidence) with a known ${Math.random() > 0.5 ? 'former employee' : 'person of interest'}.
              Facial expressions indicate ${Math.random() > 0.5 ? 'nervousness' : 'determination'}.`;
            break;
          case 'sentiment_analysis':
            toolResult = `Analyzed sentiment in communications related to the case.
              Detected unusual emotional patterns in ${currentCase.id === 'missing-artifact' ? 'staff emails' : currentCase.id === 'data-breach' ? 'internal memos' : 'community forum posts'}.
              Sentiment shifted from neutral to ${Math.random() > 0.5 ? 'anxious' : 'suspicious'} three days before the incident.
              One communication thread shows anomalous positive sentiment, which may indicate foreknowledge.`;
            break;
          default:
            toolResult = `Analyzed available evidence using ${selectedTool.name}.
              Found several interesting patterns and connections.
              Results support the theory that ${Math.random() > 0.5 ? 'this was a planned operation rather than opportunistic' : 'there may be multiple parties involved'}.`;
        }
        
        // Add a tool usage message
        const toolMessage: Message = {
          role: 'agent',
          agentName: activeAgent,
          content: `I'll use our ${selectedTool.description} tool to find more information.`,
          timestamp: new Date(),
          includedTool: {
            name: selectedTool.name,
            description: selectedTool.description,
            result: toolResult
          }
        };
        
        setMessages(prev => [...prev, toolMessage]);
        setActiveTool(null);
        
        // After tool usage, simulate agent handoff or continued conversation
        setTimeout(() => {
          simulateAgentResponse();
        }, 1000);
      }, 2000);
    } else {
      // Direct agent response without tool usage
      simulateAgentResponse();
    }
  };
  
  // Simulate an agent response
  const simulateAgentResponse = () => {
    const currentCase = caseDetail;
    const userQuery = messages[messages.length - 1].content;
    
    // Randomly select if we want to switch agents
    const switchAgent = Math.random() > 0.7;
    
    if (switchAgent) {
      // Select a different agent
      const availableAgents = AGENTS_CONFIG.filter(agent => agent.name !== activeAgent);
      const nextAgentIndex = Math.floor(Math.random() * availableAgents.length);
      const nextAgent = availableAgents[nextAgentIndex];
      
      const handoffMessage: Message = {
        role: 'agent',
        agentName: activeAgent,
        content: `I think this is a matter for ${nextAgent.name}, our ${nextAgent.role}. Let me hand this over.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, handoffMessage]);
      setActiveAgent(nextAgent.name);
      
      // Next agent response
      setTimeout(() => {
        const specialtyResponse = generateSpecialtyResponse(nextAgent, currentCase, userQuery);
        
        const nextAgentMessage: Message = {
          role: 'agent',
          agentName: nextAgent.name,
          content: specialtyResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, nextAgentMessage]);
        setIsProcessing(false);
      }, 1500);
    } else {
      // Current agent continues
      const currentAgentConfig = AGENTS_CONFIG.find(agent => agent.name === activeAgent);
      
      if (currentAgentConfig) {
        const specialtyResponse = generateSpecialtyResponse(currentAgentConfig, currentCase, userQuery);
        
        const agentMessage: Message = {
          role: 'agent',
          agentName: activeAgent,
          content: specialtyResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, agentMessage]);
        setIsProcessing(false);
      }
    }
  };
  
  // Generate a response based on agent specialty
  const generateSpecialtyResponse = (agent: AgentConfig, currentCase: any, userQuery: string): string => {
    // This would be replaced with actual AI responses in a real implementation
    switch (agent.name) {
      case 'Sherlock':
        return `Based on the evidence collected so far for ${currentCase.title}, we need to investigate further. ${userQuery.includes('who') ? "I'm considering several suspects based on the evidence." : "The timeline suggests the incident occurred during off-hours."} What specific aspect would you like us to focus on?`;
      
      case 'DataMiner':
        return `I've analyzed the data related to ${currentCase.title}. ${userQuery.includes('pattern') ? "There's a clear pattern in the logs showing unauthorized access attempts." : "The statistical anomalies suggest this wasn't a random event but carefully planned."} Would you like me to dig deeper into any specific metrics?`;
      
      case 'Inspector':
        return `From the visual evidence in the ${currentCase.title} case, ${userQuery.includes('see') ? "I can identify several important details in the surveillance footage." : "there are subtle clues that might be overlooked at first glance."} Should I enhance any particular images for closer examination?`;
      
      case 'Watson':
        return `My research on similar cases to ${currentCase.title} shows ${userQuery.includes('history') ? "a historical pattern that might be relevant to our investigation." : "several precedents we should consider."} I can provide more context on any aspect you're curious about.`;
      
      default:
        return `I've examined the information related to ${currentCase.title} and have some insights to share. What specifically would you like to know?`;
    }
  };
  
  // Mark the challenge as completed
  const handleCompleteChallenge = () => {
    markChallengeAsCompleted('challenge-detective-league');
    setIsCompleted(true);
  };
  
  // Reset the challenge
  const handleReset = () => {
    setSelectedCase(null);
    setCaseDetail(null);
    setMessages([]);
    setActiveAgent('Sherlock');
    setActiveTool(null);
  };
  
  const handleToolSelect = (toolName: string) => {
    setActiveTool(toolName);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <MessageSquare className="mr-2 text-indigo-600" />
          AI Detective League
        </h1>
        <p className="text-gray-600">
          Experience how AI agents collaborate, use tools, and solve complex problems together as a coordinated team.
        </p>
        {isCompleted && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Check size={16} className="mr-1" /> Challenge completed!
          </div>
        )}
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {!selectedCase ? (
              /* Case selection screen */
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Case</h2>
                <p className="mb-6 text-gray-600">
                  Choose a case for the AI Detective League to solve. You'll interact with multiple AI agents who will collaborate, use specialized tools, and work together to solve the mystery.
                </p>
                
                <div className="grid grid-cols-1 gap-6 mb-4">
                  {DETECTIVE_CASES.map((detectiveCase) => (
                    <div 
                      key={detectiveCase.id}
                      className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-indigo-100 hover:border-indigo-300"
                      onClick={() => handleCaseSelect(detectiveCase.id)}
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 overflow-hidden bg-indigo-50">
                          {detectiveCase.image && (
                            <img 
                              src={detectiveCase.image}
                              alt={detectiveCase.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="md:w-2/3 p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-indigo-900 text-xl">{detectiveCase.title}</h3>
                              <div className="flex items-center mt-1 mb-3">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 mr-2">
                                  {detectiveCase.difficulty}
                                </span>
                                <span className="text-xs text-gray-500">Case #{detectiveCase.id.split('-')[1]}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{detectiveCase.longDescription}</p>
                          
                          <div className="bg-indigo-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium text-indigo-800 mb-1">Key Clues:</h4>
                            <ul className="text-xs text-indigo-700 space-y-1">
                              {detectiveCase.clues.slice(0, 3).map((clue, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-1">•</span> {clue}
                                </li>
                              ))}
                              {detectiveCase.clues.length > 3 && (
                                <li className="text-indigo-800">+ {detectiveCase.clues.length - 3} more clues...</li>
                              )}
                            </ul>
                          </div>
                          
                          <button
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
                          >
                            Investigate Case
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Agent conversation interface */
              <div className="flex flex-col h-[600px]">
                {/* Case header */}
                <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                  <div className="flex justify-between items-center">
                    <h2 className="font-medium text-indigo-900">{caseDetail?.title}</h2>
                    <button
                      onClick={handleReset}
                      className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      New Case
                    </button>
                  </div>
                  {activeAgent && (
                    <div className="flex items-center mt-2">
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center mr-2" 
                        style={{ backgroundColor: AGENTS_CONFIG.find(a => a.name === activeAgent)?.color || '#4A6FDC' }}
                      >
                        {AGENTS_CONFIG.find(a => a.name === activeAgent)?.icon}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{activeAgent}</span>
                        <span className="text-gray-500 ml-1">
                          ({AGENTS_CONFIG.find(a => a.name === activeAgent)?.role})
                        </span>
                      </div>
                      {activeTool && (
                        <div className="ml-auto flex items-center text-sm text-indigo-600">
                          <RefreshCw size={14} className="mr-1 animate-spin" />
                          Using {AVAILABLE_TOOLS.find(t => t.name === activeTool)?.description}...
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Messages area */}
                <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[85%] p-3 rounded-lg
                        ${message.role === 'user' 
                          ? 'bg-blue-100 text-blue-900 rounded-br-none' 
                          : 'bg-white border border-gray-200 shadow-sm rounded-bl-none'
                        }
                      `}>
                        {message.role === 'agent' && (
                          <div className="flex items-center mb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium mr-2 ${
                              message.agentName === 'Sherlock' ? 'bg-indigo-600' :
                              message.agentName === 'DataMiner' ? 'bg-emerald-600' :
                              message.agentName === 'Inspector' ? 'bg-amber-600' :
                              'bg-rose-600'
                            }`}>
                              {message.agentName?.charAt(0)}
                            </div>
                            <span className="font-medium text-sm text-gray-800">{message.agentName}</span>
                            {index > 0 && messages[index-1].role === 'agent' && messages[index-1].agentName !== message.agentName && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                Handoff
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className={`text-sm ${message.role === 'user' ? 'text-blue-900' : 'text-gray-700'}`}>
                          {message.content}
                        </div>
                        
                        {message.includedTool && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-2">
                                <Wrench size={12} />
                              </div>
                              <span className="text-xs font-medium text-purple-700">Using {message.includedTool.description}</span>
                            </div>
                            
                            <div className="bg-gray-50 rounded p-3 text-xs text-gray-700 font-mono whitespace-pre-wrap">
                              {message.includedTool.result.split('\n').map((line, i) => (
                                <div key={i} className="py-0.5">{line.trim()}</div>
                              ))}
                            </div>
                            
                            {message.includedTool.name === 'image_analysis' && (
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 rounded p-1">
                                  <img 
                                    src={`/images/detective/${caseDetail.id === 'missing-artifact' ? 'museum' : caseDetail.id === 'data-breach' ? 'server' : 'street'}.jpg`} 
                                    alt="Evidence" 
                                    className="w-full h-24 object-cover rounded opacity-80"
                                  />
                                  <div className="text-[10px] text-center text-gray-500 mt-1">Evidence photo</div>
                                </div>
                                <div className="bg-gray-50 rounded p-1">
                                  <div className="w-full h-24 bg-black rounded relative overflow-hidden">
                                    <img 
                                      src={`/images/detective/${caseDetail.id === 'missing-artifact' ? 'museum' : caseDetail.id === 'data-breach' ? 'server' : 'street'}.jpg`} 
                                      alt="Analysis" 
                                      className="w-full h-full object-cover opacity-70"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="border-2 border-yellow-400 w-12 h-12 rounded-full animate-ping opacity-70"></div>
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-center text-gray-500 mt-1">Analysis result</div>
                                </div>
                              </div>
                            )}
                            
                            {message.includedTool.name === 'data_analysis' && (
                              <div className="mt-2 bg-gray-50 rounded p-2">
                                <div className="h-16 w-full">
                                  <div className="flex h-full items-end justify-around">
                                    {[...Array(8)].map((_, i) => {
                                      const height = 30 + Math.random() * 70;
                                      return (
                                        <div 
                                          key={i} 
                                          className="w-[8%] bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                                          style={{ height: `${height}%` }}
                                        ></div>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="text-[10px] text-center text-gray-500 mt-1">Data visualization</div>
                              </div>
                            )}
                            
                            {message.includedTool.name === 'face_detection' && (
                              <div className="mt-2 bg-gray-50 rounded p-2">
                                <div className="relative w-full h-32">
                                  <img 
                                    src="/images/detective/people.jpg" 
                                    alt="Face detection" 
                                    className="w-full h-full object-cover rounded"
                                  />
                                  {[...Array(Math.floor(Math.random() * 3) + 2)].map((_, i) => {
                                    const top = 10 + Math.random() * 60;
                                    const left = 10 + Math.random() * 80;
                                    const size = 20 + Math.random() * 30;
                                    return (
                                      <div 
                                        key={i} 
                                        className="absolute border-2 border-red-500 rounded"
                                        style={{ 
                                          top: `${top}%`, 
                                          left: `${left}%`,
                                          width: `${size}%`,
                                          height: `${size * 1.3}%`
                                        }}
                                      ></div>
                                    );
                                  })}
                                </div>
                                <div className="text-[10px] text-center text-gray-500 mt-1">Face detection results</div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-1 text-right text-[10px] text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium mr-2 ${
                            activeAgent === 'Sherlock' ? 'bg-indigo-600' :
                            activeAgent === 'DataMiner' ? 'bg-emerald-600' :
                            activeAgent === 'Inspector' ? 'bg-amber-600' :
                            'bg-rose-600'
                          }`}>
                            {activeAgent?.charAt(0)}
                          </div>
                          <span className="font-medium text-sm text-gray-800">{activeAgent}</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Input area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="Ask the AI Detective League a question..."
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!userInput.trim() || isProcessing}
                      className={`px-4 py-2 rounded-r-md ${
                        !userInput.trim() || isProcessing
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      } text-white`}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent team */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Detective Team</h3>
              </div>
              
              <div className="space-y-3">
                {AGENTS_CONFIG.map((agent) => (
                  <div 
                    key={agent.name} 
                    className={`p-3 rounded-lg border ${
                      activeAgent === agent.name 
                        ? 'border-indigo-300 bg-indigo-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3" 
                        style={{ backgroundColor: agent.color }}
                      >
                        {agent.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{agent.name}</h4>
                        <p className="text-xs text-gray-500">{agent.role}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {agent.specialty.map((skill, i) => (
                            <span 
                              key={i} 
                              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Available tools */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <Wrench size={18} className="mr-2 text-indigo-600" />
                Detective Toolkit
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our agents use these specialized tools to solve cases. Each tool provides unique capabilities.
              </p>

              <div className="mb-4">
                <div className="flex overflow-x-auto space-x-2 pb-2">
                  {TOOL_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveToolCategory(category)}
                      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                        activeToolCategory === category
                          ? 'bg-indigo-100 text-indigo-800 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                {AVAILABLE_TOOLS
                  .filter(tool => !activeToolCategory || tool.category === activeToolCategory)
                  .map((tool) => (
                    <div 
                      key={tool.name} 
                      className="p-3 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer"
                      onClick={() => handleToolSelect(tool.name)}
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-700 flex-shrink-0">
                          {tool.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{tool.name.replace(/_/g, ' ')}</h4>
                          <p className="text-xs text-gray-600">{tool.description}</p>
                          <p className="text-xs text-indigo-600 italic mt-1">{tool.humorousDescription}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Challenge instructions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">About AI Agents</h3>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showInstructions ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showInstructions && (
                <div className="space-y-4 text-sm">
                  <p className="text-gray-600">
                    This challenge demonstrates how AI agents can collaborate to solve complex problems using architectures like OpenAI's Swarm:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-indigo-700 flex-shrink-0 mt-0.5">
                        <span className="text-xs">1</span>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Specialized Agents</p>
                        <p className="text-gray-600 text-xs">
                          Each agent has unique capabilities and expertise areas. In real implementations, specialized agents can have different instructions, knowledge, and capabilities.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-indigo-700 flex-shrink-0 mt-0.5">
                        <span className="text-xs">2</span>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Tool Usage</p>
                        <p className="text-gray-600 text-xs">
                          Agents use specialized tools to gather and process information. In the OpenAI API, tools are defined as functions that agents can call to extend their capabilities beyond just generating text.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-indigo-700 flex-shrink-0 mt-0.5">
                        <span className="text-xs">3</span>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Handoffs & Agent Orchestration</p>
                        <p className="text-gray-600 text-xs">
                          Agents can pass tasks to other agents with more relevant expertise. Using frameworks like Swarm or the OpenAI Assistants API, developers can create networks of agents that collaborate seamlessly.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-indigo-700 flex-shrink-0 mt-0.5">
                        <span className="text-xs">4</span>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Shared Context</p>
                        <p className="text-gray-600 text-xs">
                          All agents maintain awareness of the conversation history, enabling coherent multi-agent workflows with memory and continuity.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded text-blue-700 text-xs">
                    <div className="flex">
                      <HelpCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Real-World Applications</p>
                        <ul className="space-y-1 pl-4 list-disc">
                          <li>Complex customer support systems with specialized support agents</li>
                          <li>Research assistants that gather, analyze, and synthesize information</li>
                          <li>Debugging assistants that can diagnose and fix code issues</li>
                          <li>Content creation pipelines with specialized creators and editors</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Challenge completion */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Award size={18} className="mr-2 text-amber-500" />
                Complete the Challenge
              </h3>
              
              {messages.length > 5 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    You've experienced how AI agents collaborate to solve complex problems. Ready to complete this challenge?
                  </p>
                  
                  <button
                    onClick={handleCompleteChallenge}
                    disabled={isCompleted}
                    className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isCompleted
                        ? 'bg-green-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isCompleted ? 'Challenge Completed!' : 'Complete Challenge'}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-600">
                  <p>Interact with the AI Detective League to complete this challenge.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectiveLeagueMain; 