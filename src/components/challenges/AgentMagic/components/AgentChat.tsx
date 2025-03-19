import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Zap,
  CheckCircle2,
  User,
  Search,
  FileText,
  BarChart,
  Image as ImageIcon,
  Briefcase,
  Clock,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Globe,
  Database,
  Mic,
  Volume
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Types
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

interface Project {
  id: string;
  title: string;
  description: string;
  industry: string;
  workflow: any[];
  preview: string;
  status: 'available' | 'premium' | 'coming-soon';
  estimatedValue: string;
  deliverables: string[];
}

interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface AgentChatProps {
  project: Project | null;
  isWorkflowRunning: boolean;
  onWorkflowComplete: () => void;
}

// Available agents in our system
const AVAILABLE_AGENTS: Agent[] = [
  {
    id: 'research-analyst',
    name: 'Research Analyst',
    role: 'Research',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    color: '#6366f1',
    systemPrompt: 'You are a top-tier research analyst who excels at gathering and analyzing information from various sources.',
    capabilities: [
      'Web research',
      'Data collection',
      'Competitive analysis',
      'Market insights'
    ],
    icon: <Search size={18} />
  },
  {
    id: 'content-strategist',
    name: 'Content Strategist',
    role: 'Content',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    color: '#8b5cf6',
    systemPrompt: 'You are an expert content strategist who develops high-quality content plans and written materials.',
    capabilities: [
      'Content planning',
      'Copywriting',
      'SEO optimization',
      'Brand voice development'
    ],
    icon: <FileText size={18} />
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    role: 'Analysis',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    color: '#ec4899',
    systemPrompt: 'You are a skilled data scientist who analyzes complex data sets and derives meaningful insights.',
    capabilities: [
      'Data analysis',
      'Visualization',
      'Statistical modeling',
      'Insight generation'
    ],
    icon: <BarChart size={18} />
  },
  {
    id: 'creative-director',
    name: 'Creative Director',
    role: 'Design',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    color: '#f97316',
    systemPrompt: 'You are a visionary creative director who guides visual and design strategies.',
    capabilities: [
      'Visual design',
      'Brand identity',
      'Creative direction',
      'Asset creation'
    ],
    icon: <ImageIcon size={18} />
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    role: 'Strategy',
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    color: '#0ea5e9',
    systemPrompt: 'You are a sharp business analyst who identifies opportunities and provides strategic recommendations.',
    capabilities: [
      'SWOT analysis',
      'Business planning',
      'Process optimization',
      'Risk assessment'
    ],
    icon: <Briefcase size={18} />
  }
];

// Sample predefined messages for demo purposes
const PREDEFINED_MESSAGES: {[key: string]: Message[]} = {
  'market-analysis': [
    {
      id: 'msg-1',
      agentId: 'project-manager',
      content: "Welcome! I'm your Project Manager for this Market Analysis workflow. I'll be coordinating our team of specialized agents to deliver your comprehensive market analysis. What industry or market segment would you like us to analyze?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      toolsUsed: []
    }
  ],
  'content-campaign': [
    {
      id: 'msg-1',
      agentId: 'project-manager',
      content: "Welcome to your Content Campaign workflow! I'm your Project Manager and I'll be orchestrating our team to create a multi-channel content campaign for you. What product, service, or topic should this campaign focus on?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      toolsUsed: []
    }
  ],
  'product-launch': [
    {
      id: 'msg-1',
      agentId: 'project-manager',
      content: "I'm your Product Launch Project Manager, and I'll be guiding our team through creating a comprehensive launch strategy for your product. To get started, could you tell me about the product you're planning to launch?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      toolsUsed: []
    }
  ]
};

