import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Lightbulb, 
  Search, 
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  BarChart, 
  PieChart, 
  Mail, 
  Briefcase, 
  ArrowRight,
  ExternalLink,
  Globe,
  Zap,
  Presentation,
  Database
} from 'lucide-react';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  industry: string;
  workflow: any[]; // Simplified for this demo
  preview: string;
  status: 'available' | 'premium' | 'coming-soon';
  estimatedValue: string;
  deliverables: string[];
}

interface AgentType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  capabilities: string[];
  tools: string[];
}

// Sample projects
const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'market-analysis',
    title: 'Market Analysis & Competitor Insights',
    description: 'Generate comprehensive market analysis and competitive intelligence reports with actionable insights for business strategy.',
    industry: 'Business Strategy',
    workflow: [], // Will be populated in the workflow designer
    preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'available',
    estimatedValue: '$5,000 - $10,000',
    deliverables: [
      'Comprehensive market analysis report (25-30 pages)',
      'Competitive landscape visualization',
      'SWOT analysis of top 5 competitors',
      'Emerging trends and opportunities overview',
      'Strategic recommendations deck'
    ]
  },
  {
    id: 'content-campaign',
    title: 'Multi-channel Content Campaign',
    description: 'Create a complete content campaign including blog posts, social media content, email sequences, and visual assets.',
    industry: 'Marketing',
    workflow: [], // Will be populated in the workflow designer
    preview: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'available',
    estimatedValue: '$3,500 - $7,000',
    deliverables: [
      '3x long-form blog articles (2,000+ words each)',
      '15x social media posts with images',
      '5-email nurture sequence',
      '2x infographics and data visualizations',
      'Campaign performance analytics dashboard'
    ]
  },
  {
    id: 'product-launch',
    title: 'Product Launch Strategy & Materials',
    description: 'Develop a comprehensive product launch strategy with all necessary marketing materials, press releases, and customer communications.',
    industry: 'Product Marketing',
    workflow: [], // Will be populated in the workflow designer
    preview: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'premium',
    estimatedValue: '$8,000 - $15,000',
    deliverables: [
      'Go-to-market strategy document',
      'Press release and media kit',
      'Product messaging and positioning guide',
      'Launch timeline and responsibilities matrix',
      'Sales enablement materials',
      'Customer communications package'
    ]
  }
];

// Sample agent types
const AGENT_TYPES: AgentType[] = [
  {
    id: 'research-analyst',
    name: 'Research Analyst',
    icon: <Search size={24} />,
    color: '#6366f1',
    description: 'Conducts in-depth research and information gathering from various sources',
    capabilities: [
      'Web research & data collection',
      'Trend identification & analysis',
      'Competitive intelligence gathering',
      'Market size estimation',
      'Citation and source verification'
    ],
    tools: ['web_search', 'data_scraping', 'trend_analysis']
  },
  {
    id: 'content-strategist',
    name: 'Content Strategist',
    icon: <FileText size={24} />,
    color: '#8b5cf6',
    description: 'Develops content strategy and creates high-quality written content',
    capabilities: [
      'Content planning & editorial calendars',
      'Blog post & article writing',
      'Email copywriting',
      'Brand voice consistency',
      'SEO content optimization'
    ],
    tools: ['text_generation', 'content_optimizer', 'text_to_speech']
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: <BarChart size={24} />,
    color: '#ec4899',
    description: 'Analyzes data sets and creates insights and visualizations',
    capabilities: [
      'Data cleaning & preprocessing',
      'Statistical analysis',
      'Trend identification',
      'Data visualization',
      'Predictive modeling'
    ],
    tools: ['data_analysis', 'chart_generation', 'sentiment_analysis']
  },
  {
    id: 'creative-director',
    name: 'Creative Director',
    icon: <ImageIcon size={24} />,
    color: '#f97316',
    description: 'Designs visual assets and creates compelling imagery',
    capabilities: [
      'Image generation & editing',
      'Brand identity development',
      'Visual style guidance',
      'Design system creation',
      'Mockup & prototype design'
    ],
    tools: ['image_generation', 'image_editing', 'style_transfer']
  },
  {
    id: 'communications-expert',
    name: 'Communications Expert',
    icon: <MessageSquare size={24} />,
    color: '#14b8a6',
    description: 'Crafts communications for various audiences and channels',
    capabilities: [
      'Press release writing',
      'Executive communications',
      'Crisis communications',
      'Message development',
      'Presentation creation'
    ],
    tools: ['text_generation', 'sentiment_analysis', 'slide_creator']
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    icon: <Briefcase size={24} />,
    color: '#0ea5e9',
    description: 'Analyzes business operations and provides strategic recommendations',
    capabilities: [
      'SWOT analysis',
      'Process optimization',
      'Business model evaluation',
      'Market opportunity assessment',
      'Risk analysis & mitigation'
    ],
    tools: ['data_analysis', 'process_mapping', 'business_planning']
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    icon: <Presentation size={24} />,
    color: '#22c55e',
    description: 'Coordinates workflow execution and ensures deliverable quality',
    capabilities: [
      'Project planning & timelines',
      'Resource allocation',
      'Quality assurance',
      'Stakeholder communication',
      'Risk management'
    ],
    tools: ['project_tracking', 'quality_checker', 'email_composer']
  },
  {
    id: 'global-market-specialist',
    name: 'Global Market Specialist',
    icon: <Globe size={24} />,
    color: '#3b82f6',
    description: 'Provides insights on international markets and cross-cultural considerations',
    capabilities: [
      'Cultural context analysis',
      'International market assessment',
      'Localization strategy',
      'Global trend identification',
      'Regulatory compliance guidance'
    ],
    tools: ['translation', 'culture_analyzer', 'market_intelligence']
  }
];

