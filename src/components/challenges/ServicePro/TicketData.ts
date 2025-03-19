import { TicketType, AITool } from '../../../types'

export const initialTickets: TicketType[] = [
  {
    id: 'T-1001',
    title: 'Email Server Down',
    description: 'Company email server is not responding. Multiple departments reporting inability to send or receive emails. Started approximately 30 minutes ago.',
    category: 'network',
    impact: 5,
    urgency: 5,
    affectedUsers: 250,
    estimatedResolutionTime: 120,
    baseResolutionTime: 120,
    resolutionAccuracy: 80,
    status: 'open',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    aiRecommendation: 'Critical system affecting entire organization. Recommended for immediate attention.'
  },
  {
    id: 'T-1002',
    title: 'Printer Not Working',
    description: 'Marketing department reports their main printer is showing error code E502. They have tried restarting it with no success.',
    category: 'hardware',
    impact: 2,
    urgency: 3,
    affectedUsers: 12,
    estimatedResolutionTime: 45,
    baseResolutionTime: 45,
    resolutionAccuracy: 85,
    status: 'open',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'T-1003',
    title: 'VPN Access Issue',
    description: 'Several remote employees unable to connect to VPN. Error message states "Authentication failed" despite using correct credentials.',
    category: 'network',
    impact: 3,
    urgency: 4,
    affectedUsers: 18,
    estimatedResolutionTime: 60,
    baseResolutionTime: 60,
    resolutionAccuracy: 75,
    status: 'open',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 'T-1004',
    title: 'CRM Software Slow',
    description: 'Sales team reporting that the CRM software is extremely slow to load customer information. Affecting their ability to process orders.',
    category: 'software',
    impact: 4,
    urgency: 4,
    affectedUsers: 35,
    estimatedResolutionTime: 90,
    baseResolutionTime: 90,
    resolutionAccuracy: 70,
    status: 'open',
    timestamp: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
  },
  {
    id: 'T-1005',
    title: 'Password Reset Request',
    description: 'User John Smith requests password reset for his account. Unable to login to his workstation this morning.',
    category: 'security',
    impact: 1,
    urgency: 2,
    affectedUsers: 1,
    estimatedResolutionTime: 15,
    baseResolutionTime: 15,
    resolutionAccuracy: 95,
    status: 'open',
    timestamp: new Date(Date.now() - 9000000).toISOString(), // 2.5 hours ago
  },
  {
    id: 'T-1006',
    title: 'New Software Installation',
    description: 'Design department requesting installation of Adobe Creative Suite on 5 workstations for new project starting next week.',
    category: 'software',
    impact: 2,
    urgency: 1,
    affectedUsers: 5,
    estimatedResolutionTime: 120,
    baseResolutionTime: 120,
    resolutionAccuracy: 90,
    status: 'open',
    timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
  }
]

export const aiTools: AITool[] = [
  {
    id: 'automated-diagnosis',
    name: 'AI Automated Diagnosis',
    description: 'Uses pattern recognition to identify common issues',
    effect: 'Reduces resolution time by 30%',
    timeReduction: 0.3,
    accuracyBoost: 0.2
  },
  {
    id: 'sentiment-analysis',
    name: 'User Sentiment Analysis',
    description: 'Analyzes ticket language to detect urgency and frustration',
    effect: 'Improves resolution accuracy by 30%',
    timeReduction: 0.1,
    accuracyBoost: 0.3
  },
  {
    id: 'knowledge-base',
    name: 'AI Knowledge Base',
    description: 'Searches across previous solutions for similar issues',
    effect: 'Reduces resolution time by 40%',
    timeReduction: 0.4,
    accuracyBoost: 0.1
  },
  {
    id: 'pattern-recognition',
    name: 'System Pattern Recognition',
    description: 'Identifies related system issues and root causes',
    effect: 'Improves resolution accuracy by 40%',
    timeReduction: 0.2,
    accuracyBoost: 0.4
  }
]

// Helper function to calculate ticket priority
export const calculateTicketPriority = (ticket: TicketType): number => {
  const { impact, urgency, affectedUsers } = ticket
  
  // Priority algorithm based on impact, urgency and number of affected users
  const baseScore = impact * 3 + urgency * 2
  const userMultiplier = affectedUsers > 100 ? 1.5 : 
                         affectedUsers > 50 ? 1.3 : 
                         affectedUsers > 10 ? 1.1 : 1
  
  return Math.round(baseScore * userMultiplier)
}

// Helper function to calculate reward based on performance
export const calculateRewards = (score: number) => {
  let xp = 100 // Base XP
  
  // Additional XP based on performance
  if (score >= 90) xp += 75
  else if (score >= 75) xp += 50
  else if (score >= 60) xp += 25
  
  return {
    xp,
    ability: 'service-optimization',
    buildingBlock: {
      id: 'it-process-automation',
      name: 'IT Process Automation',
      description: 'Automate routine IT tasks using AI'
    }
  }
} 