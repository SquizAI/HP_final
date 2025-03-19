import { useLocalStorage } from '../hooks/useLocalStorage';
import React, { useState, useEffect } from 'react';

// Types for user data
export interface UserProgress {
  completedChallenges: string[];
  challengeData: Record<string, any>;
  lastActive: string;
}

export interface UserPreferences {
  showLeaderboard: boolean;
  darkMode: boolean;
  username: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  completedChallenges: number;
  lastActive: string;
}

// Default values
const DEFAULT_USER_PROGRESS: UserProgress = {
  completedChallenges: [],
  challengeData: {},
  lastActive: new Date().toISOString()
};

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  showLeaderboard: true,
  darkMode: false,
  username: `User_${Math.floor(Math.random() * 10000)}`
};

// Generate a persistent user ID if none exists
export const getUserId = (): string => {
  const storedId = localStorage.getItem('ai_hub_user_id');
  if (storedId) return storedId;
  
  const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem('ai_hub_user_id', newId);
  return newId;
};

// Hooks for accessing user data
export const useUserProgress = <T extends Record<string, any> = Record<string, any>>(): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [userProgress, setUserProgress] = React.useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('userProgress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing user progress:', e);
      }
    }
    
    // Default initial state
    return {
      completedChallenges: [],
      lastActive: new Date().toISOString(),
      preferences: {},
      challengeData: {}
    };
  });
  
  // Save to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  }, [userProgress]);
  
  return [userProgress, setUserProgress];
};

export const useUserPreferences = () => {
  return useLocalStorage<UserPreferences>('ai_hub_user_preferences', DEFAULT_USER_PREFERENCES);
};

export const useLeaderboard = () => {
  return useLocalStorage<LeaderboardEntry[]>('ai_hub_leaderboard', []);
};

// Utility functions for managing challenge data
export const saveChallengeTrend = (
  challengeId: string,
  industryName: string,
  trendName: string,
  analysis: string
): void => {
  const userProgress = JSON.parse(localStorage.getItem('userProgress') || JSON.stringify(DEFAULT_USER_PROGRESS)) as UserProgress;
  
  if (!userProgress.challengeData[challengeId]) {
    userProgress.challengeData[challengeId] = {};
  }
  
  userProgress.challengeData[challengeId].trendSpotter = {
    industry: industryName,
    trend: trendName,
    analysis: analysis,
    completedAt: new Date().toISOString()
  };
  
  userProgress.lastActive = new Date().toISOString();
  localStorage.setItem('userProgress', JSON.stringify(userProgress));
};

export const saveChallengeBizStrategy = (
  challengeId: string,
  businessGoal: string,
  businessType: string,
  industryContext: string,
  strategyElements: string[],
  assessment: string
): void => {
  const userProgress = JSON.parse(localStorage.getItem('userProgress') || JSON.stringify(DEFAULT_USER_PROGRESS)) as UserProgress;
  
  if (!userProgress.challengeData[challengeId]) {
    userProgress.challengeData[challengeId] = {};
  }
  
  userProgress.challengeData[challengeId].bizStrategy = {
    businessGoal,
    businessType,
    industryContext,
    strategyElements,
    assessment,
    completedAt: new Date().toISOString()
  };
  
  userProgress.lastActive = new Date().toISOString();
  localStorage.setItem('userProgress', JSON.stringify(userProgress));
};

export const saveChallengeBrainstorm = (
  challengeId: string,
  problemStatement: string,
  ideaCategory: string,
  selectedIdea: {
    title: string;
    description: string;
  },
  implementation: string
): void => {
  const userProgress = JSON.parse(localStorage.getItem('userProgress') || JSON.stringify(DEFAULT_USER_PROGRESS)) as UserProgress;
  
  if (!userProgress.challengeData[challengeId]) {
    userProgress.challengeData[challengeId] = {};
  }
  
  userProgress.challengeData[challengeId].brainstorm = {
    problemStatement,
    ideaCategory,
    selectedIdea,
    implementation,
    completedAt: new Date().toISOString()
  };
  
  // Mark the challenge as completed
  if (!userProgress.completedChallenges.includes(challengeId)) {
    userProgress.completedChallenges.push(challengeId);
  }
  
  userProgress.lastActive = new Date().toISOString();
  localStorage.setItem('userProgress', JSON.stringify(userProgress));
  
  // Update the leaderboard
  updateLeaderboard(calculateUserScore());
};

