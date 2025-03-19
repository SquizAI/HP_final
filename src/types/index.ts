// Challenge Types
export interface Challenge {
  id: string
  title: string
  description: string
  icon: string
  status: 'available' | 'completed' | 'locked'
  xp: number
  path: string
}

// ServicePro Challenge Types
export interface TicketType {
  id: string
  title: string
  description: string
  category: 'hardware' | 'software' | 'network' | 'security' | 'other'
  impact: number // 1-5 scale (5 being highest)
  urgency: number // 1-5 scale (5 being highest)
  affectedUsers: number
  estimatedResolutionTime: number // in minutes
  baseResolutionTime: number // original time before AI tools
  resolutionAccuracy: number // percentage
  status: 'open' | 'in-progress' | 'resolved'
  timestamp: string
  aiRecommendation?: string
}

export interface AITool {
  id: string
  name: string
  description: string
  effect: string
  timeReduction: number
  accuracyBoost: number
}

// User Progress Types
export interface UserProgress {
  completedChallenges: string[]
  points: number
  level: number
  abilities: string[]
  buildingBlocks: BuildingBlock[]
}

export interface BuildingBlock {
  id: string
  name: string
  description: string
}

// Rewards Types
export interface ChallengeReward {
  xp: number
  ability: string
  buildingBlock: BuildingBlock
} 