import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle, Info } from 'lucide-react';
import { markChallengeAsCompleted } from '../../utils/userDataManager';
import Confetti from './Confetti';

interface ChallengeHeaderProps {
  title: string;
  icon?: React.ReactNode;
  challengeId: string;
  isCompleted: boolean;
  setIsCompleted: (completed: boolean) => void;
  showConfetti?: boolean;
  setShowConfetti?: (show: boolean) => void;
  onCompleteChallenge?: () => void;
  isHPChallenge?: boolean; // To differentiate HP challenges from regular ones
}

/**
 * A standardized header component for all challenge pages.
 * Includes consistent navigation buttons and completion functionality.
 */
const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({
  title,
  icon,
  challengeId,
  isCompleted,
  setIsCompleted,
  showConfetti,
  setShowConfetti,
  onCompleteChallenge,
  isHPChallenge = false
}) => {
  const navigate = useNavigate();
  const [showBackTooltip, setShowBackTooltip] = useState(false);
  const [showCompleteTooltip, setShowCompleteTooltip] = useState(false);
  
  // Listen for mobile navigation completion event
  useEffect(() => {
    const handleMobileComplete = (e: Event) => {
      // Trigger the same completion logic as the desktop button
      if (onCompleteChallenge) {
        onCompleteChallenge();
      } else {
        markChallengeAsCompleted(challengeId);
        setIsCompleted(true);
        
        if (setShowConfetti) {
          setShowConfetti(true);
          
          setTimeout(() => {
            if (setShowConfetti) {
              setShowConfetti(false);
            }
          }, 5000);
        }
      }
    };

    // Add event listener
    document.addEventListener('challenge-complete-mobile', handleMobileComplete);
    
    // Clean up
    return () => {
      document.removeEventListener('challenge-complete-mobile', handleMobileComplete);
    };
  }, [challengeId, onCompleteChallenge, setIsCompleted, setShowConfetti]);
  
  // Colors for different challenge types
  const baseColors = isHPChallenge 
    ? {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-blue-100 text-blue-800',
        highlight: 'bg-blue-50 hover:bg-blue-100',
        completeButton: 'bg-blue-600 hover:bg-blue-700 text-white'
      }
    : {
        primary: 'bg-green-600 hover:bg-green-700 text-white',
        secondary: 'bg-green-100 text-green-800',
        highlight: 'bg-gray-100 hover:bg-gray-200',
        completeButton: 'bg-green-600 hover:bg-green-700 text-white'
      };

  const handleBack = () => {
    navigate('/');
  };

  const handleCompleteAndReturn = () => {
    if (onCompleteChallenge) {
      onCompleteChallenge();
      return;
    }
    
    markChallengeAsCompleted(challengeId);
    setIsCompleted(true);
    
    if (setShowConfetti) {
      setShowConfetti(true);
      
      setTimeout(() => {
        if (setShowConfetti) {
          setShowConfetti(false);
        }
      }, 5000);
    }
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <>
      {showConfetti !== undefined && setShowConfetti !== undefined && (
        <Confetti active={showConfetti} />
      )}
      
      <div className={`bg-white shadow-md py-3 px-4 mb-6 rounded-lg sticky top-0 z-50 ${isHPChallenge ? 'border-l-4 border-blue-500' : ''}`}>
        <div className="flex justify-between items-center">
          <div className="relative hidden md:block">
            <button
              onClick={handleBack}
              className={`flex items-center px-4 py-2 ${baseColors.highlight} text-gray-800 rounded-lg transition-colors`}
              aria-label="Back to challenges"
              onMouseEnter={() => setShowBackTooltip(true)}
              onMouseLeave={() => setShowBackTooltip(false)}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Challenges</span>
            </button>
            
            {showBackTooltip && (
              <div className="absolute left-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-64">
                Return to the challenge hub without saving progress
                <div className="absolute left-4 top-full h-2 w-2 bg-gray-800 transform rotate-45"></div>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          
          {isCompleted ? (
            <div 
              className={`flex items-center px-4 py-2 ${baseColors.secondary} rounded-lg hidden md:flex cursor-pointer hover:bg-green-200`}
              onClick={() => navigate('/challenges')}
              data-component-name="ChallengeHeader"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Challenge Completed!</span>
            </div>
          ) : (
            <div className="relative hidden md:block">
              <button
                onClick={handleCompleteAndReturn}
                className={`flex items-center px-4 py-2 ${baseColors.completeButton} rounded-lg shadow-sm transition-colors`}
                aria-label="Complete challenge and return"
                onMouseEnter={() => setShowCompleteTooltip(true)}
                onMouseLeave={() => setShowCompleteTooltip(false)}
              >
                <Award className="h-5 w-5 mr-2" />
                <span className="font-medium">Complete & Return</span>
              </button>
              
              {showCompleteTooltip && (
                <div className="absolute right-0 bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-64">
                  Mark this challenge as completed and return to the hub
                  <div className="absolute right-4 top-full h-2 w-2 bg-gray-800 transform rotate-45"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChallengeHeader; 