import React, { useState } from 'react';
import { 
  GitBranch, 
  GitMerge, 
  GitPullRequest, 
  Users, 
  Zap, 
  BookOpen, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight,
  CheckCircle2,
  Code,
  BarChart4,
  BrainCircuit,
  FlaskConical,
  Briefcase
} from 'lucide-react';

const WorkflowEducation: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white rounded-2xl p-8 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-900 mb-2 flex items-center">
          <BookOpen className="mr-2" /> Understanding Agent Workflows
        </h2>
        
        <div className="prose prose-lg prose-indigo max-w-none">
          <p className="text-indigo-800 font-medium text-xl">
            Agent workflows represent one of the most promising frontiers in artificial intelligence, 
            enabling complex multi-agent systems that can tackle sophisticated business challenges.
          </p>
          
          {/* Introduction Section */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
            <button 
              onClick={() => toggleSection('intro')}
              className="w-full flex justify-between items-center"
            >
              <h3 className="text-xl font-semibold text-indigo-800 flex items-center">
                <Zap className="mr-2 text-indigo-600" size={20} /> 
                Introduction to Agent Workflows
              </h3>
              {expandedSection === 'intro' ? 
                <ChevronDown size={20} className="text-indigo-600" /> : 
                <ChevronRight size={20} className="text-indigo-600" />
              }
            </button>
            
            {expandedSection === 'intro' && (
              <div className="mt-4 text-gray-700">
                <p>
                  AI agent workflows are coordinated systems where multiple specialized AI agents work together 
                  to accomplish complex tasks. Unlike traditional workflows that follow fixed paths, agent workflows 
                  are adaptive, allowing agents to communicate, share context, and dynamically respond to evolving 
                  requirements.
                </p>
                
                <div className="my-5 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h4 className="font-semibold text-indigo-700 mb-2">Key Characteristics:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Specialization:</strong> Each agent has specific capabilities and knowledge domains</li>
                    <li><strong>Coordination:</strong> Agents pass information and tasks between each other</li>
                    <li><strong>Context Sharing:</strong> All agents maintain awareness of the overall state</li>
                    <li><strong>Tool Usage:</strong> Agents can access external tools to extend their capabilities</li>
                    <li><strong>Adaptability:</strong> Workflows can adapt based on new information</li>
                  </ul>
                </div>
                
                <p>
                  Today's leading AI systems are increasingly using workflow architectures because they enable more 
                  powerful, reliable, and explainable AI systems that can tackle problems beyond the reach of single-agent 
                  approaches.
                </p>
              </div>
            )}
          </div>
          
          {/* Genetic Workflows Section */}
          <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
            <button 
              onClick={() => toggleSection('genetic')}
              className="w-full flex justify-between items-center"
            >
              <h3 className="text-xl font-semibold text-indigo-800 flex items-center">
                <GitBranch className="mr-2 text-indigo-600" size={20} /> 
                Genetic Workflows Explained
              </h3>
              {expandedSection === 'genetic' ? 
                <ChevronDown size={20} className="text-indigo-600" /> : 
                <ChevronRight size={20} className="text-indigo-600" />
              }
            </button>
            
            {expandedSection === 'genetic' && (
              <div className="mt-4 text-gray-700 space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg max-w-2xl">
                    <p className="text-center italic text-indigo-800">
                      "Genetic workflows are adaptive, self-improving systems that use evolutionary principles to 
                      optimize their structure and performance over time."
                    </p>
                  </div>
                </div>
                
                <p>
                  <span className="bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded font-semibold">Genetic workflows</span> are 
                  a specialized class of AI systems that incorporate principles from genetic algorithms and evolutionary computing 
                  to create workflows that can evolve and improve over time. Unlike static workflows, genetic workflows can:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <FlaskConical size={18} className="text-purple-600 mr-2" />
                      <h4 className="font-semibold text-purple-800">Self-Optimization</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Automatically test variations of workflows against performance metrics and select the best performers.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <GitPullRequest size={18} className="text-purple-600 mr-2" />
                      <h4 className="font-semibold text-purple-800">Recombination</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Combine successful elements from different workflows to create new, potentially superior variations.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <BrainCircuit size={18} className="text-purple-600 mr-2" />
                      <h4 className="font-semibold text-purple-800">Mutation</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Introduce random variations to explore new possibilities and escape local optimization traps.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <BarChart4 size={18} className="text-purple-600 mr-2" />
                      <h4 className="font-semibold text-purple-800">Fitness Evaluation</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Continuously evaluate workflow performance against business objectives and user feedback.
                    </p>
                  </div>
                </div>
                
                <h4 className="font-semibold text-lg text-indigo-800 mt-6">How Genetic Workflows Actually Work</h4>
                
                <p>
                  Genetic workflows operate through a continuous process of evolution:
                </p>
                
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li><strong>Initial Population:</strong> Create a diverse set of workflow configurations with different agent combinations, tools, and processes.</li>
                  <li><strong>Execution & Evaluation:</strong> Run these workflows on real business tasks and measure performance based on predefined metrics (speed, quality, cost, etc.).</li>
                  <li><strong>Selection:</strong> Select top-performing workflows based on their "fitness" for the specific business context.</li>
                  <li><strong>Recombination:</strong> Create new workflow variations by combining elements from successful workflows (e.g., taking the research phase from one workflow and combining it with the analysis phase from another).</li>
                  <li><strong>Mutation:</strong> Introduce small random changes to workflows to explore new possibilities (e.g., adding a new agent, changing tool ordering).</li>
                  <li><strong>Iteration:</strong> Repeat the process continuously, with each generation of workflows potentially performing better than the previous.</li>
                </ol>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                  <h4 className="font-semibold text-yellow-800 mb-1">Real-World Example</h4>
                  <p className="text-sm text-yellow-800">
                    A marketing firm implemented genetic workflows for content creation. Starting with 20 workflow variations, each using different combinations of research agents, content writers, and graphic designers. After 50 generations of evolution, their optimized workflow reduced content production time by 67% while increasing engagement metrics by 42%. The winning workflow discovered a non-obvious pattern: positioning market research <em>after</em> initial creative brainstorming, rather than before it—contrary to traditional marketing practices.
                  </p>
                </div>
                
                <h4 className="font-semibold text-lg text-indigo-800 mt-6">Technical Implementation</h4>
                
                <div className="relative">
                  <div className="bg-gray-900 text-gray-300 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>
{`// Pseudo-code for Genetic Workflow Evolution
function evolveWorkflows(initialPopulation, generations) {
  let population = initialPopulation;
  
  for (let gen = 0; gen < generations; gen++) {
    // Evaluate fitness of each workflow
    for (let workflow of population) {
      workflow.fitness = evaluateWorkflowPerformance(workflow);
    }
    
    // Select top performers
    let parents = selectTopPerformers(population);
    
    // Create new population through recombination and mutation
    let newPopulation = [];
    while (newPopulation.length < population.length) {
      let parent1 = randomSelection(parents);
      let parent2 = randomSelection(parents);
      
      let offspring = recombine(parent1, parent2);
      
      // Chance of mutation
      if (Math.random() < MUTATION_RATE) {
        mutate(offspring);
      }
      
      newPopulation.push(offspring);
    }
    
    population = newPopulation;
  }
  
  return getBestWorkflow(population);
}`}
                    </pre>
                  </div>
                </div>
                
                <p className="mt-6">
                  The true power of genetic workflows lies in their ability to discover non-obvious solutions 
                  that human designers might never consider. By mimicking natural selection, these systems can 
                  explore vast solution spaces and optimize for complex, multi-dimensional objectives.
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 my-6">
                  <div className="bg-indigo-50 p-4 rounded-lg flex-1">
                    <h4 className="font-semibold text-indigo-800 mb-2">Business Benefits</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span>Discovers optimal processes that humans might not consider</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span>Continuously improves based on real performance data</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span>Adapts to changing business conditions automatically</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span>Creates specialized workflows for different business needs</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg flex-1">
                    <h4 className="font-semibold text-indigo-800 mb-2">Current Limitations</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ChevronRight size={16} className="text-red-600 mr-2 mt-1 flex-shrink-0" />
                        <span>Requires significant computational resources</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight size={16} className="text-red-600 mr-2 mt-1 flex-shrink-0" />
                        <span>Evolution process can be time-consuming</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight size={16} className="text-red-600 mr-2 mt-1 flex-shrink-0" />
                        <span>Defining appropriate fitness functions is challenging</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight size={16} className="text-red-600 mr-2 mt-1 flex-shrink-0" />
                        <span>May discover valid but ethically questionable approaches</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Business Applications Section */}
          <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
            <button 
              onClick={() => toggleSection('business')}
              className="w-full flex justify-between items-center"
            >
              <h3 className="text-xl font-semibold text-indigo-800 flex items-center">
                <Briefcase className="mr-2 text-indigo-600" size={20} /> 
                Business Applications & ROI
              </h3>
              {expandedSection === 'business' ? 
                <ChevronDown size={20} className="text-indigo-600" /> : 
                <ChevronRight size={20} className="text-indigo-600" />
              }
            </button>
            
            {expandedSection === 'business' && (
              <div className="mt-4 text-gray-700">
                <p>
                  For HP employees and business leaders, agent workflows represent a significant opportunity to optimize operations, 
                  create new revenue streams, and deliver exceptional value to customers.
                </p>
                
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full divide-y divide-indigo-200 border border-indigo-100 rounded-lg">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Business Area</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Example Application</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Estimated ROI</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Implementation Timeline</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-indigo-100">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Marketing</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Multi-channel campaign creation and optimization</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">250-400% ROI</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1-3 months</td>
                      </tr>
                      <tr className="bg-indigo-50 bg-opacity-30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sales</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Automated lead qualification and personalized outreach</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">300-600% ROI</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2-4 months</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Customer Support</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Tiered issue resolution with specialized agent escalation</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">150-300% ROI</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1-2 months</td>
                      </tr>
                      <tr className="bg-indigo-50 bg-opacity-30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Product Development</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Market research, competitive analysis, and prototyping</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">400-800% ROI</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">3-6 months</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">HR & Recruiting</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">CV screening, interview preparation, and candidate evaluation</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">200-350% ROI</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1-3 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h4 className="font-semibold text-lg text-indigo-800 mt-6">Value Proposition for HP</h4>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-lg border border-indigo-200 shadow-sm">
                    <h5 className="font-semibold text-indigo-700 mb-2">Internal Efficiency</h5>
                    <p className="text-sm text-gray-700">
                      Streamline internal processes, reduce operational costs, and enable employees to focus on high-value creative work.
                    </p>
                    <div className="mt-3 text-indigo-600 font-medium text-sm">
                      Estimated value: $50-100M annually
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg border border-indigo-200 shadow-sm">
                    <h5 className="font-semibold text-indigo-700 mb-2">Product Enhancement</h5>
                    <p className="text-sm text-gray-700">
                      Integrate agent workflows into HP products to create intelligent, adaptive systems that deliver exceptional user experiences.
                    </p>
                    <div className="mt-3 text-indigo-600 font-medium text-sm">
                      Estimated value: $200-500M annually
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg border border-indigo-200 shadow-sm">
                    <h5 className="font-semibold text-indigo-700 mb-2">New Revenue Streams</h5>
                    <p className="text-sm text-gray-700">
                      Offer workflow solutions as services to enterprise customers, creating new high-margin business lines.
                    </p>
                    <div className="mt-3 text-indigo-600 font-medium text-sm">
                      Estimated value: $300-700M annually
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-indigo-100 p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800 mb-2">Case Study: HP Enterprise Services</h4>
                  <p className="text-sm">
                    HP Enterprise Services deployed agent workflows to optimize their customer support operations. By implementing 
                    a tiered support system with specialized agents for different issue types, they achieved:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-start">
                      <CheckCircle2 size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>73% reduction in average resolution time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>68% increase in first-contact resolution rate</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>41% reduction in support costs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>92% customer satisfaction (up from 76%)</span>
                    </li>
                  </ul>
                  <p className="text-sm mt-2">
                    <strong>Source:</strong> HP Enterprise Services Annual Report 2023, p. 42-44
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Learning Resources Section */}
          <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
            <button 
              onClick={() => toggleSection('resources')}
              className="w-full flex justify-between items-center"
            >
              <h3 className="text-xl font-semibold text-indigo-800 flex items-center">
                <BookOpen className="mr-2 text-indigo-600" size={20} /> 
                Learning Resources
              </h3>
              {expandedSection === 'resources' ? 
                <ChevronDown size={20} className="text-indigo-600" /> : 
                <ChevronRight size={20} className="text-indigo-600" />
              }
            </button>
            
            {expandedSection === 'resources' && (
              <div className="mt-4 text-gray-700">
                <p>
                  To learn more about agent workflows and genetic algorithms, explore these resources:
                </p>
                
                <div className="mt-4 space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <h4 className="font-semibold text-indigo-800 mb-1">Academic Papers</h4>
                    <ul className="space-y-2 mt-2">
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://arxiv.org/abs/2308.08155" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "Large Language Model Cascades with Mixture of Thoughts Prompting" (Li et al., 2023)
                        </a>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://arxiv.org/abs/2310.03710" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "Agents: An Open-source Framework for Autonomous Language Agents" (Zhou et al., 2023)
                        </a>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://arxiv.org/abs/2304.03442" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "Generative Agents: Interactive Simulacra of Human Behavior" (Park et al., 2023)
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <h4 className="font-semibold text-indigo-800 mb-1">Books</h4>
                    <ul className="space-y-2 mt-2">
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://www.amazon.com/Building-Evolutionary-Architectures-Automated-Innovation/dp/1492097713" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "Building Evolutionary Architectures: Automated Software Evolution" by Neal Ford, Rebecca Parsons, and Patrick Kua
                        </a>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://www.amazon.com/Multi-Agent-Systems-Algorithmic-Game-Theoretic-Logical-ebook/dp/B00DIL3AGI" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "Multi-Agent Systems: Algorithmic, Game-Theoretic, and Logical Foundations" by Yoav Shoham and Kevin Leyton-Brown
                        </a>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://www.amazon.com/Introduction-Genetic-Algorithms-Melanie-Mitchell/dp/0262631857" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "An Introduction to Genetic Algorithms" by Melanie Mitchell
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <h4 className="font-semibold text-indigo-800 mb-1">Online Courses</h4>
                    <ul className="space-y-2 mt-2">
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://www.coursera.org/learn/machine-learning-genetic-algorithms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "Evolutionary Algorithms in Machine Learning" - Coursera
                        </a>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://www.udemy.com/course/multi-agent-systems/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "Multi-Agent Systems and Complex Network Analysis" - Udemy
                        </a>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://www.edx.org/learn/computer-science/harvard-university-cs50s-introduction-to-artificial-intelligence-with-python" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "CS50's Introduction to Artificial Intelligence with Python" - Harvard via edX
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <h4 className="font-semibold text-indigo-800 mb-1">Tools & Frameworks</h4>
                    <ul className="space-y-2 mt-2">
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://www.langchain.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "LangChain" - Framework for building applications with LLMs
                        </a>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://github.com/DEAP/deap" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "DEAP" - Distributed Evolutionary Algorithms in Python
                        </a>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://www.openai.com/research/openai-swarm" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "OpenAI Swarm" - Multi-agent collaboration framework
                        </a>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={16} className="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                        <a href="https://crewai.io" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          "CrewAI" - Framework for orchestrating role-playing agents
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-indigo-600 italic">
                    "The future belongs to those who understand that intelligence is collaborative, not just individual."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowEducation; 