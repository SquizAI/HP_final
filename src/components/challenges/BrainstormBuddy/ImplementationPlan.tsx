import React, { useState } from 'react';

interface ImplementationStep {
  title: string;
  description: string;
  duration: string;
  resources: string[];
  status: 'pending' | 'in-progress' | 'completed';
}

interface ImplementationPlanProps {
  selectedIdea: string;
  implementationPlan: string;
  problemStatement: string;
  onComplete: () => void;
  onBack: () => void;
  onSaveSteps?: (steps: ImplementationStep[]) => void;
  customNotes?: string;
  onUpdateNotes?: (notes: string) => void;
}

// Structured plan interfaces
interface PlanPhase {
  title: string;
  weeks: string;
  tasks: string[];
}

interface PlanRisk {
  risk: string;
  impact: string;
  probability: string;
  mitigation: string;
}

interface PlanResource {
  category: string;
  details: string[];
}

interface StructuredPlan {
  title: string;
  summary: string;
  phases: PlanPhase[];
  resources: PlanResource[];
  risks: PlanRisk[];
  metrics: string[];
  conclusion: string;
}

// Fun implementation plan facts
const IMPLEMENTATION_FACTS = [
  "With this plan, you'll be 87% more likely to impress your boss than with a simple email saying 'I have ideas'.",
  "This might be the first implementation plan in history that doesn't include the phrase 'synergize cross-functional teams'.",
  "Studies show that people who follow structured implementation plans are 42% less likely to spend meetings saying 'we should really do something about that'.",
  "Warning: Implementation of brilliant ideas may lead to promotion, recognition, or being asked to lead even more projects.",
  "A good implementation plan is like a GPS for your idea—except it won't randomly tell you to 'turn right' into a lake.",
  "Fun fact: Implementation plans written on Fridays are 31% more likely to include impromptu team celebrations.",
  "The average implementation plan has a half-life of 3.5 meetings before someone says 'Let's pivot'."
];

// Sample implementation step templates
const STEP_TEMPLATES = [
  {
    title: "Research Phase",
    description: "Gather all necessary information and background research",
    duration: "1-2 weeks",
    resources: ["Market research tools", "Competitor analysis"],
    status: "pending" as const
  },
  {
    title: "Planning & Design",
    description: "Create detailed specifications and design documents",
    duration: "2-3 weeks",
    resources: ["Design software", "Project management tools"],
    status: "pending" as const
  },
  {
    title: "Development",
    description: "Build the core functionality based on specifications",
    duration: "3-4 weeks",
    resources: ["Development team", "Required technologies"],
    status: "pending" as const
  }
];

