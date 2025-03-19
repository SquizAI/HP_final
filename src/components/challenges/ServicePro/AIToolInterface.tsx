import React, { useState } from 'react'
import { TicketType } from '../../../types'
import { aiTools } from './TicketData'

interface AIToolInterfaceProps {
  selectedTicket: TicketType | null
  onApplyTool: (toolId: string, ticket: TicketType) => void
  onCancel: () => void
}

const AIToolInterface: React.FC<AIToolInterfaceProps> = ({ 
  selectedTicket, 
  onApplyTool, 
  onCancel 
}) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  
  if (!selectedTicket) return null
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800">
          AI Service Resolution Tools
        </h2>
        <p className="text-gray-600 mt-2">
          Select an AI tool to assist with resolving ticket: 
          <span className="font-medium">{selectedTicket.title}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiTools.map(tool => (
          <div 
            key={tool.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedTool === tool.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedTool(tool.id)}
          >
            <h3 className="text-lg font-semibold text-gray-800">{tool.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
            <p className="mt-2 text-sm font-medium text-blue-600">{tool.effect}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          disabled={!selectedTool}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          onClick={() => selectedTool && onApplyTool(selectedTool, selectedTicket)}
        >
          Apply Tool
        </button>
      </div>
    </div>
  )
}

export default AIToolInterface 