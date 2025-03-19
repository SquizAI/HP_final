import React, { useState } from 'react';
import { ShoppingCart, Factory, Briefcase, AlertCircle, Truck, Building } from 'lucide-react';

interface BusinessApplication {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string[];
}

const BUSINESS_APPLICATIONS: BusinessApplication[] = [
  {
    icon: <ShoppingCart size={20} className="text-blue-600" />,
    title: 'E-commerce & Retail',
    description: 'Improve product cataloging and enhance shopping experiences',
    examples: [
      'Automatically tag products by category, color, style, etc.',
      'Enable visual search to find similar items',
      'Organize large inventory databases by visual characteristics',
      'Detect counterfeit products by comparing with authentic images'
    ]
  },
  {
    icon: <Factory size={20} className="text-green-600" />,
    title: 'Manufacturing & Quality Control',
    description: 'Ensure product quality and streamline manufacturing processes',
    examples: [
      'Detect defects in products on production lines',
      'Identify missing components or assembly errors',
      'Sort items by size, color, or other visual attributes',
      'Monitor equipment condition to predict maintenance needs'
    ]
  },
  {
    icon: <AlertCircle size={20} className="text-red-600" />,
    title: 'Safety & Compliance',
    description: 'Enhance workplace safety and ensure regulatory compliance',
    examples: [
      'Detect safety hazards in workplace environments',
      'Ensure proper use of personal protective equipment (PPE)',
      'Monitor for unauthorized access to restricted areas',
      'Verify compliance with visual display requirements'
    ]
  },
  {
    icon: <Truck size={20} className="text-purple-600" />,
    title: 'Logistics & Inventory',
    description: 'Optimize inventory management and streamline logistics',
    examples: [
      'Track inventory by scanning warehouse images',
      'Classify incoming shipments by type or priority',
      'Detect damaged packages during handling',
      'Optimize space utilization by analyzing storage areas'
    ]
  },
  {
    icon: <Briefcase size={20} className="text-orange-600" />,
    title: 'Marketing & Content',
    description: 'Improve content organization and marketing effectiveness',
    examples: [
      'Categorize marketing assets by content type, themes, or subjects',
      'Identify brand-compliant vs. non-compliant imagery',
      'Analyze competitor visual content strategy',
      'Automate content moderation for user-generated content'
    ]
  },
  {
    icon: <Building size={20} className="text-indigo-600" />,
    title: 'Real Estate & Construction',
    description: 'Enhance property assessment and construction projects',
    examples: [
      'Classify properties by architectural style or features',
      'Detect construction issues or code violations',
      'Assess property damage for insurance claims',
      'Monitor progress on construction sites'
    ]
  }
];

const BusinessApplications: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  return (
    <div className="space-y-3">
      {BUSINESS_APPLICATIONS.map((application, index) => (
        <div 
          key={index} 
          className="border border-gray-200 rounded-md overflow-hidden"
        >
          <div 
            className={`flex items-center justify-between p-3 cursor-pointer ${
              expandedIndex === index ? 'bg-purple-50' : 'bg-white'
            }`}
            onClick={() => toggleExpand(index)}
          >
            <div className="flex items-center">
              <div className="mr-3">
                {application.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{application.title}</h4>
                <p className="text-sm text-gray-600">{application.description}</p>
              </div>
            </div>
            <div className="text-purple-600">
              <svg 
                className={`w-5 h-5 transform transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {expandedIndex === index && (
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                {application.examples.map((example, exIndex) => (
                  <li key={exIndex}>{example}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BusinessApplications; 