import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the steps in the policy decoding process
enum STEPS {
  POLICY_INPUT = 0,
  SUMMARY = 1,
  KEY_POINTS = 2,
  RISKS = 3,
  EXTRAS = 4
}

// Interface for policy document
export interface PolicyDocument {
  id: string;
  title: string;
  content: string;
  source: 'sample' | 'upload' | 'manual';
  category: string;
  dateAdded: string;
}

// Interface for policy summary
export interface PolicySummary {
  plainLanguageSummary: string;
  keyPoints: string[];
  complianceRisks: string[];
  timestamp: string;
}

// Interface for generated FAQs
export interface PolicyFAQ {
  id: string;
  question: string;
  answer: string;
}

// Interface for training scenarios
export interface TrainingScenario {
  id: string;
  scenario: string;
  question: string;
  correctAnswer: boolean;
  explanation: string;
}

// Main state interface for the Policy Decoder
export interface PolicyDecoderState {
  // Policy document
  policyDocument: PolicyDocument;
  
  // AI analysis results
  policySummary: PolicySummary | null;
  policyFAQs: PolicyFAQ[];
  trainingScenarios: TrainingScenario[];
  
  // UI state
  currentStep: STEPS;
  isAnalyzing: boolean;
  error: string | null;
  tooltipVisible: string | null;
  isComplete: boolean;
  
  // AI settings
  aiAssistanceLevel: 'minimal' | 'moderate' | 'extensive';
}

// Sample policy documents for demonstration
const SAMPLE_POLICIES = [
  {
    id: 'travel-expense-policy',
    title: 'Travel & Expense Policy',
    content: `COMPANY TRAVEL & EXPENSE POLICY
    
1. GENERAL PRINCIPLES
1.1 All business travel must be pre-approved by department managers.
1.2 Employees are expected to minimize expenses and select the most cost-effective options when traveling.
1.3 All expenses must be documented with original receipts and submitted within 14 days of trip completion.
1.4 Personal expenses incurred during business travel will not be reimbursed.

2. AIR TRAVEL
2.1 Economy class must be booked for all domestic flights and flights under 6 hours.
2.2 Premium economy may be approved for international flights over 6 hours with manager approval.
2.3 Business class travel requires written approval from a VP-level executive.
2.4 Flights should be booked at least 21 days in advance when possible.
2.5 Airline loyalty points earned during business travel may be retained by the employee.

3. ACCOMMODATION
3.1 Hotel accommodations should not exceed $250 per night for major metropolitan areas and $180 for other locations.
3.2 In-room entertainment and mini-bar charges are considered personal expenses.
3.3 Reasonable internet charges for business purposes are reimbursable.
3.4 Hotel stays extending beyond the business purpose of the trip require pre-approval.

4. MEALS & ENTERTAINMENT
4.1 Daily meal allowance is set at $75 per day for major metropolitan areas and $60 for other locations.
4.2 Alcohol is not reimbursable unless part of client entertainment with prior approval.
4.3 Client entertainment must have business purpose documented and requires manager approval.
4.4 Meal receipts must include itemized details, not just credit card totals.

5. GROUND TRANSPORTATION
5.1 Public transportation and shuttle services should be used when practical.
5.2 Ride-sharing services (Uber, Lyft) are permitted when more economical than taxis.
5.3 Rental cars should be economy or compact class unless multiple employees are traveling together.
5.4 Personal vehicle use will be reimbursed at the current IRS mileage rate.

6. INTERNATIONAL TRAVEL
6.1 Passport and visa fees for business travel are reimbursable.
6.2 Vaccinations required for business travel are covered under the company health plan.
6.3 Currency conversion fees for business expenses are reimbursable.
6.4 International phone plans must be arranged through IT prior to departure.

7. NON-COMPLIANCE
7.1 Expenses submitted outside policy may be denied reimbursement.
7.2 Repeated policy violations may result in disciplinary action.
7.3 Submission of fraudulent expenses will result in termination.
7.4 Exceptions to this policy require written approval from the CFO.`,
    source: 'sample',
    category: 'Finance',
    dateAdded: new Date().toISOString()
  },
  {
    id: 'remote-work-policy',
    title: 'Remote Work Policy',
    content: `REMOTE WORK POLICY
    
1. ELIGIBILITY & APPROVAL
1.1 Remote work arrangements must be approved by department managers and HR.
1.2 Not all positions are eligible for remote work based on job requirements.
1.3 Employees must have completed at least 6 months of employment before requesting remote work.
1.4 Performance issues may disqualify employees from remote work privileges.

2. WORK HOURS & AVAILABILITY
2.1 Remote employees must work their regular scheduled hours unless alternate arrangements are approved.
2.2 Employees must be available via company communication channels during core hours (10am-3pm).
2.3 Status must be updated in company messaging systems when stepping away for extended periods.
2.4 Regular team meetings cannot be missed due to remote work arrangements.

3. EQUIPMENT & TECHNOLOGY
3.1 Company will provide a laptop and necessary software for remote work.
3.2 Employees are responsible for ensuring reliable internet connectivity (minimum 25 Mbps).
3.3 Technical issues must be reported to IT immediately if affecting work productivity.
3.4 Company property must be returned upon termination of employment or remote work arrangement.
3.5 Employees must ensure their home network meets security requirements specified by IT.

4. SECURITY & CONFIDENTIALITY
4.1 All company data security policies apply to remote work environments.
4.2 Sensitive documents must not be printed at home without prior approval.
4.3 Company VPN must be used when accessing company systems remotely.
4.4 Remote work must be conducted in private settings when handling confidential information.
4.5 Family members should not have access to company devices or information.

5. WORKSPACE REQUIREMENTS
5.1 Remote employees must maintain a dedicated, ergonomic workspace.
5.2 Workspace must be free from hazards and distractions.
5.3 Company is not responsible for costs associated with home office setup beyond provided equipment.
5.4 Employees must complete a home office safety checklist annually.

6. EXPENSES & REIMBURSEMENT
6.1 Internet service and utility costs are generally not reimbursable.
6.2 Office supplies may be reimbursed with prior approval and receipts.
6.3 Travel to main office locations is not considered business travel and is not reimbursable.
6.4 Equipment repair costs must be approved by IT department before incurring expenses.

7. PERFORMANCE & EVALUATION
7.1 Same performance standards apply to remote and in-office employees.
7.2 Managers must conduct regular check-ins with remote employees.
7.3 Remote work privileges may be revoked if productivity or quality declines.
7.4 Remote employees will be evaluated using the same criteria as in-office staff.

8. COMPLIANCE
8.1 Violation of this policy may result in termination of remote work privileges.
8.2 Repeated offenses may lead to disciplinary action up to and including termination.
8.3 Employees must acknowledge and sign this policy before beginning remote work.`,
    source: 'sample',
    category: 'Human Resources',
    dateAdded: new Date().toISOString()
  }
];