interface AgentHubProps {
  onSelectProject: (project: Project) => void;
}

const AgentHub: React.FC<AgentHubProps> = ({ onSelectProject }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'agents'>('projects');
  
  return (
    <div className="space-y-8">
      {/* Main content tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('projects')}
          className={`py-3 px-5 border-b-2 font-medium text-sm ${
            activeTab === 'projects' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Available Projects
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`py-3 px-5 border-b-2 font-medium text-sm ${
            activeTab === 'agents' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Agent Capabilities
        </button>
      </div>
      
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Ready-to-Run Projects</h2>
            <p className="text-gray-600">
              Select a project to customize and deploy a specialized agent workflow that delivers real business value.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SAMPLE_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={project.preview} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                    {project.status === 'premium' && (
                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Briefcase size={14} className="mr-1" /> 
                      <span>{project.industry}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Zap size={14} className="mr-1" /> 
                      <span>Estimated value: {project.estimatedValue}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onSelectProject(project)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <span>Select & Customize</span>
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Benefits section */}
          <div className="rounded-xl p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 mt-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">Why Use Agent Workflows?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 mb-3">
                  <Zap size={20} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">10x Productivity</h4>
                <p className="text-gray-600 text-sm">
                  Complete complex projects in hours instead of weeks with specialized AI agents working in parallel.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-600 mb-3">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Expert-Level Quality</h4>
                <p className="text-gray-600 text-sm">
                  Each agent brings specialized expertise and capabilities that combine to produce professional-grade results.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-pink-100 text-pink-600 mb-3">
                  <Lightbulb size={20} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Strategic Insights</h4>
                <p className="text-gray-600 text-sm">
                  Discover new opportunities and perspectives through comprehensive research and analysis of vast data sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">The Agent Magic Team</h2>
            <p className="text-gray-600">
              Meet our specialized AI agents, each with unique capabilities and expertise. These agents collaborate 
              in workflows to tackle complex business challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENT_TYPES.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
              >
                <div className="flex items-start">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                    style={{ backgroundColor: agent.color, color: 'white' }}
                  >
                    {agent.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{agent.name}</h3>
                    <p className="text-gray-600 text-sm">{agent.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 pl-16">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Capabilities:</h4>
                  <ul className="space-y-1">
                    {agent.capabilities.map((capability, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <span className="text-indigo-500 mr-1.5">•</span>
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          {/* Case Study */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl p-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Case Study: HP Marketing Team</h3>
              <p className="mb-6 opacity-90">
                The HP marketing team deployed agent workflows to create a global product launch campaign for new sustainable laptop models. The agent workflow handled market research, messaging development, content creation, and visual design.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-3xl font-bold text-white mb-1">67%</div>
                  <div className="text-sm text-white opacity-90">Reduction in campaign creation time</div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-3xl font-bold text-white mb-1">42%</div>
                  <div className="text-sm text-white opacity-90">Increase in campaign engagement</div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-3xl font-bold text-white mb-1">$1.2M</div>
                  <div className="text-sm text-white opacity-90">Estimated cost savings</div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <a 
                  href="https://www.hp.com/gb-en/shop/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-indigo-700 hover:bg-opacity-90 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <span>Explore HP Products</span>
                  <ExternalLink size={14} className="ml-1.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentHub; 