export const updateLeaderboard = (score: number): void => {
  const userId = getUserId();
  const username = (JSON.parse(localStorage.getItem('ai_hub_user_preferences') || JSON.stringify(DEFAULT_USER_PREFERENCES)) as UserPreferences).username;
  const userProgress = JSON.parse(localStorage.getItem('userProgress') || JSON.stringify(DEFAULT_USER_PROGRESS)) as UserProgress;
  
  const leaderboard = JSON.parse(localStorage.getItem('ai_hub_leaderboard') || '[]') as LeaderboardEntry[];
  
  // Find if user is already on leaderboard
  const existingEntryIndex = leaderboard.findIndex(entry => entry.id === userId);
  
  const newEntry: LeaderboardEntry = {
    id: userId,
    username,
    score,
    completedChallenges: userProgress.completedChallenges.length,
    lastActive: new Date().toISOString()
  };
  
  if (existingEntryIndex >= 0) {
    // Update existing entry if score is higher
    if (leaderboard[existingEntryIndex].score < score) {
      leaderboard[existingEntryIndex] = newEntry;
    }
  } else {
    // Add new entry
    leaderboard.push(newEntry);
  }
  
  // Sort leaderboard by score (descending)
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Keep only top 100
  const topLeaderboard = leaderboard.slice(0, 100);
  
  localStorage.setItem('ai_hub_leaderboard', JSON.stringify(topLeaderboard));
};

// Function to clear user data (useful for testing or user-initiated resets)
export const clearUserData = (): void => {
  localStorage.removeItem('userProgress');
  localStorage.removeItem('ai_hub_user_preferences');
  
  // Don't clear the user ID or leaderboard by default
  // localStorage.removeItem('ai_hub_user_id');
  // localStorage.removeItem('ai_hub_leaderboard');
};

// Calculate a score based on user progress
export const calculateUserScore = (): number => {
  const userProgress = JSON.parse(localStorage.getItem('userProgress') || JSON.stringify(DEFAULT_USER_PROGRESS)) as UserProgress;
  
  // Basic scoring: 100 points per completed challenge
  const challengePoints = userProgress.completedChallenges.length * 100;
  
  // Bonus points for variety (completed different types of challenges)
  const uniqueChallengeTypes = new Set(userProgress.completedChallenges).size;
  const varietyBonus = uniqueChallengeTypes * 50;
  
  return challengePoints + varietyBonus;
};

// Function to get user progress data from localStorage
const getUserProgress = () => {
  try {
    const userProgressData = localStorage.getItem('userProgress');
    if (!userProgressData) {
      return {
        completedChallenges: [],
        challengeData: {},
        lastActive: new Date().toISOString()
      };
    }
    return JSON.parse(userProgressData);
  } catch (error) {
    console.error('Error getting user progress:', error);
    return {
      completedChallenges: [],
      challengeData: {},
      lastActive: new Date().toISOString()
    };
  }
};