// Sample explanation texts for each step
const STEP_EXPLANATIONS = {
  [STEPS.POLICY_INPUT]: "Start by uploading or selecting a policy document you'd like to analyze. You can also enter policy text manually.",
  [STEPS.SUMMARY]: "Review the AI-generated plain language summary of the policy document.",
  [STEPS.KEY_POINTS]: "See the most important points employees need to remember from this policy.",
  [STEPS.RISKS]: "Understand potential compliance risks and areas that require special attention.",
  [STEPS.EXTRAS]: "Explore additional tools like FAQ generation and training scenarios."
};

// Initial state for the component
const createInitialState = (): PolicyDecoderState => {
  return {
    policyDocument: {
      id: '',
      title: '',
      content: '',
      source: 'manual',
      category: '',
      dateAdded: new Date().toISOString()
    },
    policySummary: null,
    policyFAQs: [],
    trainingScenarios: [],
    currentStep: STEPS.POLICY_INPUT,
    isAnalyzing: false,
    error: null,
    tooltipVisible: null,
    isComplete: false,
    aiAssistanceLevel: 'minimal'
  };
};

// AI analysis prompts for different tasks
const AI_PROMPTS = {
  summarize: "Summarize the following policy document in plain, simple English that any employee can understand:",
  keyPoints: "List the three most important things an employee must remember from this policy:",
  risks: "Identify the main compliance risks or consequences of not following this policy:",
  generateFAQs: "Generate 5 frequently asked questions with answers about this policy that employees might have:",
  trainingScenario: "Create 3 realistic scenarios with questions to test an employee's understanding of this policy. Include the correct answer and explanation for each:"
};

