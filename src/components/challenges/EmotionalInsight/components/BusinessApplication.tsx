import React, { useState } from 'react';

type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'neutral' | 'contempt';

interface EmotionAnalysis {
  primaryEmotion: EmotionType;
  confidence: number;
  secondaryEmotions: Array<{
    emotion: EmotionType;
    confidence: number;
  }>;
  timestamp: string;
}

interface BusinessApplicationProps {
  analysis: EmotionAnalysis;
  userReflection: {
    accuracy: 'high' | 'medium' | 'low' | null;
    reasons: string;
    businessApplication: string;
  };
  onRestart: () => void;
  onBack: () => void;
}

const BusinessApplication: React.FC<BusinessApplicationProps> = ({
  analysis,
  userReflection,
  onRestart,
  onBack
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // List of business applications by industry
  const businessApplications = [
    {
      id: 'customer-service',
      industry: 'Customer Service',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      description: 'Enhance customer support by detecting and prioritizing frustrated customers, routing them to appropriate agents, and improving overall satisfaction.',
      applications: [
        'Real-time emotion detection during customer calls to flag upset customers',
        'Post-interaction analysis to identify patterns in customer emotions',
        'Agent training using historical emotional response data',
        'Escalation protocols triggered by detected frustration or anger'
      ]
    },
    {
      id: 'marketing',
      industry: 'Marketing & Advertising',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      description: 'Optimize campaigns by measuring emotional responses to advertisements, adjust messaging based on audience reactions, and create more impactful content.',
      applications: [
        'Emotional response testing for ad campaigns before full deployment',
        'Personalized content delivery based on detected emotional states',
        'A/B testing with emotional response metrics',
        'Brand sentiment analysis across social media platforms'
      ]
    },
    {
      id: 'product-design',
      industry: 'Product Design & UX',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Improve product experiences by tracking emotional responses during user testing, identifying pain points, and enhancing moments of delight.',
      applications: [
        'Facial expression tracking during usability testing sessions',
        'Emotional heatmaps for digital interfaces showing user frustration points',
        'User journey mapping with emotional state overlays',
        'Iterative design improvements based on emotional feedback'
      ]
    },
    {
      id: 'hr',
      industry: 'HR & Team Management',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: 'Support employee well-being by monitoring team sentiment, identifying stress patterns, and creating more positive work environments.',
      applications: [
        'Voluntary employee wellness check-ins with emotion analysis',
        'Team meeting mood analysis to improve collaboration',
        'Stress detection in high-pressure work environments',
        'Early burnout warning systems for managers'
      ]
    },
    {
      id: 'healthcare',
      industry: 'Healthcare',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      description: 'Enhance patient care through emotion recognition during consultations, remote monitoring of emotional well-being, and more empathetic healthcare delivery.',
      applications: [
        'Remote patient monitoring with emotional state tracking',
        'Mental health support with emotion-aware digital interventions',
        'Emotion recognition training for healthcare providers',
        'Improved patient experience through emotionally-aware care'
      ]
    }
  ];
  
  // Ethical considerations
  const ethicalConsiderations = [
    {
      title: 'Consent & Transparency',
      description: 'Always obtain clear consent before analyzing emotions and be transparent about how the data will be used.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Privacy & Data Security',
      description: 'Emotional data is highly sensitive. Store it securely, limit access, and have clear data retention policies.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: 'Accuracy & Limitations',
      description: 'Recognize that emotion detection is not perfect and varies across cultures, contexts, and individuals. Avoid high-stakes decisions based solely on AI emotion recognition.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      title: 'Inclusivity & Diversity',
      description: 'Ensure systems are trained on diverse data to avoid bias across different demographics, cultures, and expression styles.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      title: 'Human Oversight',
      description: 'Keep humans in the loop, especially for decisions that impact people. Use AI emotion detection as a tool to augment human judgment, not replace it.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Business Applications</h2>
      
      {/* User reflection summary */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Analysis Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Primary Emotion Detected</h4>
            <p className="text-lg font-medium text-gray-900 capitalize">{analysis.primaryEmotion}</p>
            <p className="text-sm text-gray-500">Confidence: {analysis.confidence}%</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Your Accuracy Assessment</h4>
            <div className="flex items-center">
              {userReflection.accuracy === 'high' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  High Accuracy
                </span>
              )}
              {userReflection.accuracy === 'medium' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Medium Accuracy
                </span>
              )}
              {userReflection.accuracy === 'low' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Low Accuracy
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">{userReflection.reasons}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Your Business Application</h4>
            <p className="text-sm text-gray-600">{userReflection.businessApplication}</p>
          </div>
        </div>
      </div>
      
      {/* Industry applications */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Industry Applications for Emotion Recognition
        </h3>
        <div className="space-y-4">
          {businessApplications.map((app) => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection(app.id)}
              >
                <div className="flex items-center">
                  <div className="mr-4 flex-shrink-0">{app.icon}</div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{app.industry}</h4>
                    <p className="text-sm text-gray-600">{app.description}</p>
                  </div>
                </div>
                <div>
                  <svg 
                    className={`h-6 w-6 text-gray-400 transform transition-transform ${expandedSection === app.id ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedSection === app.id && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Specific Applications:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {app.applications.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Ethical considerations */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Ethical Considerations for Emotion AI
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <p className="text-gray-600 mb-6">
            When implementing emotion recognition in business contexts, these ethical considerations should be carefully addressed:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ethicalConsiderations.map((item, idx) => (
              <div key={idx} className="flex">
                <div className="mr-4 flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Challenge completion */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-center mb-2">Challenge Complete!</h3>
        <p className="text-center mb-4 opacity-90">
          You've successfully explored how AI can analyze emotions and how this capability can be applied in various business contexts.
        </p>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-2">Key Takeaways:</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li className="flex items-start">
              <svg className="h-5 w-5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Emotion recognition AI can detect sentiment in video, audio, and text to enhance business decision-making</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Applications span customer service, marketing, product design, HR, and healthcare</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Implementation requires careful ethical consideration of consent, privacy, and limitations</span>
            </li>
          </ul>
        </div>
        
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Try Another Example
          </button>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Reflection
        </button>
      </div>
    </div>
  );
};

export default BusinessApplication; 