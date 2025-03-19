import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  className?: string;
}

/**
 * A reusable back button component that navigates to the home page.
 * Can be customized with different labels and additional CSS classes.
 */
const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back to Challenges',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center text-gray-700 hover:text-indigo-600 transition-colors ${className}`}
      aria-label="Back to home page"
    >
      <ArrowLeft className="h-5 w-5 mr-1" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton; 