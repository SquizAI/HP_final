import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUserProgress, markChallengeAsCompleted } from '../../utils/userDataManager'
import { CheckCircle, Award, XCircle, Book, Archive, GraduationCap } from 'lucide-react'

const Resources: React.FC = () => {
  // Get user progress from localStorage
  const [userProgress, setUserProgress] = useUserProgress();
  const [completionMessage, setCompletionMessage] = useState<{challengeId: string, message: string, isCompleted: boolean} | null>(null);
  
  // Additional challenges section
  const additionalChallenges = [
    {
      id: 'additional-challenge-1',
      challengeNumber: 1,
      title: 'AI Trend Spotter',
      description: "Discover tomorrow's trends today—before your competitors' crystal ball starts working!",
      icon: '🔮',
      color: '#5CB2CC',
      path: '/challenge/trendspotter'
    },
    {
      id: 'additional-challenge-2',
      challengeNumber: 2,
      title: 'AI Service Pro',
      description: "Turn IT headaches into high-fives with AI that actually understands your tech support woes.",
      icon: '🦸',
      color: '#FF7F50',
      path: '/challenge/servicepro'
    },
    {
      id: 'additional-challenge-3',
      challengeNumber: 3,
      title: 'AI Meeting Genius',
      description: "Make meetings so efficient, you'll actually look forward to them. (Yes, seriously!)",
      icon: '⏱️',
      color: '#5CB2CC',
      path: '/challenge/meetinggenius'
    },
    {
      id: 'additional-challenge-4',
      challengeNumber: 4,
      title: 'AI Brainstorm Buddy',
      description: "Generate brilliantly creative solutions to your toughest business challenges—faster than a room full of consultants!",
      icon: '💡',
      color: '#FF9800',
      path: '/challenge/brainstormbuddy'
    },
    {
      id: 'additional-challenge-5',
      challengeNumber: 5,
      title: 'AI Communication Coach',
      description: "Write emails so good they'll think you have a tiny Shakespeare in your keyboard.",
      icon: '✉️',
      color: '#FF7F50',
      path: '/challenge/communicationcoach'
    },
    {
      id: 'additional-challenge-6',
      challengeNumber: 6,
      title: 'AI Policy Decoder',
      description: "Turn corporate jargon into actual human language—no legal degree required!",
      icon: '🔍',
      color: '#0097A7',
      path: '/challenge/policydecoder'
    },
    {
      id: 'additional-challenge-7',
      challengeNumber: 7,
      title: 'AI Ad Creative Wizard',
      description: "Craft ads so engaging, people will voluntarily turn off their ad blockers. Magic!",
      icon: '✨',
      color: '#FF7F50',
      path: '/challenge/adcreative'
    },
    {
      id: 'additional-challenge-8',
      challengeNumber: 8,
      title: 'AI Content Transformer',
      description: "Transform plain content into engaging, interactive experiences that captivate your audience and leave a lasting impression.",
      icon: '✏️',
      color: '#8E44AD',
      path: '/challenge/content-transformer'
    },
    {
      id: 'additional-challenge-9',
      challengeNumber: 9,
      title: 'AI Visual Search Explorer',
      description: "Upload images and discover relevant search queries, information, and visual insights powered by Google's Gemini 2.0 Flash.",
      icon: '🔎',
      color: '#1E88E5',
      path: '/challenge/image-search'
    },
    {
      id: 'additional-challenge-10',
      challengeNumber: 10,
      title: 'AI Detective League',
      description: "Experience how AI agents collaborate, use specialized tools, and solve complex problems as a team.",
      icon: '🕵️‍♂️',
      color: '#5E35B1',
      path: '/challenge/detective-league'
    }
  ];

  // Check if a challenge is implemented
  const isImplemented = (challengeId: string) => {
    return [
      // Additional Challenges that are implemented
      'additional-challenge-1', 'additional-challenge-2', 'additional-challenge-4',
      'additional-challenge-8', 'additional-challenge-9', 'additional-challenge-10',
    ].includes(challengeId);
  };
  
  // Check if a challenge is completed
  const isCompleted = (challengeId: string) => {
    return userProgress.completedChallenges.includes(challengeId);
  };

  // Handle manual challenge completion
  const handleMarkAsCompleted = (challengeId: string, challengeName: string) => {
    // Skip the markChallengeAsCompleted function's return value check
    // This allows us to mark challenges as completed even if they were previously completed
    markChallengeAsCompleted(challengeId);
    
    // Force a refresh of user progress state
    setUserProgress({
      ...userProgress,
      completedChallenges: [...userProgress.completedChallenges.filter((id: string) => id !== challengeId), challengeId]
    });
    
    // Show success message
    setCompletionMessage({
      challengeId,
      message: `${challengeName} marked as completed!`,
      isCompleted: true
    });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setCompletionMessage(null);
    }, 3000);
  };

  // Handle unchecking a challenge
  const handleUncheckChallenge = (challengeId: string, challengeName: string) => {
    // Remove the challenge from completedChallenges
    const updatedChallenges = userProgress.completedChallenges.filter((id: string) => id !== challengeId);
    
    // Update userProgress in localStorage
    setUserProgress({
      ...userProgress,
      completedChallenges: updatedChallenges
    });
    
    // Show success message
    setCompletionMessage({
      challengeId,
      message: `${challengeName} marked as incomplete!`,
      isCompleted: false
    });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setCompletionMessage(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-sm">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#9C27B0] to-[#3F51B5]">
          Additional AI Resources
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Explore these supplementary AI challenges and tools to further expand your AI skills and knowledge.
          These challenges offer unique perspectives and specialized applications.
        </p>
      </div>
      
      <div className="flex flex-col">
        {/* Additional Challenges Section */}
        <section id="additional-challenges" className="flex-grow mb-12">
          <h2 className="mb-8 text-3xl font-bold text-center flex items-center justify-center">
            <Archive className="mr-3 text-[#9C27B0]" />
            <span className="text-gray-900">Additional </span> 
            <span className="text-[#9C27B0] ml-2">AI Challenges</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalChallenges.map((challenge) => (
              <div 
                key={challenge.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] border border-gray-100"
                style={{ borderTop: `4px solid ${challenge.color}` }}
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4 text-xl font-bold"
                      style={{ backgroundColor: challenge.color, color: 'white' }}
                    >
                      {challenge.challengeNumber}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        <span className="mr-2">{challenge.icon}</span>
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600">{challenge.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        {isCompleted(challenge.id) && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircle size={16} className="mr-1" /> Conquered!
                          </span>
                        )}
                        
                        {completionMessage && completionMessage.challengeId === challenge.id && (
                          <div className={`text-sm font-medium animate-pulse ${completionMessage.isCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                            {completionMessage.message}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {isImplemented(challenge.id) ? (
                          <>
                            <Link 
                              to={challenge.path}
                              className="px-5 py-2 bg-[#9C27B0] text-white rounded-lg text-sm font-medium hover:bg-[#7B1FA2] transition-all shadow-sm"
                            >
                              {isCompleted(challenge.id) ? "Play Again" : "Accept Challenge"}
                            </Link>
                          </>
                        ) : (
                          <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm italic flex items-center">
                            <span className="mr-1">🔜</span> Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Challenge Completion Controls */}
                    {isImplemented(challenge.id) && (
                      <div className="flex gap-2">
                        {!isCompleted(challenge.id) ? (
                          <button
                            onClick={() => handleMarkAsCompleted(challenge.id, challenge.title)}
                            className="w-full mt-2 px-4 py-2 border border-green-300 text-green-700 bg-green-50 rounded-lg text-sm font-medium hover:bg-green-100 transition-all flex items-center justify-center"
                          >
                            <Award size={16} className="mr-1" /> Mark as Completed
                          </button>
                        ) : (
                          <>
                            <div className="text-center text-sm text-green-800 mt-1 flex-1 flex items-center justify-center">
                              <Award size={16} className="mr-1" /> Challenge completed
                            </div>
                            <button
                              onClick={() => handleUncheckChallenge(challenge.id, challenge.title)}
                              className="mt-2 px-3 py-2 border border-yellow-300 text-yellow-700 bg-yellow-50 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-all flex items-center justify-center"
                              title="Uncheck this challenge"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-gray-50 p-8 rounded-xl text-center mb-16 shadow-inner">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
          <GraduationCap className="mr-2 text-[#9C27B0]" />
          Additional Learning Resources
        </h2>
        <p className="text-gray-700 mb-6">
          These challenges complement the core AI Challenge Hub, offering more specialized and experimental AI applications.
          Check back frequently as we continue to add new challenges and resources!
        </p>
        <Link to="/" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#9C27B0] hover:bg-[#7B1FA2]">
          Return to Challenge Hub
        </Link>
      </div>
    </div>
  )
}

export default Resources 