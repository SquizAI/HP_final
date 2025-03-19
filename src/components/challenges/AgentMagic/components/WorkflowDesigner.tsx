import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitMerge, 
  Users, 
  Play, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronRight,
  ArrowRight,
  ArrowDown,
  Settings,
  Zap,
  Move,
  MoreHorizontal,
  Trash2
} from 'lucide-react';

// Types
interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  agentId: string;
  tools: string[];
  inputRequired?: boolean;
  outputFormat?: string;
  position: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  industry: string;
  workflow: WorkflowStep[];
  preview: string;
  status: 'available' | 'premium' | 'coming-soon';
  estimatedValue: string;
  deliverables: string[];
}

interface WorkflowDesignerProps {
  project: Project;
  isRunning: boolean;
  onRunWorkflow: () => void;
}

// Mock agents for demonstration
const AVAILABLE_AGENTS: Agent[] = [
  { id: 'research-analyst', name: 'Research Analyst', role: 'Research', color: '#6366f1' },
  { id: 'content-strategist', name: 'Content Strategist', role: 'Content', color: '#8b5cf6' },
  { id: 'data-scientist', name: 'Data Scientist', role: 'Analysis', color: '#ec4899' },
  { id: 'creative-director', name: 'Creative Director', role: 'Design', color: '#f97316' },
  { id: 'communications-expert', name: 'Communications Expert', role: 'Communications', color: '#14b8a6' },
  { id: 'business-analyst', name: 'Business Analyst', role: 'Analysis', color: '#0ea5e9' },
  { id: 'project-manager', name: 'Project Manager', role: 'Management', color: '#22c55e' },
  { id: 'global-market-specialist', name: 'Global Market Specialist', role: 'Research', color: '#3b82f6' }
];

// Mock tools for demonstration
const AVAILABLE_TOOLS = [
  { id: 'web_search', name: 'Web Search', category: 'Research' },
  { id: 'data_scraping', name: 'Data Scraping', category: 'Research' },
  { id: 'trend_analysis', name: 'Trend Analysis', category: 'Research' },
  { id: 'text_generation', name: 'Text Generation', category: 'Content' },
  { id: 'content_optimizer', name: 'Content Optimizer', category: 'Content' },
  { id: 'text_to_speech', name: 'Text to Speech', category: 'Content' },
  { id: 'data_analysis', name: 'Data Analysis', category: 'Analysis' },
  { id: 'chart_generation', name: 'Chart Generation', category: 'Analysis' },
  { id: 'sentiment_analysis', name: 'Sentiment Analysis', category: 'Analysis' },
  { id: 'image_generation', name: 'Image Generation', category: 'Design' },
  { id: 'image_editing', name: 'Image Editing', category: 'Design' },
  { id: 'style_transfer', name: 'Style Transfer', category: 'Design' },
  { id: 'project_tracking', name: 'Project Tracking', category: 'Management' },
  { id: 'quality_checker', name: 'Quality Checker', category: 'Management' },
  { id: 'email_composer', name: 'Email Composer', category: 'Communications' },
  { id: 'translation', name: 'Translation', category: 'Language' },
  { id: 'slide_creator', name: 'Slide Creator', category: 'Content' }
];

