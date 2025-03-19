import { create } from 'zustand'
import { UserProgress, BuildingBlock } from '../types'

interface HeroStore extends UserProgress {
  gainXP: (points: number) => void
  completeChallenge: (challengeId: string) => void
  unlockAbility: (abilityId: string) => void
  addBlock: (block: BuildingBlock) => void
}

const useHeroStore = create<HeroStore>((set) => ({
  completedChallenges: [],
  points: 0,
  level: 1,
  abilities: [],
  buildingBlocks: [],
  
  gainXP: (points) => set((state) => {
    const newPoints = state.points + points
    const newLevel = calculateLevel(newPoints)
    
    return {
      points: newPoints,
      level: newLevel,
    }
  }),
  
  completeChallenge: (challengeId) => set((state) => {
    if (state.completedChallenges.includes(challengeId)) {
      return state
    }
    
    return {
      completedChallenges: [...state.completedChallenges, challengeId],
    }
  }),
  
  unlockAbility: (abilityId) => set((state) => {
    if (state.abilities.includes(abilityId)) {
      return state
    }
    
    return {
      abilities: [...state.abilities, abilityId],
    }
  }),
  
  addBlock: (block) => set((state) => {
    if (state.buildingBlocks.some(b => b.id === block.id)) {
      return state
    }
    
    return {
      buildingBlocks: [...state.buildingBlocks, block],
    }
  }),
}))

// Helper function to calculate level based on points
const calculateLevel = (points: number): number => {
  const levelThresholds = [0, 100, 250, 450, 700, 1000, 1500, 2000, 3000, 4000]
  let level = 1
  
  for (let i = 1; i < levelThresholds.length; i++) {
    if (points >= levelThresholds[i]) {
      level = i + 1
    } else {
      break
    }
  }
  
  return level
}

export default useHeroStore 