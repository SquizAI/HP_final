import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import GlobalCommunicatorMain from './GlobalCommunicatorMain';
import GlobalCommunicatorLibrary from './GlobalCommunicatorLibrary';

/**
 * Wrapper component for the AI Global Communicator challenge
 * Provides routing between different views
 */
const GlobalCommunicatorWrapper: React.FC = () => {
  const location = useLocation();
  
  return (
    <Routes>
      <Route path="/" element={<GlobalCommunicatorMain />} />
      <Route path="/new" element={<GlobalCommunicatorMain />} />
      <Route path="/library" element={<GlobalCommunicatorLibrary />} />
      <Route path="/view/:id" element={<GlobalCommunicatorMain mode="view" />} />
      <Route path="*" element={<Navigate to="/challenge/global-communicator" replace />} />
    </Routes>
  );
};

export default GlobalCommunicatorWrapper; 