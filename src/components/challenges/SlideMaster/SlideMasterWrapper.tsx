import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SlidesMasterMain from './SlidesMasterMain';
import PresentationLibrary from './PresentationLibrary';

/**
 * Wrapper component for the SlideMaster challenge
 * Provides routing between different views
 */
const SlideMasterWrapper: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Routes>
        <Route path="/" element={<SlidesMasterMain />} />
        <Route path="/new" element={<SlidesMasterMain />} />
        <Route path="/library" element={<PresentationLibrary />} />
        <Route path="*" element={<Navigate to="/challenges/slide-master" replace />} />
      </Routes>
    </div>
  );
};

export default SlideMasterWrapper; 