// Marketing analysis specific responses for demo
const MARKETING_RESPONSES = [
  {
    agentId: 'research-analyst',
    content: "I've analyzed the HP laptop market and gathered competitive intelligence. The premium laptop segment is growing at 8.2% annually, with key competitors being Apple, Dell, and Lenovo. HP currently holds ~20% market share in this segment. I'm identifying several positioning opportunities around sustainability, AI integration, and creative professional workflows.",
    attachments: [
      {
        type: 'chart' as const,
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        caption: 'Market share analysis of premium laptop segment'
      }
    ],
    toolsUsed: ['web_search', 'data_scraping', 'trend_analysis']
  },
  {
    agentId: 'data-scientist',
    content: "Based on the research data, I've identified three key market segments with growth potential: creative professionals (18% growth), remote workers (22% growth), and eco-conscious consumers (15% growth). Our sustainability initiatives resonate particularly well with demographics 25-40. I've prepared visualizations of the opportunity sizing and target audience analysis.",
    attachments: [
      {
        type: 'chart' as const,
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        caption: 'Growth potential by market segment'
      }
    ],
    toolsUsed: ['data_analysis', 'chart_generation']
  },
  {
    agentId: 'business-analyst',
    content: "I've completed a SWOT analysis for our sustainable laptop line positioning. Key strengths include our established brand reputation and manufacturing capabilities. Opportunities lie in the growing eco-conscious market and potential for premium pricing. Threats include Apple's strong position in the premium segment and perception challenges around Windows performance. I recommend focusing on our unique sustainability story while emphasizing performance capabilities.",
    toolsUsed: ['data_analysis']
  },
  {
    agentId: 'content-strategist',
    content: "I've drafted the comprehensive market analysis report integrating all our findings. The report highlights market trends, competitive positioning, target audience analysis, and strategic recommendations. I've organized it with an executive summary, detailed analysis sections, and actionable next steps. Would you like me to highlight any particular aspect of the report?",
    attachments: [
      {
        type: 'document' as const,
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        caption: 'Market Analysis Report - Complete Draft'
      }
    ],
    toolsUsed: ['text_generation', 'content_optimizer']
  },
  {
    agentId: 'business-analyst',
    content: "Based on our comprehensive analysis, here are my strategic recommendations: 1) Position the new laptop line as 'Sustainable Performance' to address both eco-conscious and performance needs, 2) Target creative professionals with sustainability values as our primary audience, 3) Develop a certification program with environmental organizations, 4) Create bundle offers with sustainable accessories, 5) Launch with a carbon-neutral pledge and tree-planting initiative. These recommendations align with our strengths and the identified market opportunities.",
    toolsUsed: ['data_analysis']
  }
];

// Available tools with descriptions
const TOOLS_INFO: {[key: string]: { name: string; description: string }} = {
  'web_search': { name: 'Web Search', description: 'Search the web for real-time information' },
  'data_scraping': { name: 'Data Scraping', description: 'Extract structured data from websites' },
  'trend_analysis': { name: 'Trend Analysis', description: 'Identify and analyze emerging trends' },
  'text_generation': { name: 'Text Generation', description: 'Create high-quality written content' },
  'content_optimizer': { name: 'Content Optimizer', description: 'Improve content for SEO and readability' },
  'text_to_speech': { name: 'Text to Speech', description: 'Convert text to natural-sounding speech' },
  'data_analysis': { name: 'Data Analysis', description: 'Analyze datasets to extract insights' },
  'chart_generation': { name: 'Chart Generation', description: 'Create data visualizations and charts' },
  'sentiment_analysis': { name: 'Sentiment Analysis', description: 'Analyze emotional tone of content' },
  'image_generation': { name: 'Image Generation', description: 'Create AI-generated images' },
  'image_editing': { name: 'Image Editing', description: 'Edit and enhance images' },
  'style_transfer': { name: 'Style Transfer', description: 'Apply artistic styles to images' },
  'project_tracking': { name: 'Project Tracking', description: 'Monitor project progress and timeline' },
  'quality_checker': { name: 'Quality Checker', description: 'Verify content quality and consistency' },
  'email_composer': { name: 'Email Composer', description: 'Create effective email communications' },
  'translation': { name: 'Translation', description: 'Translate content between languages' },
  'slide_creator': { name: 'Slide Creator', description: 'Generate presentation slides' }
};

