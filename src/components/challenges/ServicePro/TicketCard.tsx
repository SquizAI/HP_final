import React from 'react'
import { TicketType } from '../../../types'
import { calculateTicketPriority } from './TicketData'

interface TicketCardProps {
  ticket: TicketType
  isSelected: boolean
  onSelect: (ticket: TicketType) => void
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, isSelected, onSelect }) => {
  const { 
    title, 
    category, 
    description, 
    impact, 
    urgency, 
    affectedUsers, 
    timestamp 
  } = ticket
  
  const priority = calculateTicketPriority(ticket)
  const priorityClass = 
    priority > 12 ? 'bg-red-100 border-red-400' :
    priority > 8 ? 'bg-orange-100 border-orange-400' :
    priority > 5 ? 'bg-yellow-100 border-yellow-400' :
    'bg-green-100 border-green-400'
  
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : `border-gray-200 ${priorityClass}`
      }`}
      onClick={() => onSelect(ticket)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
          {category}
        </span>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-lg font-semibold">{impact}</div>
          <div className="text-xs text-gray-500">Impact</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{urgency}</div>
          <div className="text-xs text-gray-500">Urgency</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{affectedUsers}</div>
          <div className="text-xs text-gray-500">Users</div>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Opened: {new Date(timestamp).toLocaleString()}
        </span>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200">
          Priority: {priority}
        </span>
      </div>
    </div>
  )
}

export default TicketCard 