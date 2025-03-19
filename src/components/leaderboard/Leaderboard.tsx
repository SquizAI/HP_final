import React, { useState, useEffect } from 'react';
import { useLeaderboard, LeaderboardEntry, useUserPreferences, getUserId } from '../../utils/userDataManager';

interface LeaderboardProps {
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ className = '' }) => {
  const [leaderboard] = useLeaderboard();
  const [userPreferences] = useUserPreferences();
  const [userRank, setUserRank] = useState<number | null>(null);
  const userId = getUserId();

  useEffect(() => {
    // Find user's rank in the leaderboard
    const userIndex = leaderboard.findIndex(entry => entry.id === userId);
    setUserRank(userIndex >= 0 ? userIndex + 1 : null);
  }, [leaderboard, userId]);

  // Only show the leaderboard if the user has opted in
  if (!userPreferences.showLeaderboard) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h2 className="text-xl font-bold text-center mb-4">Leaderboard</h2>
        <p className="text-center text-gray-600">
          You've opted out of the leaderboard. Update your preferences to see how you rank!
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-bold text-center mb-4">Leaderboard</h2>
      
      {leaderboard.length === 0 ? (
        <p className="text-center text-gray-600">
          No entries yet! Complete some challenges to be the first on the leaderboard.
        </p>
      ) : (
        <>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {leaderboard.slice(0, 10).map((entry, index) => (
              <div 
                key={entry.id}
                className={`flex items-center p-3 rounded-lg ${
                  entry.id === userId 
                    ? 'bg-blue-50 border border-blue-200' 
                    : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#5CB2CC] to-[#0097A7] text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="font-medium text-gray-900">
                    {entry.username} {entry.id === userId && <span className="text-blue-500 text-sm">(You)</span>}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.completedChallenges} challenges completed
                  </div>
                </div>
                <div className="text-lg font-bold text-[#0097A7]">
                  {entry.score}
                </div>
              </div>
            ))}
          </div>
          
          {userRank && userRank > 10 && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#5CB2CC] to-[#0097A7] text-white flex items-center justify-center font-bold">
                  {userRank}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="font-medium text-gray-900">
                    {leaderboard.find(entry => entry.id === userId)?.username} <span className="text-blue-500 text-sm">(You)</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {leaderboard.find(entry => entry.id === userId)?.completedChallenges} challenges completed
                  </div>
                </div>
                <div className="text-lg font-bold text-[#0097A7]">
                  {leaderboard.find(entry => entry.id === userId)?.score}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      <div className="mt-6 border-t border-gray-200 pt-4 text-center">
        <div className="text-sm text-gray-500 mb-2">
          Complete more challenges to improve your rank!
        </div>
        <div className="text-xs text-gray-400">
          Scores based on challenges completed and variety.
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 