// Default workflow steps for our project types
const DEFAULT_WORKFLOWS = {
  'market-analysis': [
    {
      id: 'step-1',
      name: 'Market Research',
      description: 'Conduct comprehensive web research on market trends, competitors, and opportunities',
      agentId: 'research-analyst',
      tools: ['web_search', 'data_scraping'],
      position: 1
    },
    {
      id: 'step-2',
      name: 'Data Analysis',
      description: 'Analyze market data and identify key patterns and insights',
      agentId: 'data-scientist',
      tools: ['data_analysis', 'chart_generation'],
      position: 2
    },
    {
      id: 'step-3',
      name: 'Competitor Analysis',
      description: 'Detailed analysis of top competitors, including SWOT analysis',
      agentId: 'business-analyst',
      tools: ['data_analysis'],
      position: 3
    },
    {
      id: 'step-4',
      name: 'Report Creation',
      description: 'Generate comprehensive market analysis report with visualizations',
      agentId: 'content-strategist',
      tools: ['text_generation', 'content_optimizer'],
      position: 4
    },
    {
      id: 'step-5',
      name: 'Strategic Recommendations',
      description: 'Develop actionable strategic recommendations based on market analysis',
      agentId: 'business-analyst',
      tools: ['data_analysis'],
      position: 5
    }
  ],
  'content-campaign': [
    {
      id: 'step-1',
      name: 'Campaign Strategy',
      description: 'Develop overall content campaign strategy and messaging framework',
      agentId: 'content-strategist',
      tools: ['web_search'],
      position: 1
    },
    {
      id: 'step-2',
      name: 'Blog Article Creation',
      description: 'Create long-form blog content with SEO optimization',
      agentId: 'content-strategist',
      tools: ['text_generation', 'content_optimizer'],
      position: 2
    },
    {
      id: 'step-3',
      name: 'Social Media Content',
      description: 'Develop social media content pack with post copy and suggested images',
      agentId: 'content-strategist',
      tools: ['text_generation'],
      position: 3
    },
    {
      id: 'step-4',
      name: 'Visual Asset Creation',
      description: 'Create supporting visual assets for all campaign components',
      agentId: 'creative-director',
      tools: ['image_generation', 'image_editing'],
      position: 4
    },
    {
      id: 'step-5',
      name: 'Email Sequence',
      description: 'Develop nurture email sequence with cohesive messaging',
      agentId: 'communications-expert',
      tools: ['text_generation', 'email_composer'],
      position: 5
    }
  ],
  'product-launch': [
    {
      id: 'step-1',
      name: 'Market Analysis',
      description: 'Analyze market conditions and positioning opportunities',
      agentId: 'research-analyst',
      tools: ['web_search', 'data_scraping'],
      position: 1
    },
    {
      id: 'step-2',
      name: 'Product Positioning',
      description: 'Develop product positioning and messaging framework',
      agentId: 'business-analyst',
      tools: ['data_analysis'],
      position: 2
    },
    {
      id: 'step-3',
      name: 'Go-to-Market Strategy',
      description: 'Create comprehensive go-to-market strategy and timeline',
      agentId: 'project-manager',
      tools: ['project_tracking'],
      position: 3
    },
    {
      id: 'step-4',
      name: 'Marketing Materials',
      description: 'Develop core marketing materials and press release',
      agentId: 'content-strategist',
      tools: ['text_generation', 'content_optimizer'],
      position: 4
    },
    {
      id: 'step-5',
      name: 'Sales Enablement',
      description: 'Create sales enablement materials and presentation deck',
      agentId: 'communications-expert',
      tools: ['slide_creator', 'text_generation'],
      position: 5
    },
    {
      id: 'step-6',
      name: 'Launch Communications',
      description: 'Prepare internal and external launch communications',
      agentId: 'communications-expert',
      tools: ['email_composer', 'text_generation'],
      position: 6
    }
  ]
};