// Function to save user progress data to localStorage
const saveUserProgress = (userProgress: any) => {
  try {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
};

export const saveChallengeSocialMedia = (data: any): void => {
  try {
    const userProgress = getUserProgress();
    
    if (!userProgress.challengeData['social-media-strategist']) {
      userProgress.challengeData['social-media-strategist'] = {};
    }
    
    userProgress.challengeData['social-media-strategist'] = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // If the challenge is complete, add it to completed challenges
    if (data.isComplete && !userProgress.completedChallenges.includes('social-media-strategist')) {
      userProgress.completedChallenges.push('social-media-strategist');
    }
    
    userProgress.lastActive = new Date().toISOString();
    saveUserProgress(userProgress);
  } catch (error) {
    console.error('Error saving social media challenge data:', error);
  }
};

export const saveChallengeSlidemaster = (
  challengeId: string,
  presentationTitle: string,
  theme: string,
  totalSlides: number,
  generatedImages: number
): void => {
  const userProgress = JSON.parse(localStorage.getItem('userProgress') || JSON.stringify(DEFAULT_USER_PROGRESS)) as UserProgress;
  
  if (!userProgress.challengeData[challengeId]) {
    userProgress.challengeData[challengeId] = {};
  }
  
  userProgress.challengeData[challengeId].slideMaster = {
    presentationTitle,
    theme,
    totalSlides,
    generatedImages,
    completedAt: new Date().toISOString()
  };
  
  // Add to completed challenges if not already there
  if (!userProgress.completedChallenges.includes(challengeId)) {
    userProgress.completedChallenges.push(challengeId);
  }
  
  userProgress.lastActive = new Date().toISOString();
  localStorage.setItem('userProgress', JSON.stringify(userProgress));
};

// Function to save Global Communicator challenge data
export const saveChallengeGlobalCommunicator = (translationData: any): void => {
  try {
    const userProgress = getUserProgress();
    const challengeId = 'challenge-14';
    
    // Initialize the global communicator data if it doesn't exist
    if (!userProgress.challengeData['global-communicator']) {
      userProgress.challengeData['global-communicator'] = {
        translations: []
      };
    }
    
    // Add the new translation to the array
    userProgress.challengeData['global-communicator'].translations = [
      translationData,
      ...userProgress.challengeData['global-communicator'].translations
    ].slice(0, 50); // Keep only the last 50 translations
    
    userProgress.challengeData['global-communicator'].lastUpdated = new Date().toISOString();
    
    // Add to completed challenges if not already there
    if (!userProgress.completedChallenges.includes(challengeId)) {
      userProgress.completedChallenges.push(challengeId);
    }
    
    userProgress.lastActive = new Date().toISOString();
    saveUserProgress(userProgress);
  } catch (error) {
    console.error('Error saving global communicator challenge data:', error);
  }
};

// Function to save Data Analyst challenge data
export const saveChallengeDataAnalyst = (
  challengeId: string,
  data: any
): void => {
  try {
    const userProgress = getUserProgress();
    
    if (!userProgress.challengeData[challengeId]) {
      userProgress.challengeData[challengeId] = {};
    }
    
    userProgress.challengeData[challengeId].dataAnalyst = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    userProgress.lastActive = new Date().toISOString();
    saveUserProgress(userProgress);
  } catch (error) {
    console.error('Error saving data analyst challenge data:', error);
  }
};

// Function to get Global Communicator translations
export const getChallengeGlobalCommunicator = (): any[] => {
  try {
    const userProgress = getUserProgress();
    
    if (
      userProgress.challengeData && 
      userProgress.challengeData['global-communicator'] && 
      userProgress.challengeData['global-communicator'].translations
    ) {
      return userProgress.challengeData['global-communicator'].translations;
    }
    
    return []; // Return empty array if no translations exist
  } catch (error) {
    console.error('Error getting global communicator challenge data:', error);
    return [];
  }
};

// Get challenge-specific data from local storage
export const getChallengeData = async (challengeId: string) => {
  try {
    const data = localStorage.getItem(`challenge_${challengeId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting ${challengeId} data:`, error);
    return null;
  }
};

// Save challenge-specific data to local storage
export const saveChallengeData = async (challengeId: string, data: any) => {
  try {
    localStorage.setItem(`challenge_${challengeId}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${challengeId} data:`, error);
    return false;
  }
};

// Custom event for challenge completion
export const CHALLENGE_COMPLETED_EVENT = 'challenge-completed';

// Interface for the challenge completion event
export interface ChallengeCompletedEvent {
  challengeId: string;
  completedAt: string;
}

/**
 * Map of challenge alias IDs to their standardized IDs from ChallengeHubNew.tsx
 * This helps maintain consistency between different naming conventions used throughout the app
 */
export const CHALLENGE_ID_MAP: Record<string, string> = {
  // Standard mapping based on ChallengeHubNew.tsx
  'challenge-dictation-wizard': 'challenge-1',
  'challenge-image-classifier': 'challenge-2',
  'challenge-face-id': 'challenge-3',
  'challenge-ocr': 'challenge-4',
  'challenge-creative-vision': 'challenge-5',
  'challenge-privacy-guardian': 'challenge-6',
  'challenge-voice-generator': 'challenge-7',
  'challenge-global-communicator': 'challenge-8',
  'challenge-object-detection': 'challenge-9',
  'challenge-emotional-insight': 'challenge-10',
  'challenge-smartselect': 'challenge-11',
  'challenge-social-media': 'challenge-12',
  'challenge-bizstrategist': 'challenge-13',
  'challenge-agent-magic': 'challenge-14',
  'challenge-slides-master': 'challenge-15',
  'challenge-hp-powerbi': 'challenge-16',
  'challenge-detective-league': 'challenge-17',
  'challenge-18': 'challenge-18', // Already using standard ID
  'challenge-object-tracking': 'challenge-19',
  'challenge-image-search': 'challenge-20',
  
  // Legacy IDs should still work
  'challenge-3': 'challenge-3' // Already standard
};

/**
 * Normalizes a challenge ID to its standard form as defined in ChallengeHubNew.tsx
 * @param id The challenge ID to normalize
 * @returns The standardized challenge ID
 */
export const normalizeChalllengeId = (id: string): string => {
  return CHALLENGE_ID_MAP[id] || id;
}

/**
 * Hook to standardize challenge completion handling across all challenge components
 * Use this with the ChallengeHeader component to ensure consistent behavior
 * 
 * @param challengeId The ID of the challenge (will be normalized)
 * @returns An object with state and handlers for challenge completion
 */
export const useChallengeStatus = (challengeId: string) => {
  const normalizedId = normalizeChalllengeId(challengeId);
  const [userProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Check if challenge is already completed on mount
  useEffect(() => {
    if (userProgress?.completedChallenges?.includes(normalizedId)) {
      setIsCompleted(true);
    }
  }, [normalizedId, userProgress]);

  // Handler for completing the challenge
  const handleCompleteChallenge = () => {
    markChallengeAsCompleted(normalizedId);
    setIsCompleted(true);
    setShowConfetti(true);
    
    // Auto-hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  return {
    isCompleted,
    setIsCompleted,
    showConfetti,
    setShowConfetti,
    handleCompleteChallenge,
    challengeId: normalizedId
  };
};

// Function to manually mark a challenge as completed
export const markChallengeAsCompleted = (challengeId: string): boolean => {
  try {
    // Normalize the challenge ID to ensure consistency
    const normalizedId = normalizeChalllengeId(challengeId);
    
    // Get current user progress from localStorage
    const savedProgress = localStorage.getItem('userProgress');
    let userProgress;
    if (savedProgress) {
      userProgress = JSON.parse(savedProgress);
    } else {
      userProgress = {
        completedChallenges: [],
        lastActive: new Date().toISOString(),
        preferences: {},
        challengeData: {}
      };
    }
    
    const wasAlreadyCompleted = userProgress.completedChallenges.includes(normalizedId);
    
    // Always add the challenge to completedChallenges, regardless of whether it was there before
    // This ensures challenges can be re-completed after being unchecked
    if (!wasAlreadyCompleted) {
      userProgress.completedChallenges.push(normalizedId);
      userProgress.lastActive = new Date().toISOString();
      
      // Save to 'userProgress'
      localStorage.setItem('userProgress', JSON.stringify(userProgress));
      
      // Update the leaderboard
      updateLeaderboard(calculateUserScore());
      
      console.log(`Challenge ${normalizedId} marked as completed`);
    } else {
      console.log(`Challenge ${normalizedId} was already completed`);
    }
    
    // Dispatch a global event to notify all components of the challenge completion
    // This allows any component to respond to the challenge completion
    const completedAt = new Date().toISOString();
    const event = new CustomEvent<ChallengeCompletedEvent>(CHALLENGE_COMPLETED_EVENT, {
      detail: {
        challengeId: normalizedId,
        completedAt
      },
      bubbles: true
    });
    document.dispatchEvent(event);
    
    return !wasAlreadyCompleted;
  } catch (error) {
    console.error('Error marking challenge as completed:', error);
    return false;
  }
}; 