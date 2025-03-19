import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TicketType } from '../../../types'
import { initialTickets, calculateTicketPriority } from './TicketData'
import TicketCard from './TicketCard'
import AIToolInterface from './AIToolInterface'
import PerformanceMetrics from './PerformanceMetrics'
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager'
import Confetti from '../../shared/Confetti'
import ChallengeHeader from '../../shared/ChallengeHeader'
import { Ticket, CheckCircle } from 'lucide-react'

const ServiceProChallenge: React.FC = () => {
  // Challenge state
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [tickets, setTickets] = useState<TicketType[]>(initialTickets)
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null)
  const [resolvedTickets, setResolvedTickets] = useState<TicketType[]>([])
  const [aiToolsApplied, setAiToolsApplied] = useState<string[]>([])
  const [performanceScore, setPerformanceScore] = useState<number>(0)
  const [showReward, setShowReward] = useState<boolean>(false)
  
  // User progress tracking for completion
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Check if challenge is already completed
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-1')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Handle ticket selection
  const handleTicketSelect = (ticket: TicketType) => {
    setSelectedTicket(ticket)
  }
  
  // Apply AI tool to ticket
  const applyAITool = (toolId: string, ticket: TicketType) => {
    // Different AI tools have different effects on resolution time and effectiveness
    const toolEffects: Record<string, { timeReduction: number, accuracyBoost: number }> = {
      'automated-diagnosis': { timeReduction: 0.3, accuracyBoost: 0.2 },
      'sentiment-analysis': { timeReduction: 0.1, accuracyBoost: 0.3 },
      'knowledge-base': { timeReduction: 0.4, accuracyBoost: 0.1 },
      'pattern-recognition': { timeReduction: 0.2, accuracyBoost: 0.4 }
    }
    
    const effect = toolEffects[toolId] || { timeReduction: 0, accuracyBoost: 0 }
    
    // Apply effect to the ticket
    const updatedTicket = {
      ...ticket,
      estimatedResolutionTime: Math.round(ticket.estimatedResolutionTime * (1 - effect.timeReduction)),
      resolutionAccuracy: Math.min(100, ticket.resolutionAccuracy + (effect.accuracyBoost * 100)),
      status: 'resolved' as const
    }
    
    // Update state
    setTickets(tickets.filter(t => t.id !== ticket.id))
    setResolvedTickets([...resolvedTickets, updatedTicket])
    setAiToolsApplied([...aiToolsApplied, toolId])
    setSelectedTicket(null)
    
    // If all tickets are resolved, calculate performance and move to next step
    if (tickets.length === 1) {
      setTimeout(() => {
        const score = calculatePerformanceScore()
        setPerformanceScore(score)
        setCurrentStep(1)
      }, 500)
    }
  }
  
  // Calculate performance score
  const calculatePerformanceScore = () => {
    if (resolvedTickets.length === 0) return 0
    
    const weights = {
      resolutionTime: 0.4,
      accuracy: 0.4,
      prioritization: 0.2
    }
    
    let totalScore = 0
    
    resolvedTickets.forEach(ticket => {
      // Time score (lower is better)
      const timeScore = Math.max(0, 100 - (ticket.estimatedResolutionTime / ticket.baseResolutionTime) * 100)
      
      // Accuracy score (higher is better)
      const accuracyScore = ticket.resolutionAccuracy
      
      // Priority score (based on whether high priority tickets were resolved first)
      const priorityScore = 80 // Simplified for this implementation
      
      const ticketScore = 
        timeScore * weights.resolutionTime + 
        accuracyScore * weights.accuracy + 
        priorityScore * weights.prioritization
      
      totalScore += ticketScore
    })
    
    return Math.round(totalScore / resolvedTickets.length)
  }
  
  // Handle challenge completion with our standardized approach
  const handleChallengeComplete = () => {
    markChallengeAsCompleted('challenge-1');
    setIsCompleted(true);
    setShowReward(true);
    
    // Show confetti
    setShowConfetti(true);
    
    // Reset confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  }
  
  // Cancel ticket selection
  const handleCancelSelection = () => {
    setSelectedTicket(null)
  }
  
  // Render introduction step
  const renderIntroduction = () => (
    <div className="space-y-6">
      <div className="challenge-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ServicePro Challenge</h1>
          <p className="text-gray-600">Optimize IT service management with AI</p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
          Demo Challenge
        </div>
      </div>
      
      {selectedTicket ? (
        <AIToolInterface 
          selectedTicket={selectedTicket}
          onApplyTool={applyAITool}
          onCancel={handleCancelSelection}
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800">
              IT Service Management
            </h2>
            <p className="text-gray-600 mt-2">
              As an IT Service Manager, your job is to prioritize and resolve support tickets efficiently.
              Use AI tools to improve resolution time and accuracy.
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ticket Queue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  isSelected={selectedTicket?.id === ticket.id}
                  onSelect={handleTicketSelect}
                />
              ))}
            </div>
          </div>
          
          {resolvedTickets.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resolved Tickets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resolvedTickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    className="p-4 border border-green-200 bg-green-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Resolved
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{ticket.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Resolution time: {ticket.estimatedResolutionTime} min
                      </span>
                      <span className="text-xs text-gray-500">
                        Accuracy: {ticket.resolutionAccuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
  
  // Render performance metrics step
  const renderPerformanceMetrics = () => (
    <PerformanceMetrics
      resolvedTickets={resolvedTickets}
      performanceScore={performanceScore}
      onContinue={handleChallengeComplete}
    />
  )
  
  // Render reward screen
  const renderRewardScreen = () => (
    <div className="space-y-8 text-center">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-blue-800">
          Challenge Complete!
        </h2>
        <p className="text-gray-600 mt-2">
          You've successfully completed the ServicePro challenge with a score of {performanceScore}!
        </p>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What you've learned:</h3>
        <ul className="space-y-2 max-w-md mx-auto text-left">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Prioritize IT service tickets based on impact, urgency, and affected users</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Apply AI tools to optimize resolution time and accuracy</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Analyze performance metrics to improve service delivery</span>
          </li>
        </ul>
      </div>
      
      <div className="flex justify-center space-x-4 pt-4">
        <Link to="/" className="btn btn-primary">
          Return to Hub
        </Link>
      </div>
    </div>
  )
  
  // Render the current step
  const renderStep = () => {
    if (showReward) {
      return renderRewardScreen()
    }
    
    switch (currentStep) {
      case 0:
        return renderIntroduction()
      case 1:
        return renderPerformanceMetrics()
      default:
        return null
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Add our standardized header */}
      <ChallengeHeader
        title="ServicePro Challenge"
        icon={<Ticket className="h-6 w-6 text-blue-600" />}
        challengeId="challenge-1"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleChallengeComplete}
      />
      
      {renderStep()}
    </div>
  )
}

export default ServiceProChallenge 