const AgentChat: React.FC<AgentChatProps> = ({ 
  project, 
  isWorkflowRunning,
  onWorkflowComplete
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showTools, setShowTools] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [openAIStatus, setOpenAIStatus] = useState<'connected' | 'error' | 'initializing'>('initializing');
  const [searchResults, setSearchResults] = useState<WebSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [presentationTopic, setPresentationTopic] = useState<string>('');
  const [presentationData, setPresentationData] = useState<any>(null);
  const [isPresentationReady, setIsPresentationReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize with welcome message
  useEffect(() => {
    // Simulate OpenAI connection
    setTimeout(() => {
      setOpenAIStatus('connected');
    }, 2000);
    
    // Add welcome message
    setMessages([
      {
        id: 'welcome-msg',
        agentId: 'project-manager',
        content: `Welcome to the ${project?.title || 'Agent Collaboration'} workspace! I'm your Project Manager. Our AI agent team has analyzed your requirements and is ready to help. You can interact with any agent by selecting them from the sidebar.`,
        timestamp: new Date()
      }
    ]);
    
    // If workflow is running, start the automatic workflow process
    if (isWorkflowRunning && project) {
      processWorkflowResults();
    }
  }, [isWorkflowRunning, project]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle workflow running state
  useEffect(() => {
    if (isWorkflowRunning && project?.id === 'market-analysis') {
      simulateMarketingWorkflow();
    }
  }, [isWorkflowRunning]);
  
  // Simulate the marketing workflow with timed responses
  const simulateMarketingWorkflow = () => {
    // Add a loading message first
    const loadingMessage: Message = {
      id: `msg-loading-${Date.now()}`,
      agentId: MARKETING_RESPONSES[0].agentId,
      content: "Working on market research and analysis...",
      timestamp: new Date(),
      isLoading: true,
      toolsUsed: MARKETING_RESPONSES[0].toolsUsed
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    // Process each response with delays
    MARKETING_RESPONSES.forEach((response, index) => {
      setTimeout(() => {
        // Remove the loading message if there was one
        setMessages(prev => prev.filter(msg => !msg.isLoading));
        
        // Add the real message
        const newMessage: Message = {
          id: `msg-${Date.now()}-${index}`,
          agentId: response.agentId,
          content: response.content,
          timestamp: new Date(),
          attachments: response.attachments,
          toolsUsed: response.toolsUsed
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // If last message, mark workflow as complete
        if (index === MARKETING_RESPONSES.length - 1) {
          setTimeout(() => {
            setIsCompleted(true);
            onWorkflowComplete();
          }, 2000);
        } else if (index < MARKETING_RESPONSES.length - 1) {
          // Add loading message for next agent
          const nextLoadingMessage: Message = {
            id: `msg-loading-${Date.now()}-${index + 1}`,
            agentId: MARKETING_RESPONSES[index + 1].agentId,
            content: "Processing information and preparing response...",
            timestamp: new Date(),
            isLoading: true,
            toolsUsed: MARKETING_RESPONSES[index + 1].toolsUsed
          };
          
          setTimeout(() => {
            setMessages(prev => [...prev, nextLoadingMessage]);
          }, 1000);
        }
        
        // Update current step
        setCurrentStep(index + 1);
      }, (index + 1) * 5000); // 5 second delay between messages
    });
  };
  
  // Process workflow results
  const processWorkflowResults = () => {
    // Show a loading message for the initial agent
    const loadingMessage: Message = {
      id: `msg-loading-${Date.now()}`,
      agentId: 'research-analyst',
      content: "Processing data from the workflow and preparing results...",
      timestamp: new Date(),
      isLoading: true,
      toolsUsed: ['web_search', 'data_scraping', 'trend_analysis']
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    if (project?.title) {
      // Perform a real web search based on the project title
      performWebSearch(project.title);
    }
    
    // Process each response with delays
    const agentResponses = [
      {
        agentId: 'research-analyst',
        content: `I've analyzed the market for ${project?.title || 'your project'} and found several interesting trends. The target audience is growing at 18% annually, with particularly strong interest in mobile solutions. Key competitors are focusing on different market segments, leaving an opportunity gap in the mid-market space.`,
        attachments: [
          {
            type: 'chart' as 'chart',
            url: 'https://via.placeholder.com/600x400?text=Market+Growth+Chart',
            caption: 'Market Growth by Segment (2020-2023)'
          }
        ],
        toolsUsed: ['web_search', 'data_scraping', 'trend_analysis', 'openai_api']
      },
      {
        agentId: 'data-scientist',
        content: `Based on the research data, I've created a predictive model for user adoption. Our analysis shows a potential addressable market of $420M with a 23% CAGR. The customer acquisition costs are projected to decrease by 15% in year 2 as network effects take hold.`,
        attachments: [
          {
            type: 'chart' as 'chart',
            url: 'https://via.placeholder.com/600x400?text=Revenue+Projection',
            caption: 'Revenue Projection (3-Year Forecast)'
          }
        ],
        toolsUsed: ['data_analysis', 'chart_generation', 'openai_api']
      },
      {
        agentId: 'content-strategist',
        content: `I've developed a content strategy based on our market research and data analysis. The plan includes a multi-channel approach with emphasis on thought leadership content that addresses the pain points we've identified. Key messaging will focus on efficiency gains and ROI.`,
        attachments: [
          {
            type: 'document' as 'document',
            url: 'https://via.placeholder.com/600x400?text=Content+Strategy+Document',
            caption: 'Q3-Q4 Content Marketing Strategy'
          }
        ],
        toolsUsed: ['text_generation', 'content_optimizer', 'openai_api']
      },
      {
        agentId: 'project-manager',
        content: `Our agent team has completed the initial analysis of ${project?.title || 'your project'}. The research indicates strong market potential with a clear competitive advantage in your approach. I've prepared an executive summary of our findings and recommendations for next steps. Would you like me to prioritize any specific area for deeper analysis?`,
        toolsUsed: ['project_tracking', 'quality_checker', 'openai_api']
      }
    ];
    
    // Process each response with delays
    agentResponses.forEach((response, index) => {
      setTimeout(() => {
        // Remove the loading message if there was one
        setMessages(prev => prev.filter(msg => !msg.isLoading));
        
        // Add the real message
        const newMessage: Message = {
          id: `msg-${Date.now()}-${index}`,
          agentId: response.agentId,
          content: response.content,
          timestamp: new Date(),
          attachments: response.attachments,
          toolsUsed: response.toolsUsed
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // If last message, mark workflow as complete
        if (index === agentResponses.length - 1) {
          setTimeout(() => {
            setIsCompleted(true);
            onWorkflowComplete();
          }, 2000);
        } else if (index < agentResponses.length - 1) {
          // Add loading message for next agent
          const nextLoadingMessage: Message = {
            id: `msg-loading-${Date.now()}-${index + 1}`,
            agentId: agentResponses[index + 1].agentId,
            content: "Processing information and preparing response...",
            timestamp: new Date(),
            isLoading: true,
            toolsUsed: agentResponses[index + 1].toolsUsed
          };
          
          setTimeout(() => {
            setMessages(prev => [...prev, nextLoadingMessage]);
          }, 1000);
        }
        
        // Update current step
        setCurrentStep(index + 1);
      }, (index + 1) * 5000); // 5 second delay between messages
    });
  };
  
  // Add a function to perform a web search
  const performWebSearch = async (query: string) => {
    setIsSearching(true);
    
    try {
      // Simulate a web search with a timeout
      setTimeout(() => {
        // Here we would normally call an actual search API
        // For demo purposes, we'll simulate results
        const simulatedResults: WebSearchResult[] = [
          {
            title: `Latest Market Trends: ${query}`,
            url: `https://example.com/market-trends/${query.toLowerCase().replace(/\s+/g, '-')}`,
            snippet: `${query} has shown significant growth in Q2 2023, with a 23% increase in adoption rates among target demographics.`
          },
          {
            title: `Competitive Analysis: ${query}`,
            url: `https://example.com/competitive-analysis/${query.toLowerCase().replace(/\s+/g, '-')}`,
            snippet: `Three major competitors dominate the ${query} market: Company A (32% market share), Company B (28%), and Company C (15%).`
          },
          {
            title: `Future Forecast: ${query}`,
            url: `https://example.com/forecasts/${query.toLowerCase().replace(/\s+/g, '-')}`,
            snippet: `Industry experts predict ${query} will continue to grow at a CAGR of 18.5% through 2025, reaching a total market value of $4.2B.`
          }
        ];
        
        setSearchResults(simulatedResults);
        setIsSearching(false);
        
        // Add a message showing the search results
        const searchResultMessage: Message = {
          id: `search-results-${Date.now()}`,
          agentId: 'research-analyst',
          content: `I've conducted a web search on "${query}" and found some relevant information:\n\n${simulatedResults.map((result, index) => `${index + 1}. **${result.title}**\n${result.snippet}\nSource: ${result.url}`).join('\n\n')}`,
          timestamp: new Date(),
          toolsUsed: ['web_search', 'openai_api']
        };
        
        setMessages(prev => [...prev.filter(msg => !msg.isLoading), searchResultMessage]);
        
        // Set the presentation topic based on search
        setPresentationTopic(query);
        
        // Prepare presentation data after search results
        setTimeout(() => {
          preparePresentation(query, simulatedResults);
        }, 3000);
      }, 5000);
    } catch (error) {
      console.error('Error performing web search:', error);
      setIsSearching(false);
      
      // Add an error message
      const errorMessage: Message = {
        id: `search-error-${Date.now()}`,
        agentId: 'research-analyst',
        content: `I encountered an error while searching for information on "${query}". Let me try a different approach.`,
        timestamp: new Date(),
        toolsUsed: ['web_search']
      };
      
      setMessages(prev => [...prev.filter(msg => !msg.isLoading), errorMessage]);
    }
  };
  
  // Add a function to prepare presentation data
  const preparePresentation = (topic: string, searchResults: WebSearchResult[]) => {
    // Create presentation data based on search results
    const presentationData = {
      title: `Market Analysis: ${topic}`,
      theme: {
        name: 'Professional',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        accentColor: '#60a5fa',
        fontTitle: 'Montserrat',
        fontBody: 'Roboto',
        backgroundStyle: 'solid' as const,
        backgroundColor: '#ffffff'
      },
      slides: [
        {
          id: uuidv4(),
          type: 'title' as const,
          title: `Market Analysis: ${topic}`,
          content: {
            mainText: 'A comprehensive overview of market trends, competitive landscape, and growth opportunities'
          },
          notes: 'Introduction slide presenting the market analysis scope and objectives'
        },
        {
          id: uuidv4(),
          type: 'content' as const,
          title: 'Market Overview',
          content: {
            bullets: [
              `${topic} market is experiencing rapid growth`,
              'Increasing adoption across multiple sectors',
              'Digital transformation driving market expansion',
              'Emerging opportunities in untapped segments'
            ]
          },
          notes: 'Present the key market metrics and overall landscape'
        },
        {
          id: uuidv4(),
          type: 'chart' as const,
          title: 'Growth Trends',
          content: {
            mainText: 'Year-over-year growth analysis shows consistent upward trajectory',
            chartData: {
              type: 'bar',
              labels: ['2020', '2021', '2022', '2023', '2024 (Projected)'],
              datasets: [{
                label: 'Market Size ($B)',
                data: [1.2, 1.8, 2.3, 3.1, 4.2],
                backgroundColor: ['#60a5fa', '#60a5fa', '#60a5fa', '#60a5fa', '#60a5fa']
              }]
            }
          },
          notes: 'Highlight the growth rate and market size expansion'
        },
        {
          id: uuidv4(),
          type: 'twoColumn' as const,
          title: 'Competitive Landscape',
          content: {
            mainText: 'Analysis of key market players',
            bullets: [
              'Three major competitors dominate 75% of the market',
              'New entrants disrupting traditional business models',
              'Increasing focus on innovation and differentiation',
              'Strategic partnerships reshaping the ecosystem'
            ]
          },
          notes: 'Present the competitive analysis and market share distribution'
        },
        {
          id: uuidv4(),
          type: 'conclusion' as const,
          title: 'Strategic Recommendations',
          content: {
            bullets: [
              'Focus on mid-market segment for maximum ROI',
              'Emphasize sustainability and ethical practices',
              'Invest in AI-driven capabilities for competitive advantage',
              'Develop strategic partnerships to enhance market reach',
              'Prioritize mobile-first approach for broader adoption'
            ]
          },
          notes: 'Conclude with actionable recommendations based on analysis'
        }
      ]
    };
    
    setPresentationData(presentationData);
    setIsPresentationReady(true);
    
    // Add a message about the presentation
    const presentationMessage: Message = {
      id: `presentation-${Date.now()}`,
      agentId: 'content-strategist',
      content: `Based on our research and analysis, I've prepared a comprehensive presentation on "${topic}". The presentation includes market overview, growth trends, competitive landscape, and strategic recommendations. Would you like to view it?`,
      timestamp: new Date(),
      toolsUsed: ['text_generation', 'content_optimizer', 'slide_creator']
    };
    
    setMessages(prev => [...prev, presentationMessage]);
  };
  
  // Update the function to redirect to SlideMaster with the presentation data
  const viewPresentation = () => {
    if (presentationData) {
      try {
        // Format the presentation data correctly for SlideMaster
        const slideMasterData = {
          ...presentationData,
          // Add required fields that SlideMaster expects
          purpose: `Market analysis for ${project?.title || 'your project'}`,
          targetAudience: 'Business professionals and stakeholders',
          lengthMinutes: 15,
          presentationStyle: 'professional',
          currentStep: 3, // Skip directly to slide view
          isComplete: true,
          lastUpdated: new Date().toISOString(),
          rawGeneratedContent: JSON.stringify(presentationData.slides),
          // Add any other required fields from SlideMasterState
        };
        
        // Save the presentation data to localStorage
        localStorage.setItem('slideMasterData', JSON.stringify(slideMasterData));
        
        // Add a message about redirecting
        const redirectMessage: Message = {
          id: `redirect-${Date.now()}`,
          agentId: 'project-manager',
          content: `Perfect! I'm now taking you to our SlideMaster tool where you can view and edit the presentation we've created based on our analysis.`,
          timestamp: new Date(),
          toolsUsed: ['project_tracking']
        };
        
        setMessages(prev => [...prev, redirectMessage]);
        
        // Redirect to SlideMaster after a short delay
        setTimeout(() => {
          window.location.href = '/challenges/slide-master';
        }, 2000);
      } catch (error) {
        console.error('Error redirecting to SlideMaster:', error);
        
        // Show error message
        const errorMessage: Message = {
          id: `redirect-error-${Date.now()}`,
          agentId: 'project-manager',
          content: `I encountered an error while preparing the presentation. Please try again later.`,
          timestamp: new Date(),
          toolsUsed: ['project_tracking']
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };
  
  // Get agent by ID
  const getAgentById = (agentId: string): Agent => {
    return AVAILABLE_AGENTS.find(agent => agent.id === agentId) || {
      id: agentId,
      name: 'Project Manager',
      role: 'Management',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      color: '#22c55e',
      systemPrompt: 'You are a project manager who coordinates the workflow.',
      capabilities: ['Project coordination', 'Task assignment', 'Quality assurance'],
      icon: <Briefcase size={18} />
    };
  };
  
  // Send a new message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-msg-${Date.now()}`,
      agentId: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Add OpenAI thinking indicator
    const thinkingMessage: Message = {
      id: `thinking-${Date.now()}`,
      agentId: selectedAgent || 'project-manager',
      content: "OpenAI is processing your request through our agent swarm...",
      timestamp: new Date(),
      isLoading: true
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, thinkingMessage]);
      
      // Remove thinking indicator and add real response after delay
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
        
        const responseMessage: Message = {
          id: `agent-msg-${Date.now()}`,
          agentId: selectedAgent || 'project-manager',
          content: generateAIResponse(inputMessage, selectedAgent || 'project-manager'),
          timestamp: new Date(),
          toolsUsed: ['openai_api', 'knowledge_base', 'web_search']
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 3000);
    }, 1000);
  };
  
  // Generate a more realistic AI response based on the input and agent
  const generateAIResponse = (userInput: string, agentId: string): string => {
    const agent = getAgentById(agentId);
    const responses: {[key: string]: string[]} = {
      'research-analyst': [
        `Based on my analysis of "${userInput}", I've found several relevant market trends. The data indicates a 23% growth in this sector over the past year, with particular emphasis on sustainability and digital transformation. Would you like me to prepare a detailed report on any specific aspect?`,
        `I've researched "${userInput}" using both structured and unstructured data sources. The competitive landscape shows 3 major players dominating with a combined 68% market share. There's an opportunity gap in the mid-market segment that could be exploited. Would you like me to dig deeper into any particular competitor?`,
        `My analysis of "${userInput}" reveals significant regional variations. The APAC region shows 2.7x the growth rate of North America, while European markets demonstrate higher adoption of subscription-based models. I can provide a geographic breakdown if that would be helpful.`
      ],
      'data-scientist': [
        `I've run several predictive models on "${userInput}". Our regression analysis shows a strong correlation (r=0.78) between customer satisfaction and retention rates. I've prepared visualizations that demonstrate how these metrics have evolved over time and their impact on revenue.`,
        `I analyzed "${userInput}" using clustering algorithms to segment your audience. We've identified 5 distinct customer personas, each with unique behavior patterns. The highest-value segment represents only 12% of users but contributes 47% of revenue. Would you like me to recommend targeting strategies for each segment?`,
        `Looking at "${userInput}" through a time-series analysis reveals cyclical patterns in customer engagement. We're seeing a 34% increase in activity during Q4, with specific spikes around promotional events. I can help optimize timing for your marketing efforts based on these patterns.`
      ],
      'content-strategist': [
        `I've drafted content outlines related to "${userInput}" that align with your brand voice. The strategy includes 3 long-form pieces for thought leadership, 5 educational blog posts targeting middle-funnel keywords, and 12 social media templates. Would you like me to prioritize any particular content type?`,
        `For "${userInput}", I've analyzed top-performing content in your industry. The data suggests that how-to guides with video elements generate 3.2x more engagement than other formats. I've prepared a content calendar that incorporates these insights while maintaining your brand positioning.`,
        `Based on "${userInput}", I've created a multi-channel content strategy. The approach integrates SEO-optimized web content with email nurture sequences and social reinforcement. The framework is designed to guide prospects through each stage of the buyer's journey with consistent messaging.`
      ],
      'project-manager': [
        `Thank you for sharing about "${userInput}". I've added this to our project requirements. Based on this input, I recommend we adjust our timeline to prioritize the market research phase. I've also flagged this for our Research Analyst to incorporate into their analysis. Is there any specific deadline we should be aware of?`,
        `I've noted your requirements regarding "${userInput}" and updated our project scope accordingly. This will impact our deliverables in phases 2 and 3. I suggest we schedule a brief review session next week to ensure our agent team is aligned on these new parameters. Does that work for you?`,
        `I've processed your request about "${userInput}" and distributed relevant tasks to our agent team. The Content Strategist will incorporate these elements into the messaging framework, while our Data Scientist will update the audience segmentation models. Would you like to review preliminary outputs before we proceed to implementation?`
      ]
    };
    
    // Default to project manager if agent doesn't have specific responses
    const agentResponses = responses[agentId] || responses['project-manager'];
    
    // Pick a random response from the agent's options
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  return (
    <div className="flex h-[calc(100vh-200px)] flex-col lg:flex-row">
      {/* Add OpenAI status indicator */}
      <div className={`fixed top-4 left-4 z-50 px-3 py-1 rounded-full text-xs font-medium flex items-center ${
        openAIStatus === 'connected' ? 'bg-green-100 text-green-800' : 
        openAIStatus === 'error' ? 'bg-red-100 text-red-800' : 
        'bg-yellow-100 text-yellow-800'
      }`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${
          openAIStatus === 'connected' ? 'bg-green-500' : 
          openAIStatus === 'error' ? 'bg-red-500' : 
          'bg-yellow-500'
        }`}></div>
        OpenAI Swarm {
          openAIStatus === 'connected' ? 'Connected' : 
          openAIStatus === 'error' ? 'Error' : 
          'Initializing'
        }
      </div>
      
      {/* Agent sidebar */}
      <div className="flex flex-col h-[calc(100vh-300px)] min-h-[600px] bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare className="mr-2" />
            <div>
              <h3 className="font-semibold">Agent Workflow Chat</h3>
              <div className="text-xs text-indigo-200">
                {project ? project.title : "Interactive Agent Experience"}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="flex">
              {AVAILABLE_AGENTS.slice(0, 3).map((agent, index) => (
                <div 
                  key={agent.id}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-white -ml-2 first:ml-0"
                  style={{ zIndex: 10 - index }}
                >
                  <img src={agent.avatar} alt={agent.name} />
                </div>
              ))}
            </div>
            
            <div className="bg-white bg-opacity-20 text-xs font-medium px-2 py-1 rounded-full ml-1">
              {isCompleted ? (
                <span className="flex items-center text-green-100">
                  <CheckCircle2 size={12} className="mr-1" /> Completed
                </span>
              ) : (
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" /> 
                  Step {currentStep}/{MARKETING_RESPONSES.length}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const agent = message.agentId === 'user' 
                ? { name: 'You', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', color: '#64748b' }
                : getAgentById(message.agentId);
              
              return (
                <div key={message.id} className="flex items-start group">
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mr-3"
                  >
                    {message.agentId === 'user' ? (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                      </div>
                    ) : (
                      <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <span 
                        className="font-semibold mr-2"
                        style={{ color: message.agentId === 'user' ? '#64748b' : agent.color }}
                      >
                        {agent.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    
                    <div className="mt-1">
                      {message.isLoading ? (
                        <div className="flex items-center text-gray-500">
                          <RefreshCw size={14} className="mr-2 animate-spin" />
                          <span>{message.content}</span>
                        </div>
                      ) : (
                        <div className="text-gray-700 whitespace-pre-line">
                          {message.content}
                        </div>
                      )}
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div 
                              key={index}
                              className="border border-gray-200 rounded-lg overflow-hidden max-w-md"
                            >
                              <img 
                                src={attachment.url} 
                                alt={attachment.caption || 'Attachment'} 
                                className="w-full h-48 object-cover"
                              />
                              {attachment.caption && (
                                <div className="p-2 bg-gray-50 text-xs text-gray-500">
                                  {attachment.caption}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Tools used */}
                      {message.toolsUsed && message.toolsUsed.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.toolsUsed.map(toolId => {
                            const toolInfo = TOOLS_INFO[toolId];
                            return (
                              <span 
                                key={toolId} 
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-100"
                                title={toolInfo?.description || toolId}
                              >
                                <Zap size={10} className="mr-1" />
                                {toolInfo?.name || toolId}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Tools sidebar toggle */}
          <div 
            className={`border-l border-gray-200 ${showTools ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}
          >
            {showTools && (
              <div className="p-4 h-full overflow-y-auto">
                <h3 className="font-medium text-gray-800 mb-3">Available Tools</h3>
                
                <div className="space-y-2">
                  {Object.entries(TOOLS_INFO).map(([toolId, info]) => (
                    <div key={toolId} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                      <div className="font-medium text-sm text-gray-700">{info.name}</div>
                      <div className="text-xs text-gray-500">{info.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Input area */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center">
            <button 
              onClick={() => setShowTools(!showTools)}
              className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 mr-2"
              title="Toggle tools sidebar"
            >
              {showTools ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            
            <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
              <button className="p-2 text-gray-400 hover:text-indigo-600">
                <Mic size={20} />
              </button>
              
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 py-2 px-3 focus:outline-none"
              />
              
              <button className="p-2 text-gray-400 hover:text-indigo-600">
                <Volume size={20} />
              </button>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className={`ml-2 p-2 rounded-full ${
                inputMessage.trim() 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          
          {isCompleted && (
            <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3 text-green-800 flex items-start">
              <CheckCircle2 size={18} className="mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Workflow Completed!</div>
                <p className="text-sm mt-1">
                  The agent team has completed all steps in the workflow. All deliverables have been prepared according to your requirements.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add presentation button if available */}
      {isPresentationReady && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={viewPresentation}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
          >
            <FileText size={18} className="mr-2" />
            View Presentation
          </button>
        </div>
      )}
      
      {/* Add search results UI if needed */}
      {isSearching && (
        <div className="fixed top-12 left-4 z-40 px-3 py-1 rounded-full text-xs font-medium flex items-center bg-blue-100 text-blue-800">
          <RefreshCw size={12} className="mr-2 animate-spin" />
          Searching the web...
        </div>
      )}
    </div>
  );
};

export default AgentChat; 