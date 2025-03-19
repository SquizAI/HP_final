import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  active: boolean; // Whether to show confetti
  duration?: number; // Duration in milliseconds
  particleCount?: number; // Number of particles
  spread?: number; // Spread of the confetti
  origin?: { x: number; y: number }; // Origin point (defaults to top center)
}

/**
 * A reusable confetti component that can be added to any component
 * to display a confetti effect when a challenge is completed.
 */
const Confetti: React.FC<ConfettiProps> = ({
  active,
  duration = 3000,
  particleCount = 100,
  spread = 70,
  origin = { x: 0.5, y: 0.1 }
}) => {
  useEffect(() => {
    if (active) {
      // Fire the confetti
      const myConfetti = confetti.create(undefined, { 
        resize: true,
        useWorker: true 
      });
      
      // Fire main burst
      myConfetti({
        particleCount,
        spread,
        origin,
        colors: ['#FF5733', '#33FF57', '#3380FF', '#FF33FF', '#FFFF33', '#33FFFF'],
        zIndex: 1000
      });

      // Fire a few more bursts over time
      const interval = setInterval(() => {
        myConfetti({
          particleCount: particleCount / 2,
          spread: spread - 10,
          origin: { ...origin, x: origin.x - 0.1 + Math.random() * 0.2 },
          colors: ['#FF5733', '#33FF57', '#3380FF', '#FF33FF', '#FFFF33', '#33FFFF'],
          zIndex: 1000
        });
      }, 750);

      // Clean up
      const timeout = setTimeout(() => {
        clearInterval(interval);
        myConfetti.reset();
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        myConfetti.reset();
      };
    }
  }, [active, duration, particleCount, spread, origin]);

  // This component doesn't render anything visually
  return null;
};

export default Confetti; 