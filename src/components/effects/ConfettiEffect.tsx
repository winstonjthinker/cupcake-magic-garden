
import React, { useEffect } from 'react';

interface ConfettiEffectProps {
  colors?: string[];
  count?: number;
}

const ConfettiEffect = ({ 
  colors = ['#FFD6E0', '#A5D8FF', '#FFC107', '#FF9FB5'], 
  count = 30 
}: ConfettiEffectProps) => {
  useEffect(() => {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'absolute animate-confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-20px';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        
        // Set random animation duration and delay
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
          if (confettiContainer.contains(confetti)) {
            confettiContainer.removeChild(confetti);
          }
        }, 5000);
      }, i * 100);
    }
    
    // Cleanup
    return () => {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer);
      }
    };
  }, [count, colors]);

  return null; // This component doesn't render anything visible
};

export default ConfettiEffect;
