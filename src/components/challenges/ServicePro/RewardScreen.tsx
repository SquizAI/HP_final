import React from 'react'
import { Link } from 'react-router-dom'
import { ChallengeReward } from '../../../types'

interface RewardScreenProps {
  performanceScore: number
  reward: ChallengeReward
}

const RewardScreen: React.FC<RewardScreenProps> = ({ performanceScore, reward }) => {
  return (
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-3">🏆</div>
          <h3 className="text-lg font-semibold text-gray-800">Experience Points</h3>
          <div className="text-3xl font-bold text-primary-600 mt-2">+{reward.xp} XP</div>
          <p className="text-sm text-gray-600 mt-2">
            Added to your profile
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-semibold text-gray-800">New Ability</h3>
          <div className="text-xl font-medium text-primary-600 mt-2">Service Optimization</div>
          <p className="text-sm text-gray-600 mt-2">
            Unlocked in your skill tree
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-3">🧩</div>
          <h3 className="text-lg font-semibold text-gray-800">Building Block</h3>
          <div className="text-xl font-medium text-primary-600 mt-2">{reward.buildingBlock.name}</div>
          <p className="text-sm text-gray-600 mt-2">
            {reward.buildingBlock.description}
          </p>
        </div>
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
}

export default RewardScreen 