const ImplementationPlan: React.FC<ImplementationPlanProps> = ({
  selectedIdea,
  implementationPlan,
  problemStatement,
  onComplete,
  onBack,
  onSaveSteps,
  customNotes = "",
  onUpdateNotes
}) => {
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({
    implementation: true,
    steps: true
  });
  const [steps, setSteps] = useState<ImplementationStep[]>([]);
  const [factIndex, setFactIndex] = useState(Math.floor(Math.random() * IMPLEMENTATION_FACTS.length));
  const [showTemplates, setShowTemplates] = useState(false);
  const [notes, setNotes] = useState(customNotes);
  const [isMarkdownView, setIsMarkdownView] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setIsExpanded({ ...isExpanded, [sectionId]: !isExpanded[sectionId] });
  };
  
  // Get a new random implementation fact
  const getNewFact = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * IMPLEMENTATION_FACTS.length);
    } while (newIndex === factIndex);
    setFactIndex(newIndex);
  };
  
  // Handle notes changes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    if (onUpdateNotes) {
      onUpdateNotes(newNotes);
    }
  };
  
  // Parse implementation plan into structured format
  const parseStructuredPlan = (markdown: string): StructuredPlan => {
    const lines = markdown.split('\n');
    const plan: StructuredPlan = {
      title: '',
      summary: '',
      phases: [],
      resources: [],
      risks: [],
      metrics: [],
      conclusion: ''
    };
    
    let currentSection = '';
    let currentPhase: PlanPhase | null = null;
    let currentResource: PlanResource | null = null;
    let inRiskTable = false;
    let headerColumns: string[] = [];
    
    lines.forEach((line, index) => {
      // Extract title
      if (line.startsWith('# ')) {
        plan.title = line.substring(2).trim();
        return;
      }
      
      // Track current section
      if (line.startsWith('## ')) {
        currentSection = line.substring(3).trim().toLowerCase();
        
        // Reset section-specific variables
        if (currentSection.includes('phase')) {
          currentPhase = null;
        } else if (currentSection.includes('resource')) {
          currentResource = null;
        } else if (currentSection.includes('risk')) {
          inRiskTable = false;
        }
        return;
      }
      
      // Handle executive summary
      if (currentSection.includes('summary') && line.trim() && !line.startsWith('#')) {
        plan.summary += line.trim() + ' ';
        return;
      }
      
      // Handle phases
      if (currentSection.includes('phase') && line.match(/\*\*.*?\*\*/)) {
        // Check if this is a phase header with weeks
        const phaseMatch = line.match(/\*\*(.*?)\*\*\s*\(?(Weeks\s+[\d\-]+)\)?/i);
        if (phaseMatch) {
          // Start a new phase
          currentPhase = {
            title: phaseMatch[1].trim(),
            weeks: phaseMatch[2].trim(),
            tasks: []
          };
          plan.phases.push(currentPhase);
        } else if (line.trim().startsWith('- **') && currentPhase) {
          // This is a task within the current phase
          const taskMatch = line.match(/\-\s*\*\*(.*?)\*\*/);
          if (taskMatch) {
            const task = taskMatch[1].trim() + line.substring(line.indexOf('**', 2) + 2).trim();
            currentPhase.tasks.push(task);
          }
        }
        return;
      }
      
      // Handle resources
      if (currentSection.includes('resource') && line.match(/\*\*.*?\*\*/)) {
        // Check if this is a resource category
        const resourceMatch = line.match(/\*\*(.*?)\*\*/);
        if (resourceMatch && !line.trim().startsWith('-')) {
          // Start a new resource category
          currentResource = {
            category: resourceMatch[1].trim(),
            details: []
          };
          plan.resources.push(currentResource);
        } else if (line.trim().startsWith('-') && currentResource) {
          // This is a detail within the current resource
          const detail = line.trim().substring(1).trim();
          currentResource.details.push(detail);
        }
        return;
      }
      
      // Handle risk table
      if (currentSection.includes('risk')) {
        // Detect table header row with |---|---|---|
        if (line.includes('|') && line.includes('---')) {
          inRiskTable = true;
          headerColumns = lines[index - 1]
                         .split('|')
                         .filter(cell => cell.trim())
                         .map(cell => cell.trim().toLowerCase());
          return;
        }
        
        // Process table row
        if (inRiskTable && line.includes('|') && !line.includes('---')) {
          const cells = line.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
          
          if (cells.length >= 4) {
            const risk: PlanRisk = {
              risk: cells[0],
              impact: cells[1],
              probability: cells[2],
              mitigation: cells[3]
            };
            
            plan.risks.push(risk);
          }
          return;
        }
      }
      
      // Handle metrics
      if (currentSection.includes('metric') && line.trim().startsWith('-')) {
        plan.metrics.push(line.trim().substring(1).trim());
        return;
      }
      
      // Handle conclusion
      if (currentSection.includes('conclusion') && line.trim() && !line.startsWith('#')) {
        plan.conclusion += line.trim() + ' ';
        return;
      }
    });
    
    return plan;
  };
  
  // Parse the plan
  const structuredPlan = parseStructuredPlan(implementationPlan);
    
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-blue-600 mr-3">📋</span>
          Implementation Plan
        </h2>
        <p className="text-gray-600 mb-4">
          A structured approach to implement your solution effectively.
        </p>
        
        {/* Format toggle */}
        <div className="flex mb-4">
          <button
            onClick={() => setIsMarkdownView(false)}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              !isMarkdownView 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Structured View
          </button>
          <button
            onClick={() => setIsMarkdownView(true)}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              isMarkdownView 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Raw Markdown
          </button>
        </div>
      </div>
      
      {/* Selected Idea Summary */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <div className="text-blue-500 text-xl mr-3">💡</div>
          <div>
            <h3 className="font-medium text-blue-800">Selected Idea</h3>
            <p className="text-blue-700">{selectedIdea}</p>
          </div>
        </div>
      </div>
      
      {/* Implementation Plan Content */}
      {isMarkdownView ? (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 font-mono text-sm overflow-auto">
          <pre className="whitespace-pre-wrap">{implementationPlan}</pre>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          {/* Plan Title */}
          <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
            {structuredPlan.title || "Implementation Plan"}
          </h1>
          
          {/* Executive Summary */}
          {structuredPlan.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Executive Summary</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-700">{structuredPlan.summary}</p>
              </div>
            </div>
          )}
          
          {/* Implementation Phases */}
          {structuredPlan.phases.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Implementation Phases</h2>
              <div className="space-y-6">
                {structuredPlan.phases.map((phase, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">{phase.title}</h3>
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{phase.weeks}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {phase.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start">
                            <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-xs font-bold">
                              {taskIndex + 1}
                            </span>
                            <span className="text-gray-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Resource Requirements */}
          {structuredPlan.resources.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Resource Requirements</h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-100">
                  {structuredPlan.resources.map((resource, index) => (
                    <div key={index} className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2">
                        {resource.category}:
                      </h3>
                      <ul className="pl-5 list-disc space-y-1">
                        {resource.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-gray-700">{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Risk Management */}
          {structuredPlan.risks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Risk Management</h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mitigation Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {structuredPlan.risks.map((risk, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{risk.risk}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${risk.impact.toLowerCase().includes('high') ? 'bg-red-100 text-red-800' : 
                              risk.impact.toLowerCase().includes('medium') ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {risk.impact}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${risk.probability.toLowerCase().includes('high') ? 'bg-red-100 text-red-800' : 
                              risk.probability.toLowerCase().includes('medium') ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {risk.probability}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{risk.mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Success Metrics */}
          {structuredPlan.metrics.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Success Metrics</h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm p-4">
                <ul className="space-y-2">
                  {structuredPlan.metrics.map((metric, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-gray-700">{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Conclusion */}
          {structuredPlan.conclusion && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Conclusion</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-700">{structuredPlan.conclusion}</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Notes Section */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-2">Your Notes</h3>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add your own notes, adjustments, or additions to the implementation plan..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back to Ideas
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors mr-3"
          >
            Export Options
          </button>
          
          {showExportOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    const blob = new Blob([implementationPlan], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'implementation_plan.md';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  Download as Markdown
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Implementation Plan</title>
                            <style>
                              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                              h1 { color: #2563eb; }
                              h2 { color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
                              table { border-collapse: collapse; width: 100%; margin: 16px 0; }
                              th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
                              th { background-color: #f3f4f6; }
                            </style>
                          </head>
                          <body>
                            <h1>Implementation Plan: ${selectedIdea}</h1>
                            <div>
                              ${!isMarkdownView ? 
                                `<h2>Executive Summary</h2>
                                <p>${structuredPlan.summary}</p>
                                
                                ${structuredPlan.phases.map(phase => `
                                  <h2>${phase.title} (${phase.weeks})</h2>
                                  <ul>
                                    ${phase.tasks.map(task => `<li>${task}</li>`).join('')}
                                  </ul>
                                `).join('')}
                                
                                <h2>Resource Requirements</h2>
                                ${structuredPlan.resources.map(resource => `
                                  <h3>${resource.category}</h3>
                                  <ul>
                                    ${resource.details.map(detail => `<li>${detail}</li>`).join('')}
                                  </ul>
                                `).join('')}
                                
                                <h2>Risk Management</h2>
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Risk</th>
                                      <th>Impact</th>
                                      <th>Probability</th>
                                      <th>Mitigation Strategy</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${structuredPlan.risks.map(risk => `
                                      <tr>
                                        <td>${risk.risk}</td>
                                        <td>${risk.impact}</td>
                                        <td>${risk.probability}</td>
                                        <td>${risk.mitigation}</td>
                                      </tr>
                                    `).join('')}
                                  </tbody>
                                </table>
                                
                                <h2>Success Metrics</h2>
                                <ul>
                                  ${structuredPlan.metrics.map(metric => `<li>${metric}</li>`).join('')}
                                </ul>
                                
                                <h2>Conclusion</h2>
                                <p>${structuredPlan.conclusion}</p>`
                                : implementationPlan.replace(/\n/g, '<br>')
                              }
                            </div>
                            ${customNotes ? '<h2>Additional Notes</h2><p>' + customNotes + '</p>' : ''}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }}
                >
                  Print / Save as PDF
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Complete Implementation
        </button>
      </div>
    </div>
  );
};

export default ImplementationPlan; 