const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({ 
  project, 
  isRunning,
  onRunWorkflow
}) => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<{[key: string]: string[]}>({});
  
  // Initialize workflow steps based on project type
  useEffect(() => {
    if (project?.id && DEFAULT_WORKFLOWS[project.id as keyof typeof DEFAULT_WORKFLOWS]) {
      const defaultSteps = DEFAULT_WORKFLOWS[project.id as keyof typeof DEFAULT_WORKFLOWS];
      setWorkflowSteps(defaultSteps);
      
      // Initialize selected tools
      const toolsMap: {[key: string]: string[]} = {};
      defaultSteps.forEach(step => {
        toolsMap[step.id] = step.tools || [];
      });
      setSelectedTools(toolsMap);
    }
  }, [project?.id]);
  
  // Add a new step to the workflow
  const handleAddStep = () => {
    const newId = `step-${workflowSteps.length + 1}`;
    const newPosition = workflowSteps.length + 1;
    
    const newStep: WorkflowStep = {
      id: newId,
      name: 'New Step',
      description: 'Define what this step should accomplish',
      agentId: AVAILABLE_AGENTS[0].id,
      tools: [],
      position: newPosition
    };
    
    setWorkflowSteps([...workflowSteps, newStep]);
    setSelectedTools({...selectedTools, [newId]: []});
    setEditingStep(newId);
  };
  
  // Remove a step from the workflow
  const handleRemoveStep = (stepId: string) => {
    const updatedSteps = workflowSteps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({
        ...step,
        position: index + 1
      }));
    
    setWorkflowSteps(updatedSteps);
    
    // Clean up selected tools
    const updatedTools = {...selectedTools};
    delete updatedTools[stepId];
    setSelectedTools(updatedTools);
    
    // If removing the step being edited, clear editing state
    if (editingStep === stepId) {
      setEditingStep(null);
    }
  };
  
  // Update a step's properties
  const handleUpdateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    const updatedSteps = workflowSteps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    
    setWorkflowSteps(updatedSteps);
  };
  
  // Toggle tool selection for a step
  const handleToggleTool = (stepId: string, toolId: string) => {
    const stepTools = selectedTools[stepId] || [];
    const updatedTools = stepTools.includes(toolId)
      ? stepTools.filter(id => id !== toolId)
      : [...stepTools, toolId];
    
    setSelectedTools({
      ...selectedTools,
      [stepId]: updatedTools
    });
    
    // Update the step's tools
    handleUpdateStep(stepId, { tools: updatedTools });
  };
  
  // Get agent info by ID
  const getAgentById = (agentId: string) => {
    return AVAILABLE_AGENTS.find(agent => agent.id === agentId) || AVAILABLE_AGENTS[0];
  };
  
  // Get tool info by ID
  const getToolById = (toolId: string) => {
    return AVAILABLE_TOOLS.find(tool => tool.id === toolId) || { id: toolId, name: toolId, category: 'Other' };
  };
  
  // Run the designed workflow
  const handleRunWorkflow = () => {
    // Update the project with the final workflow before running
    project.workflow = workflowSteps;
    onRunWorkflow();
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
          <GitBranch className="mr-2 text-indigo-600" /> Workflow Designer
        </h2>
        <p className="text-gray-600">
          Customize your agent workflow for <span className="font-medium text-indigo-600">{project.title}</span>. 
          Drag steps to reorder, add new steps, or modify existing ones to meet your specific requirements.
        </p>
      </div>
      
      {/* Workflow visualization */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative">
          {/* Workflow steps */}
          <div className="space-y-6">
            {workflowSteps.map((step, index) => {
              const agent = getAgentById(step.agentId);
              
              return (
                <div key={step.id}>
                  {/* Connector line */}
                  {index > 0 && (
                    <div className="flex justify-center -mt-2 mb-4">
                      <div className="h-8 w-0.5 bg-indigo-200"></div>
                    </div>
                  )}
                  
                  {/* Step card */}
                  <div 
                    className={`bg-white rounded-lg border ${
                      editingStep === step.id 
                        ? 'border-indigo-300 shadow-md ring-1 ring-indigo-300' 
                        : 'border-gray-200 shadow-sm hover:border-indigo-200'
                    } transition-all`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div 
                            className="flex items-center justify-center h-10 w-10 rounded-lg mr-3 text-white flex-shrink-0"
                            style={{ backgroundColor: agent.color }}
                          >
                            {step.position}
                          </div>
                          
                          <div>
                            {editingStep === step.id ? (
                              <input
                                type="text"
                                value={step.name}
                                onChange={(e) => handleUpdateStep(step.id, { name: e.target.value })}
                                className="font-medium text-gray-800 border-b border-indigo-200 focus:border-indigo-500 bg-transparent py-1 w-full focus:outline-none"
                              />
                            ) : (
                              <h3 className="font-medium text-gray-800">{step.name}</h3>
                            )}
                            
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span 
                                className="inline-block w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: agent.color }}
                              ></span>
                              <span>{agent.name}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingStep(editingStep === step.id ? null : step.id)}
                            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          >
                            <Settings size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleRemoveStep(step.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {editingStep === step.id ? (
                        <textarea
                          value={step.description}
                          onChange={(e) => handleUpdateStep(step.id, { description: e.target.value })}
                          className="mt-2 text-sm text-gray-600 w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          rows={2}
                        />
                      ) : (
                        <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                      )}
                      
                      {/* Selected tools */}
                      {step.tools && step.tools.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {step.tools.map(toolId => (
                            <span 
                              key={toolId} 
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700"
                            >
                              {getToolById(toolId).name}
                              {editingStep === step.id && (
                                <button
                                  onClick={() => handleToggleTool(step.id, toolId)}
                                  className="ml-1 text-indigo-400 hover:text-indigo-700"
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Editing panel */}
                    {editingStep === step.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4 rounded-b-lg">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Agent</label>
                          <select
                            value={step.agentId}
                            onChange={(e) => handleUpdateStep(step.id, { agentId: e.target.value })}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                          >
                            {AVAILABLE_AGENTS.map(agent => (
                              <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Available Tools</label>
                          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                            {AVAILABLE_TOOLS.map(tool => {
                              const isSelected = step.tools.includes(tool.id);
                              
                              return (
                                <div
                                  key={tool.id}
                                  className={`flex items-center space-x-2 p-2 rounded border ${
                                    isSelected 
                                      ? 'border-indigo-300 bg-indigo-50' 
                                      : 'border-gray-200 hover:border-gray-300'
                                  } cursor-pointer`}
                                  onClick={() => handleToggleTool(step.id, tool.id)}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <span className="text-sm text-gray-700">{tool.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Add step button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleAddStep}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action panel */}
      <div className="flex justify-between items-center">
        <div className="text-gray-600">
          <span className="font-medium">{workflowSteps.length}</span> steps with{' '}
          <span className="font-medium">
            {workflowSteps.reduce((sum, step) => sum + (step.tools?.length || 0), 0)}
          </span> tools
        </div>
        
        <button
          onClick={handleRunWorkflow}
          disabled={isRunning || workflowSteps.length === 0}
          className={`
            px-5 py-2.5 rounded-lg flex items-center space-x-2 font-medium shadow-sm
            ${isRunning || workflowSteps.length === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
            }
          `}
        >
          {isRunning ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Running Workflow...</span>
            </>
          ) : (
            <>
              <Play size={18} className="text-white" />
              <span>Run Workflow</span>
            </>
          )}
        </button>
      </div>
      
      {/* Project deliverables */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
          <Zap className="mr-2 text-indigo-600" size={18} />
          Expected Deliverables
        </h3>
        
        <ul className="space-y-2">
          {project.deliverables.map((deliverable, index) => (
            <li key={index} className="flex items-start text-gray-600">
              <span className="text-indigo-500 mr-2 flex-shrink-0 mt-1">•</span>
              <span>{deliverable}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 flex items-center">
          <span className="mr-1">Estimated value:</span>
          <span className="font-medium text-indigo-600">{project.estimatedValue}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDesigner; 