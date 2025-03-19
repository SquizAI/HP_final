import React from 'react';

interface AIAssistButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
  tooltip?: string;
  buttonStyle?: 'minimal' | 'standard' | 'prominent';
  disabled?: boolean;
}

/**
 * A reusable AI assistance button component that can be placed inside or near text fields
 * to provide consistent AI help UI across the application.
 */
const AIAssistButton: React.FC<AIAssistButtonProps> = ({
  onClick,
  className = '',
  label = 'AI Assist',
  tooltip = 'Get AI assistance',
  buttonStyle = 'standard',
  disabled = false
}) => {
  // More pronounced and visually appealing styles
  const styleClasses = {
    minimal: 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-all duration-200',
    standard: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-md shadow-sm hover:shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center transform hover:translate-y-[-1px]',
    prominent: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center transform hover:scale-[1.02] font-medium'
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styleClasses[buttonStyle]} ${className} ${disabled ? 'opacity-60 cursor-not-allowed filter grayscale' : ''}`}
      title={tooltip}
      disabled={disabled}
    >
      <span className="flex items-center">
        <span className="mr-2 text-yellow-300">✨</span>
        <span className={buttonStyle === 'minimal' ? 'text-xs' : ''}>{label}</span>
      </span>
    </button>
  );
};

export default AIAssistButton; 