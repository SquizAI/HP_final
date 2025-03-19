import React from 'react';
import { 
  Briefcase, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Star,
  Calendar,
  Clock,
  ShieldCheck,
  Users
} from 'lucide-react';

// Types
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

interface ProjectGalleryProps {
  onSelectProject: (project: Project) => void;
}

// Sample gallery projects
const GALLERY_PROJECTS: Project[] = [
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
  },
  {
    id: 'annual-report',
    title: 'Annual Report Design & Production',
    description: 'Create a professional annual report with financial analysis, shareholder information, and corporate achievements.',
    industry: 'Corporate Communications',
    workflow: [], // Will be populated in the workflow designer
    preview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'coming-soon',
    estimatedValue: '$7,500 - $12,000',
    deliverables: [
      'Annual report (print and digital versions)',
      'Financial performance visualizations',
      'Executive summary and leadership messages',
      'Corporate social responsibility section',
      'Interactive digital version with expanded content'
    ]
  },
  {
    id: 'sales-enablement',
    title: 'Sales Enablement Toolkit',
    description: 'Build a comprehensive sales enablement toolkit with sales decks, battlecards, scripts, and ROI calculators.',
    industry: 'Sales',
    workflow: [], // Will be populated in the workflow designer
    preview: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'coming-soon',
    estimatedValue: '$5,000 - $9,000',
    deliverables: [
      'Master sales presentation deck',
      'Competitor battlecards',
      'Discovery call script with objection handling',
      'ROI calculator and value proposition tools',
      'Product demo storylines and outlines'
    ]
  },
  {
    id: 'event-marketing',
    title: 'Event Marketing Campaign',
    description: 'Create a complete event marketing campaign including promotional materials, email sequences, registration pages, and follow-up content.',
    industry: 'Event Marketing',
    workflow: [], // Will be populated in the workflow designer
    preview: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'premium',
    estimatedValue: '$6,000 - $11,000',
    deliverables: [
      'Event branding package and visual identity',
      'Website landing page with registration form',
      'Email campaign series (announcement, reminder, follow-up)',
      'Social media promotional content',
      'Post-event content package and attendee communications'
    ]
  }
];

// Success stories for the gallery
const SUCCESS_STORIES = [
  {
    company: 'TechSolutions Inc.',
    project: 'Market Analysis for New SaaS Product',
    results: [
      'Identified underserved $1.3B market segment',
      '52% reduction in go-to-market timeline',
      'Secured $4M in additional investor funding'
    ],
    logo: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: "The agent workflow delivered insights we would have missed. What would have taken our team 6 weeks was completed in just 3 days with remarkable quality."
  },
  {
    company: 'GreenEarth Products',
    project: 'Product Launch Strategy',
    results: [
      '132% of sales target achieved in first quarter',
      '28% higher media coverage than previous launches',
      '47% increase in social engagement metrics'
    ],
    logo: 'https://randomuser.me/api/portraits/women/64.jpg',
    quote: "The AI workflow created a launch strategy that perfectly aligned with our sustainable brand values while driving exceptional market results."
  },
  {
    company: 'FintechFuture',
    project: 'Content Marketing Campaign',
    results: [
      '319% increase in qualified lead generation',
      '64% reduction in customer acquisition cost',
      '18% higher conversion rates from blog content'
    ],
    logo: 'https://randomuser.me/api/portraits/men/45.jpg',
    quote: "The depth and quality of content produced by the agent team surpassed what our previous agency delivered, at a fraction of the time and cost."
  }
];

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ onSelectProject }) => {
  return (
    <div className="space-y-12">
      {/* Gallery intro */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Gallery</h2>
        <p className="text-gray-600 max-w-3xl">
          Browse our showcase of ready-to-deploy agent workflows designed for common business challenges. 
          Each project demonstrates the power of specialized AI agents working together to deliver real business value.
        </p>
      </div>
      
      {/* Featured projects */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Star className="mr-2 text-amber-500" size={20} /> 
          Featured Projects
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.preview} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  {project.status === 'premium' && (
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      PREMIUM
                    </span>
                  )}
                  {project.status === 'coming-soon' && (
                    <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      COMING SOON
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">{project.description}</p>
                
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
                  onClick={() => project.status === 'available' || project.status === 'premium' ? onSelectProject(project) : null}
                  className={`w-full font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${
                    project.status === 'coming-soon'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                  }`}
                  disabled={project.status === 'coming-soon'}
                >
                  {project.status === 'coming-soon' ? (
                    <span>Coming Soon</span>
                  ) : (
                    <>
                      <span>Select Project</span>
                      <ArrowRight size={16} className="ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Benefits section */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Why Choose Agent Workflows?
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <Clock className="text-indigo-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">10x Faster Execution</h4>
            <p className="text-gray-600 text-sm">
              Complete complex projects in days instead of weeks or months with parallel processing and 24/7 operation.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Users className="text-purple-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Expert-Level Quality</h4>
            <p className="text-gray-600 text-sm">
              Access specialized expertise across multiple domains without the overhead of hiring full-time specialists.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <ShieldCheck className="text-pink-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Consistent Results</h4>
            <p className="text-gray-600 text-sm">
              Eliminate variability and human error with standardized processes and quality-controlled outputs.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <Calendar className="text-indigo-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Immediate Deployment</h4>
            <p className="text-gray-600 text-sm">
              Start producing results immediately without lengthy onboarding, training, or integration processes.
            </p>
          </div>
        </div>
      </div>
      
      {/* Success stories */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <CheckCircle2 className="mr-2 text-green-500" size={20} /> 
          Success Stories
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SUCCESS_STORIES.map((story, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                    <img src={story.logo} alt={story.company} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{story.company}</h4>
                    <div className="text-sm text-gray-500">{story.project}</div>
                  </div>
                </div>
                
                <blockquote className="italic text-gray-600 text-sm mb-4 border-l-4 border-indigo-200 pl-3">
                  "{story.quote}"
                </blockquote>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">Key Results:</h5>
                  <ul className="space-y-1">
                    {story.results.map((result, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <CheckCircle2 size={14} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-indigo-50 px-6 py-3 flex justify-between items-center">
                <span className="text-xs text-indigo-600 font-medium">Verified Case Study</span>
                <button className="text-indigo-600 text-xs font-medium hover:text-indigo-800">
                  Read Full Case Study →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Ready to experience the power of agent workflows?</h3>
        <p className="mb-6 text-indigo-100 max-w-2xl mx-auto">
          Select any available project from our gallery to customize and deploy your own specialized agent team.
        </p>
        <button 
          onClick={() => onSelectProject(GALLERY_PROJECTS[0])}
          className="bg-white text-indigo-700 hover:bg-indigo-50 transition-colors px-6 py-3 rounded-lg text-sm font-medium"
        >
          Start with Market Analysis →
        </button>
      </div>
    </div>
  );
};

export default ProjectGallery; 