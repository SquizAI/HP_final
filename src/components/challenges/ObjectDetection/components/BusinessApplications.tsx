import React from 'react';
import { ShieldCheck, ShoppingBag, Truck, Users, Package, BarChart3 } from 'lucide-react';

const BusinessApplications: React.FC = () => {
  const applications = [
    {
      title: 'Retail Analytics',
      description: 'Count customers, track store traffic patterns, analyze product engagement',
      icon: <ShoppingBag size={18} className="text-purple-600" />
    },
    {
      title: 'Security & Surveillance',
      description: 'Detect unauthorized access, identify suspicious behaviors, monitor restricted areas',
      icon: <ShieldCheck size={18} className="text-red-600" />
    },
    {
      title: 'Logistics & Inventory',
      description: 'Track packages, count items on shelves, monitor warehouse stock levels',
      icon: <Package size={18} className="text-blue-600" />
    },
    {
      title: 'Manufacturing QA',
      description: 'Inspect products for defects, verify assembly completion, ensure proper packaging',
      icon: <Truck size={18} className="text-green-600" />
    },
    {
      title: 'Workplace Safety',
      description: 'Ensure PPE compliance, detect hazardous situations, monitor equipment usage',
      icon: <Users size={18} className="text-amber-600" />
    },
    {
      title: 'Data Analysis',
      description: 'Generate insights from visual data, create dashboards, track metrics over time',
      icon: <BarChart3 size={18} className="text-indigo-600" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map((app, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-3 bg-white hover:shadow-sm transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-gray-50">
              {app.icon}
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{app.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{app.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusinessApplications; 