// Main component
const PolicyDecoderMain: React.FC = () => {
  // State management
  const [state, setState] = useState<PolicyDecoderState>(createInitialState());
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check for session storage on initial load
  useEffect(() => {
    const savedState = sessionStorage.getItem('policyDecoderState');
    if (savedState) {
      try {
        setState(JSON.parse(savedState));
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);
  
  // Save state to session storage on updates
  useEffect(() => {
    sessionStorage.setItem('policyDecoderState', JSON.stringify(state));
  }, [state]);
  
  // Update state helper
  const updateState = (newState: Partial<PolicyDecoderState>) => {
    setState(prevState => ({
      ...prevState,
      ...newState
    }));
  };
  
  // Navigation methods
  const goToNextStep = () => {
    if (state.currentStep < STEPS.EXTRAS) {
      updateState({ currentStep: state.currentStep + 1 });
    }
  };
  
  const goToPreviousStep = () => {
    if (state.currentStep > STEPS.POLICY_INPUT) {
      updateState({ currentStep: state.currentStep - 1 });
    }
  };
  
  const goToStep = (step: STEPS) => {
    updateState({ currentStep: step });
  };
  
  // Generate FAQs
  const generateFAQs = () => {
    updateState({ isAnalyzing: true });
    
    // Simulate API call delay
    setTimeout(() => {
      const faqs: PolicyFAQ[] = [
        {
          id: uuidv4(),
          question: "Who needs to comply with this policy?",
          answer: "All employees, contractors, and third-party vendors who have access to company systems or data must comply with this policy without exception."
        },
        {
          id: uuidv4(),
          question: "What happens if I accidentally violate this policy?",
          answer: "Accidental violations should be reported immediately to your supervisor and the compliance team. Prompt reporting can mitigate consequences and allow for corrective action to be taken."
        },
        {
          id: uuidv4(),
          question: "How often will this policy be updated?",
          answer: "This policy is reviewed annually at minimum, with additional updates occurring whenever relevant laws change or new risks are identified."
        },
        {
          id: uuidv4(),
          question: "Where can I find additional training on this policy?",
          answer: "Additional training resources are available on the company intranet under 'Compliance Training.' You can also request specialized training through your department head."
        },
        {
          id: uuidv4(),
          question: "Who should I contact if I have questions about interpreting this policy?",
          answer: "Questions about policy interpretation should be directed to the Compliance Department at compliance@company.com or extension 4567."
        },
        {
          id: uuidv4(),
          question: "Are there any exceptions to this policy?",
          answer: "Exceptions may be granted in rare circumstances with written approval from both the department head and the Chief Compliance Officer. All exceptions must be documented and reviewed quarterly."
        }
      ];
      
      updateState({
        isAnalyzing: false,
        policyFAQs: faqs
      });
    }, 1500);
  };
  
  // Generate Training Scenarios
  const generateTrainingScenarios = () => {
    updateState({ isAnalyzing: true });
    
    // Simulate API call delay
    setTimeout(() => {
      const scenarios: TrainingScenario[] = [
        {
          id: uuidv4(),
          scenario: "An employee receives an email from what appears to be the CEO requesting immediate transfer of funds to a new vendor account. The email emphasizes urgency and confidentiality.",
          question: "Should the employee proceed with the transfer as quickly as possible?",
          correctAnswer: false,
          explanation: "This scenario indicates a potential phishing attack. According to the policy, employees must verify all fund transfer requests through established channels, regardless of the apparent sender, especially when urgency is emphasized."
        },
        {
          id: uuidv4(),
          scenario: "A colleague asks to borrow your badge to access a restricted area because they forgot theirs but have an urgent deadline.",
          question: "Is it acceptable to lend your badge to help your colleague meet their deadline?",
          correctAnswer: false,
          explanation: "The policy strictly prohibits sharing access credentials, including badges. Each employee must use only their own credentials, and forgotten badges should be handled through security protocols."
        },
        {
          id: uuidv4(),
          scenario: "While working remotely at a coffee shop, you need to access sensitive company data for an urgent project.",
          question: "Is it appropriate to access this data using the coffee shop's public WiFi?",
          correctAnswer: false,
          explanation: "The policy requires all remote access to sensitive data to occur through the company VPN. Public WiFi networks are explicitly prohibited for accessing any confidential information."
        },
        {
          id: uuidv4(),
          scenario: "You notice that a recently terminated employee still has an active account in one of the company's systems.",
          question: "Should you report this to the IT security team immediately?",
          correctAnswer: true,
          explanation: "The policy requires prompt reporting of any security issues, including access control problems. Terminated employees should have all access revoked immediately, and any oversights must be reported."
        }
      ];
      
      updateState({
        isAnalyzing: false,
        trainingScenarios: scenarios
      });
    }, 1800);
  };
  
  // Restart challenge
  const handleRestart = () => {
    setState(createInitialState());
  };
  
  // Tooltip management
  const showTooltip = (id: string) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    updateState({ tooltipVisible: id });
  };
  
  const hideTooltip = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      updateState({ tooltipVisible: null });
    }, 300);
  };
  
  // Select a sample policy
  const selectSamplePolicy = (policyId: string) => {
    const selectedPolicy = SAMPLE_POLICIES.find(policy => policy.id === policyId);
    if (selectedPolicy) {
      updateState({ 
        policyDocument: {
          ...selectedPolicy,
          source: 'sample'
        },
        policySummary: null,
        policyFAQs: [],
        trainingScenarios: []
      });
    }
  };
  
  // Simulate AI policy analysis
  const analyzePolicy = async () => {
    // Validate we have content to analyze
    if (!state.policyDocument.content) {
      updateState({ error: "Please provide policy content to analyze" });
      return;
    }
    
    updateState({ isAnalyzing: true, error: null });
    
    try {
      // In a real implementation, this would make API calls to AI services
      // For now, we'll simulate with timeouts
      
      // Mock summary generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a policy summary based on the document content
      const summary = generateMockSummary(state.policyDocument);
      
      updateState({
        policySummary: summary,
        isAnalyzing: false
      });
      
      // Auto-advance to summary step
      goToNextStep();
      
    } catch (error) {
      console.error('Error analyzing policy', error);
      updateState({ 
        isAnalyzing: false, 
        error: "An error occurred while analyzing the policy. Please try again." 
      });
    }
  };
  
  // Mock summary generation (simulates AI response)
  const generateMockSummary = (policy: PolicyDocument): PolicySummary => {
    // Basic logic to generate different summaries based on policy type
    const isTravelPolicy = policy.title.toLowerCase().includes('travel') || 
                          policy.content.toLowerCase().includes('travel');
    
    const isRemoteWorkPolicy = policy.title.toLowerCase().includes('remote') || 
                              policy.content.toLowerCase().includes('remote work');
    
    if (isTravelPolicy) {
      return {
        plainLanguageSummary: "This policy explains how employees should handle business travel and expenses. It covers booking flights, hotels, and meals, as well as how to get reimbursed properly. The main goal is to keep travel costs reasonable while ensuring employees have what they need for business trips.",
        keyPoints: [
          "All business travel needs manager approval before booking anything.",
          "Economy flights for trips under 6 hours, receipts required for all expenses.",
          "Expenses must be submitted within 14 days with itemized receipts."
        ],
        complianceRisks: [
          "Submitting fraudulent expenses can result in termination.",
          "Booking luxury accommodations or premium flights without approval will not be reimbursed.",
          "Failing to provide proper documentation may result in delayed or denied reimbursement."
        ],
        timestamp: new Date().toISOString()
      };
    } else if (isRemoteWorkPolicy) {
      return {
        plainLanguageSummary: "This policy outlines how remote work operates at the company. It covers who is eligible to work remotely, what equipment you'll receive, security requirements, and how performance is measured. The policy ensures that remote employees maintain productivity and security standards.",
        keyPoints: [
          "You must maintain availability during core hours (10am-3pm) and attend all team meetings.",
          "Company data must be kept secure with proper VPN usage and privacy measures.",
          "Remote work privileges can be revoked if performance declines."
        ],
        complianceRisks: [
          "Security breaches from improper handling of company data could result in disciplinary action.",
          "Failure to maintain availability during core hours may lead to revocation of remote work privileges.",
          "Using company equipment for non-work purposes could violate company policies."
        ],
        timestamp: new Date().toISOString()
      };
    } else {
      // Generic summary for other policy types
      return {
        plainLanguageSummary: "This policy outlines important company rules and guidelines that employees must follow. It covers specific procedures, requirements, and potential consequences for non-compliance.",
        keyPoints: [
          "Follow all procedures outlined in the document.",
          "Maintain proper documentation for all related activities.",
          "Report any violations or concerns to management."
        ],
        complianceRisks: [
          "Non-compliance may result in disciplinary action.",
          "Failure to follow procedures could create liability for the company.",
          "Repeated violations could lead to termination."
        ],
        timestamp: new Date().toISOString()
      };
    }
  };
  
  // Render the current step based on state
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case STEPS.POLICY_INPUT:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Select or Enter Policy Document</h2>
              <p className="text-gray-600">
                Choose a sample policy document or enter your own policy text to analyze. AI will decode the policy into plain language and identify key points.
              </p>
            </div>
            
            {/* Error alert */}
            {state.error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p>{state.error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Sample policy selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Choose a Sample Policy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_POLICIES.map(policy => (
                  <div
                    key={policy.id}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition
                      ${state.policyDocument.id === policy.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}
                    `}
                    onClick={() => selectSamplePolicy(policy.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{policy.title}</h4>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {policy.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {policy.content.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Or divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-sm text-gray-500">Or enter your own policy</span>
              </div>
            </div>
            
            {/* Manual policy input */}
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="policy-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Title
                </label>
                <input
                  type="text"
                  id="policy-title"
                  value={state.policyDocument.title}
                  onChange={(e) => 
                    updateState({
                      policyDocument: {
                        ...state.policyDocument,
                        title: e.target.value
                      }
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="E.g., Travel Policy, Remote Work Policy, etc."
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="policy-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Category
                </label>
                <select
                  id="policy-category"
                  value={state.policyDocument.category}
                  onChange={(e) => 
                    updateState({
                      policyDocument: {
                        ...state.policyDocument,
                        category: e.target.value
                      }
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="IT">IT</option>
                  <option value="Operations">Operations</option>
                  <option value="Legal">Legal</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Safety">Safety</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="policy-content" className="block text-sm font-medium text-gray-700">
                    Policy Content
                  </label>
                  <span className="text-xs text-gray-500">
                    {state.policyDocument.content.length} characters
                  </span>
                </div>
                
                <div className="relative">
                  <textarea
                    id="policy-content"
                    rows={12}
                    value={state.policyDocument.content}
                    onChange={(e) => 
                      updateState({
                        policyDocument: {
                          ...state.policyDocument,
                          content: e.target.value,
                          source: 'manual'
                        }
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                    placeholder="Paste your policy text here..."
                  ></textarea>
                  
                  {/* AI assistant tooltip */}
                  <div 
                    className="absolute right-3 bottom-3 text-gray-600 cursor-pointer hover:text-blue-600"
                    onMouseEnter={() => showTooltip('ai-assist')}
                    onMouseLeave={hideTooltip}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    
                    {state.tooltipVisible === 'ai-assist' && (
                      <div className="absolute z-10 right-0 bottom-8 w-64 text-sm bg-gray-800 text-white rounded-md p-3 shadow-lg">
                        <p>
                          AI works best with structured policy documents. Include sections, numbering, and specific rules for optimal analysis.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-500">
                  For best results, include the full policy text with all sections and subsections.
                </p>
              </div>
              
              <div className="flex items-center mt-6">
                <div 
                  className="text-sm text-blue-600 font-medium cursor-pointer flex items-center"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Policy Document
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.pdf,.docx,.doc"
                    className="hidden"
                    onChange={(e) => {
                      // In a real implementation, we would read the file content here
                      // For the demo, we'll just grab the file name
                      const file = e.target.files?.[0];
                      if (file) {
                        updateState({
                          policyDocument: {
                            ...state.policyDocument,
                            title: file.name.split('.')[0],
                            source: 'upload',
                            id: uuidv4()
                          }
                        });
                        
                        // Simulating file reading (in real app, we'd parse file content)
                        setTimeout(() => {
                          updateState({
                            policyDocument: {
                              ...state.policyDocument,
                              content: "This is a placeholder for uploaded document content. In a real implementation, the actual file content would be loaded here."
                            }
                          });
                        }, 500);
                      }
                    }}
                  />
                </div>
                
                <span className="mx-3 text-gray-500">|</span>
                
                <div 
                  className="text-sm text-blue-600 font-medium cursor-pointer flex items-center"
                  onClick={() => {
                    updateState({
                      policyDocument: {
                        ...createInitialState().policyDocument,
                        id: uuidv4()
                      }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Form
                </div>
              </div>
            </div>
            
            {/* AI Assistance Level */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-gray-800 mb-3">AI Assistance Level</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose how much the AI should simplify and enhance the policy:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['minimal', 'moderate', 'extensive'].map((level) => (
                  <div
                    key={level}
                    className={`
                      border rounded-lg p-3 cursor-pointer transition
                      ${state.aiAssistanceLevel === level ? 'border-blue-500 bg-white' : 'border-gray-200 bg-white hover:border-blue-300'}
                    `}
                    onClick={() => updateState({ aiAssistanceLevel: level as 'minimal' | 'moderate' | 'extensive' })}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${state.aiAssistanceLevel === level ? 'bg-blue-600' : 'border border-gray-300'}`}></div>
                      <span className="font-medium capitalize">{level}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 pl-6">
                      {level === 'minimal' && "Basic summary with simple language translation."}
                      {level === 'moderate' && "Detailed summary with key points and compliance risks."}
                      {level === 'extensive' && "Comprehensive analysis with FAQs and training scenarios."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case STEPS.SUMMARY:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Plain Language Summary</h2>
              <p className="text-gray-600">
                AI has analyzed your policy document and created the following summary in simple, easy-to-understand language.
              </p>
            </div>
            
            {/* Policy metadata card */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex flex-wrap items-center">
                <div className="mr-6 mb-2">
                  <span className="block text-xs text-gray-500 uppercase tracking-wide">Policy Title</span>
                  <span className="text-sm font-medium text-gray-800">{state.policyDocument.title}</span>
                </div>
                
                <div className="mr-6 mb-2">
                  <span className="block text-xs text-gray-500 uppercase tracking-wide">Category</span>
                  <span className="text-sm font-medium text-gray-800">{state.policyDocument.category || 'Uncategorized'}</span>
                </div>
                
                <div className="mr-6 mb-2">
                  <span className="block text-xs text-gray-500 uppercase tracking-wide">Analysis Level</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{state.aiAssistanceLevel}</span>
                </div>
                
                <div className="mr-6 mb-2">
                  <span className="block text-xs text-gray-500 uppercase tracking-wide">Analyzed On</span>
                  <span className="text-sm font-medium text-gray-800">
                    {state.policySummary ? new Date(state.policySummary.timestamp).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            </div>
            
            {/* AI Summary Container */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800">AI-Generated Summary</h3>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Header with AI label */}
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">AI GENERATED</span>
                    <span className="text-sm text-blue-700">Plain Language Translation</span>
                  </div>
                </div>
                
                {/* Summary content */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-800 leading-relaxed">
                      {state.policySummary?.plainLanguageSummary || ''}
                    </p>
                  </div>
                </div>
                
                {/* Feedback buttons */}
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Was this summary helpful?</span>
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </button>
                    <button className="ml-2 text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const summaryText = state.policySummary?.plainLanguageSummary || '';
                          navigator.clipboard.writeText(summaryText);
                          // Would add a toast notification in a real app
                          alert('Summary copied to clipboard');
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Summary
                    </button>
                    
                    <button
                      className="ml-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        // In a real app, this would trigger a regeneration API call
                        updateState({ isAnalyzing: true });
                        setTimeout(() => {
                          const summary = generateMockSummary(state.policyDocument);
                          updateState({
                            policySummary: summary,
                            isAnalyzing: false
                          });
                        }, 1500);
                      }}
                    >
                      {state.isAnalyzing ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                      {state.isAnalyzing ? 'Regenerating...' : 'Regenerate Summary'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Compare with Original */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-800">Compare with Original</h3>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    // Toggle showing the original policy
                    const originalElement = document.getElementById('original-policy-text');
                    if (originalElement) {
                      originalElement.classList.toggle('hidden');
                    }
                  }}
                >
                  Toggle Original Text
                </button>
              </div>
              
              <div id="original-policy-text" className="hidden bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
                <div className="max-h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                  {state.policyDocument.content}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-700 mb-2">What Changed</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Technical jargon and complex language replaced with simpler terms</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Long paragraphs broken down into shorter, more readable chunks</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Policy substance preserved while improving clarity and understanding</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Actions and Next Steps */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Next Steps</h3>
              <p className="text-sm text-gray-600 mb-3">
                Continue to explore more insights from the AI analysis:
              </p>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => goToStep(STEPS.KEY_POINTS)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  View Key Points
                </button>
                
                <button
                  onClick={() => goToStep(STEPS.RISKS)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  View Compliance Risks
                </button>
                
                {state.aiAssistanceLevel === 'extensive' && (
                  <button
                    onClick={() => goToStep(STEPS.EXTRAS)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Explore FAQs & Training
                  </button>
                )}
              </div>
            </div>
          </div>
        );
        
      case STEPS.KEY_POINTS:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Key Points to Remember</h2>
              <p className="text-gray-600">
                AI has identified the most important things employees need to remember from this policy. These are the critical points that ensure compliance.
              </p>
            </div>
            
            {/* Main key points card */}
            <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden mb-8">
              {/* Header */}
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <h3 className="text-lg font-medium text-blue-800">3 Most Important Points</h3>
                </div>
                <p className="text-sm text-blue-600 mt-1 ml-8">
                  These are the critical elements every employee must understand and remember
                </p>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <ul className="space-y-6">
                  {state.policySummary?.keyPoints.map((point, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-700">
                          {index + 1}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-800 font-medium">{point}</p>
                        
                        {/* Visual indicators for why this point matters */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {/* These tags would ideally be dynamically generated based on AI analysis */}
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Compliance Critical
                          </span>
                          
                          {index === 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Manager Approval Required
                            </span>
                          )}
                          
                          {index === 1 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Financial Impact
                            </span>
                          )}
                          
                          {index === 2 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Time Sensitive
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Action footer */}
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-200">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">Generated by AI based on policy analysis</span>
                </div>
                
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const pointsText = state.policySummary?.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n') || '';
                      navigator.clipboard.writeText(pointsText);
                      alert('Key points copied to clipboard');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Key Points
                </button>
              </div>
            </div>
            
            {/* Implementation tips */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800">Implementation Tips</h3>
              </div>
              
              <div className="space-y-4 pl-8">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">For Managers</h4>
                  <p className="text-sm text-gray-600">
                    Regularly review these key points in team meetings to ensure understanding. Consider creating a quick reference guide for your team based on these points.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">For Employees</h4>
                  <p className="text-sm text-gray-600">
                    Save these key points for quick reference. When in doubt about a policy detail, check these points first before proceeding or asking for clarification.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">For HR/Compliance</h4>
                  <p className="text-sm text-gray-600">
                    Consider incorporating these key points into onboarding materials and regular compliance training sessions to reinforce understanding.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Visual reminders */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Visual Memory Aids</h3>
              <p className="text-sm text-gray-600 mb-4">
                These visual associations can help employees remember the key points:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {state.policySummary?.keyPoints.map((point, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className="h-36 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      {/* In a real app, we would generate or use relevant icons here */}
                      {index === 0 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                      
                      {index === 1 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      
                      {index === 2 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold rounded-full px-2 py-1 mb-2">
                        Point {index + 1}
                      </span>
                      <p className="text-sm text-gray-800 line-clamp-2">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case STEPS.RISKS:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Compliance Risks & Consequences</h2>
              <p className="text-gray-600">
                AI has identified potential compliance risks and consequences of not following this policy. Understanding these risks helps ensure proper adherence.
              </p>
            </div>
            
            {/* Risk overview */}
            <div className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden mb-8">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-lg font-medium text-red-800">Key Compliance Risks</h3>
                </div>
                <p className="text-sm text-red-600 mt-1 ml-8">
                  These are the potential consequences of not following the policy correctly
                </p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-6">
                  {state.policySummary?.complianceRisks.map((risk, index) => (
                    <li key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      <div className="lg:col-span-9 flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {index === 0 ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              ) : index === 1 ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              )}
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-gray-800 font-medium">{risk}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {index === 0 && "This is a serious violation that could result in immediate disciplinary action."}
                            {index === 1 && "Financial impacts to both the employee and company may result from this violation."}
                            {index === 2 && "Repeated instances of this violation may escalate consequences."}
                          </p>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-3 flex flex-col justify-center">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Risk Level</span>
                          <div className="flex items-center">
                            <div className={`h-2.5 rounded-full ${
                              index === 0 ? 'bg-red-500 w-full' : 
                              index === 1 ? 'bg-orange-400 w-3/4' : 
                              'bg-yellow-400 w-1/2'
                            }`}></div>
                            <span className="ml-2 text-xs font-medium">
                              {index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Compliance guidance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800">How to Stay Compliant</h3>
                </div>
                
                <ul className="space-y-3 pl-8">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Thoroughly read and understand the complete policy</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Ask questions when you're unsure about any requirements</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Follow the proper approval processes when required</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Keep proper documentation and receipts as evidence</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Stay updated when policy changes are announced</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800">Common Compliance Mistakes</h3>
                </div>
                
                <ul className="space-y-3 pl-8">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-600">Proceeding without required approvals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-600">Missing documentation or insufficient receipts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-600">Submitting requests after applicable deadlines</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-600">Misunderstanding policy exceptions vs. standard rules</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-600">Assuming informal approval is sufficient</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Clarification guidance */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800">Need Clarification?</h3>
              </div>
              
              <div className="pl-8">
                <p className="text-sm text-gray-600 mb-4">
                  If you're unsure about any aspects of this policy or how to stay compliant, here's where to get help:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Contact HR</h4>
                    <p className="text-sm text-gray-600">
                      Email: hr@company.com<br />
                      Ext: 1234
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Compliance Team</h4>
                    <p className="text-sm text-gray-600">
                      Email: compliance@company.com<br />
                      Ext: 5678
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Policy Owner</h4>
                    <p className="text-sm text-gray-600">
                      {state.policyDocument.category === 'Finance' ? 'Finance Department' : 
                       state.policyDocument.category === 'Human Resources' ? 'HR Department' : 
                       'Department Admin'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case STEPS.EXTRAS:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Additional AI Tools</h2>
              <p className="text-gray-600">
                Explore additional AI-generated content to help employees understand and apply this policy correctly.
                These educational resources can be used for training, quick reference, and clarification.
              </p>
            </div>
            
            {/* Tabs for FAQs & Training */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button
                    onClick={() => {
                      if (state.policyFAQs.length === 0) {
                        generateFAQs();
                      }
                      const tabElements = document.querySelectorAll('[data-tab]');
                      tabElements.forEach(el => {
                        el.classList.add('hidden');
                      });
                      document.getElementById('faqs-tab')?.classList.remove('hidden');
                    }}
                    className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm"
                    aria-current="page"
                  >
                    Frequently Asked Questions
                  </button>
                  <button
                    onClick={() => {
                      if (state.trainingScenarios.length === 0) {
                        generateTrainingScenarios();
                      }
                      const tabElements = document.querySelectorAll('[data-tab]');
                      tabElements.forEach(el => {
                        el.classList.add('hidden');
                      });
                      document.getElementById('training-tab')?.classList.remove('hidden');
                    }}
                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm"
                  >
                    Training Scenarios
                  </button>
                </nav>
              </div>
            </div>
            
            {/* FAQs Tab */}
            <div id="faqs-tab" data-tab className="mb-8">
              <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-blue-800">AI-Generated FAQs</h3>
                  </div>
                  <p className="text-sm text-blue-600 mt-1 ml-8">
                    Common questions employees might have about this policy with clear answers
                  </p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {state.isAnalyzing ? (
                    <div className="p-8 flex justify-center">
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600">Generating FAQs...</span>
                      </div>
                    </div>
                  ) : state.policyFAQs.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">
                        Click the button below to generate frequently asked questions about this policy.
                      </p>
                      <button
                        onClick={generateFAQs}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Generate FAQs
                      </button>
                    </div>
                  ) : (
                    state.policyFAQs.map(faq => (
                      <div key={faq.id} className="p-6 hover:bg-blue-50 transition-colors">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {faq.question}
                        </h4>
                        <p className="mt-2 text-gray-600 ml-7">
                          {faq.answer}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                
                {state.policyFAQs.length > 0 && !state.isAnalyzing && (
                  <div className="bg-gray-50 px-6 py-3 flex justify-end items-center border-t border-gray-200">
                    <button
                      onClick={generateFAQs}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate FAQs
                    </button>
                  </div>
                )}
              </div>
              
              {state.policyFAQs.length > 0 && (
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-800">How to Use These FAQs</h3>
                  </div>
                  
                  <ul className="space-y-3 pl-8">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Include these FAQs in onboarding materials for new employees</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Create a quick reference guide for the policy using these Q&As</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Add these to your intranet or policy portal for easy access</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Review during team meetings to ensure everyone understands the policy</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Training Scenarios Tab */}
            <div id="training-tab" data-tab className="mb-8 hidden">
              <div className="bg-white rounded-lg border border-purple-200 shadow-sm overflow-hidden">
                <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h3 className="text-lg font-medium text-purple-800">Training Scenarios</h3>
                  </div>
                  <p className="text-sm text-purple-600 mt-1 ml-8">
                    Practical scenarios to test understanding of the policy
                  </p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {state.isAnalyzing ? (
                    <div className="p-8 flex justify-center">
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600">Generating training scenarios...</span>
                      </div>
                    </div>
                  ) : state.trainingScenarios.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">
                        Click the button below to generate training scenarios based on this policy.
                      </p>
                      <button
                        onClick={generateTrainingScenarios}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Generate Training Scenarios
                      </button>
                    </div>
                  ) : (
                    state.trainingScenarios.map((scenario, index) => (
                      <div key={scenario.id} className="p-6 hover:bg-purple-50 transition-colors">
                        <div className="flex items-start mb-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-700 font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-lg font-medium text-gray-900">Scenario</h4>
                            <p className="text-gray-600 mt-1">
                              {scenario.scenario}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-11 mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-800 mb-2">Question</h5>
                          <p className="text-gray-700">
                            {scenario.question}
                          </p>
                          
                          <div className="mt-4 space-y-2">
                            <button
                              className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                                scenario.correctAnswer === true
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                                scenario.correctAnswer === false
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                        
                        <div className="ml-11 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h5 className="font-medium text-yellow-800 mb-2">Explanation</h5>
                          <p className="text-yellow-700 text-sm">
                            {scenario.explanation}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {state.trainingScenarios.length > 0 && !state.isAnalyzing && (
                  <div className="bg-gray-50 px-6 py-3 flex justify-end items-center border-t border-gray-200">
                    <button
                      onClick={generateTrainingScenarios}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate Scenarios
                    </button>
                  </div>
                )}
              </div>
              
              {state.trainingScenarios.length > 0 && (
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-800">How to Use Training Scenarios</h3>
                  </div>
                  
                  <ul className="space-y-3 pl-8">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Use these scenarios in team meetings to review the policy</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Include in compliance training programs to reinforce understanding</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Create quizzes or assessments based on these scenarios</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Develop role-playing exercises for team-building activities</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Export Options */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800">Export Options</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 pl-8">
                Export AI-generated content for use in your organization's systems
              </p>
              
              <div className="flex flex-wrap gap-3 pl-8">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export as PDF
                </button>
                
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export as PowerPoint
                </button>
                
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download All
                </button>
              </div>
            </div>
            
            {/* Challenge Complete Banner */}
            <div className="mt-8 flex justify-center">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-md p-6 text-white text-center max-w-2xl">
                <div className="flex justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
                <p className="text-sm mb-4">
                  You've successfully decoded a complex policy document into plain language, identified key points, 
                  compliance risks, and created learning materials. This process can be applied to any policy document 
                  in your organization.
                </p>
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-white text-blue-600 rounded-md font-medium text-sm hover:bg-blue-50"
                >
                  Start a New Policy
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };
  
  // Render progress navigation
  const renderProgressSteps = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {Object.values(STEPS).filter(step => typeof step === 'number').map((step: number) => (
          <React.Fragment key={step}>
            {/* Step button */}
            <button
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${state.currentStep === step
                  ? 'bg-blue-600 text-white'
                  : state.currentStep > step
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-200 text-gray-600'
                }
                ${state.policySummary || step === STEPS.POLICY_INPUT ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
              onClick={() => {
                // Only allow clicking if we've analyzed the policy or it's the input step
                if (state.policySummary || step === STEPS.POLICY_INPUT) {
                  goToStep(step as STEPS);
                }
              }}
              disabled={!state.policySummary && step !== STEPS.POLICY_INPUT}
            >
              {step + 1}
            </button>
            
            {/* Step label */}
            <div className="hidden sm:block ml-2 mr-8 text-sm">
              <div className={state.currentStep >= step ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                {Object.keys(STEPS).find(key => STEPS[key as keyof typeof STEPS] === step)?.split('_').join(' ')}
              </div>
            </div>
            
            {/* Connector line */}
            {step < STEPS.EXTRAS && (
              <div className={`flex-grow h-1 mx-2 ${state.currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // Main component render
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">AI Policy Decoder</h1>
        <p className="text-gray-600 mt-2">
          Transform complex company policies into clear, actionable insights and identify potential compliance risks.
        </p>
      </div>
      
      {/* Progress steps */}
      {renderProgressSteps()}
      
      {/* Current step content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {renderCurrentStep()}
      </div>
      
      {/* Bottom navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={goToPreviousStep}
          disabled={state.currentStep === STEPS.POLICY_INPUT}
          className={`px-6 py-2 rounded-md ${
            state.currentStep === STEPS.POLICY_INPUT
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
          }`}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </div>
        </button>
        
        <div className="flex space-x-3">
          {state.currentStep === STEPS.POLICY_INPUT && (
            <button
              onClick={() => {
                // Demo function to analyze with placeholder content
                if (!state.policyDocument.content || state.policyDocument.content.trim() === '') {
                  // Get a random sample policy
                  const randomPolicy = SAMPLE_POLICIES[Math.floor(Math.random() * SAMPLE_POLICIES.length)];
                  updateState({
                    policyDocument: {
                      ...state.policyDocument,
                      id: randomPolicy.id,
                      title: randomPolicy.title,
                      content: randomPolicy.content,
                      source: 'sample',
                      category: randomPolicy.category
                    }
                  });
                } else {
                  analyzePolicy();
                }
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Try with Sample
              </div>
            </button>
          )}
          
          <button
            onClick={state.currentStep === STEPS.POLICY_INPUT ? analyzePolicy : goToNextStep}
            disabled={
              (state.currentStep === STEPS.POLICY_INPUT && !state.policyDocument.content) ||
              state.isAnalyzing
            }
            className={`px-6 py-2 rounded-md ${
              state.currentStep === STEPS.POLICY_INPUT && !state.policyDocument.content
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            <div className="flex items-center">
              {state.isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {state.currentStep === STEPS.POLICY_INPUT ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Analyze Policy
                    </>
                  ) : state.currentStep === STEPS.EXTRAS ? (
                    'Complete Challenge'
                  ) : (
                    <>
                      Next
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyDecoderMain; 