import React, { useState } from 'react';
import { useUserPreferences, clearUserData } from '../../utils/userDataManager';

interface UserSettingsProps {
  className?: string;
  onClose?: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ className = '', onClose }) => {
  const [preferences, setPreferences] = useUserPreferences();
  const [username, setUsername] = useState(preferences.username);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleShowLeaderboardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({
      ...preferences,
      showLeaderboard: e.target.checked
    });
  };

  const handleDarkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({
      ...preferences,
      darkMode: e.target.checked
    });
  };

  const handleSaveSettings = () => {
    setPreferences({
      ...preferences,
      username: username.trim() || `User_${Math.floor(Math.random() * 10000)}`
    });
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (!showConfirmReset) {
      setShowConfirmReset(true);
      return;
    }
    
    clearUserData();
    setResetSuccess(true);
    setShowConfirmReset(false);
    
    // Reset to default values
    setUsername(`User_${Math.floor(Math.random() * 10000)}`);
    setPreferences({
      showLeaderboard: true,
      darkMode: false,
      username: `User_${Math.floor(Math.random() * 10000)}`
    });
    
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Settings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="username"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5CB2CC]"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your display name"
          />
          <p className="mt-1 text-xs text-gray-500">
            This name will appear on the leaderboard.
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="showLeaderboard" className="font-medium text-gray-700">
              Show on Leaderboard
            </label>
            <p className="text-xs text-gray-500">
              Allow your progress to be displayed on the leaderboard.
            </p>
          </div>
          <div className="relative inline-block w-12 mr-2 align-middle select-none">
            <input
              type="checkbox"
              id="showLeaderboard"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              checked={preferences.showLeaderboard}
              onChange={handleShowLeaderboardChange}
            />
            <label
              htmlFor="showLeaderboard"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                preferences.showLeaderboard ? 'bg-[#5CB2CC]' : 'bg-gray-300'
              }`}
            ></label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="darkMode" className="font-medium text-gray-700">
              Dark Mode
            </label>
            <p className="text-xs text-gray-500">
              Switch to a darker theme (coming soon).
            </p>
          </div>
          <div className="relative inline-block w-12 mr-2 align-middle select-none opacity-50">
            <input
              type="checkbox"
              id="darkMode"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              checked={preferences.darkMode}
              onChange={handleDarkModeChange}
              disabled
            />
            <label
              htmlFor="darkMode"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                preferences.darkMode ? 'bg-[#5CB2CC]' : 'bg-gray-300'
              }`}
            ></label>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSaveSettings}
            className="w-full py-2 px-4 bg-[#5CB2CC] text-white font-medium rounded-md hover:bg-[#4A90E2] transition-colors mb-3"
          >
            Save Settings
          </button>
          
          <button
            onClick={handleResetData}
            className={`w-full py-2 px-4 font-medium rounded-md transition-colors ${
              showConfirmReset 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showConfirmReset ? 'Confirm Reset' : 'Reset Progress & Settings'}
          </button>
        </div>
        
        {saveSuccess && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-center text-sm">
            Settings saved successfully!
          </div>
        )}
        
        {resetSuccess && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-center text-sm">
            All data has been reset.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings; 