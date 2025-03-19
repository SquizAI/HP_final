import React from 'react'
import { TicketType } from '../../../types'

interface PerformanceMetricsProps {
  resolvedTickets: TicketType[]
  performanceScore: number
  onContinue: () => void
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  resolvedTickets, 
  performanceScore, 
  onContinue 
}) => {
  // Calculate average resolution time improvement
  const timeImprovement = resolvedTickets.reduce((acc, ticket) => {
    const improvement = 1 - (ticket.estimatedResolutionTime / ticket.baseResolutionTime)
    return acc + improvement
  }, 0) / resolvedTickets.length * 100
  
  // Calculate average accuracy
  const averageAccuracy = resolvedTickets.reduce((acc, ticket) => {
    return acc + ticket.resolutionAccuracy
  }, 0) / resolvedTickets.length
  
  // Get performance rating
  const getPerformanceRating = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'text-green-600' }
    if (score >= 75) return { text: 'Good', color: 'text-blue-600' }
    if (score >= 60) return { text: 'Satisfactory', color: 'text-yellow-600' }
    return { text: 'Needs Improvement', color: 'text-red-600' }
  }
  
  const rating = getPerformanceRating(performanceScore)
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800">
          Performance Analysis
        </h2>
        <p className="text-gray-600 mt-2">
          Here's how you performed in resolving the IT service tickets
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500 mb-1">Overall Score</div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold mr-2">{performanceScore}</span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
          <div className={`text-sm font-medium mt-1 ${rating.color}`}>
            {rating.text}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500 mb-1">Time Efficiency</div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold mr-2">{timeImprovement.toFixed(1)}</span>
            <span className="text-sm text-gray-500">% faster</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            With AI assistance
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500 mb-1">Resolution Accuracy</div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold mr-2">{averageAccuracy.toFixed(1)}</span>
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Average across tickets
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Resolution Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resolvedTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="px-4 py-3 text-sm">{ticket.title}</td>
                  <td className="px-4 py-3 text-sm">{ticket.impact * ticket.urgency}</td>
                  <td className="px-4 py-3 text-sm">{ticket.estimatedResolutionTime} min</td>
                  <td className="px-4 py-3 text-sm">{ticket.resolutionAccuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          className="btn btn-primary"
          onClick={onContinue}
        >
          Continue to Rewards
        </button>
      </div>
    </div>
  )
}

export default PerformanceMetrics 