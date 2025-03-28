
import React, { useEffect, useRef } from 'react';
import { showConfetti } from "./confettiUtils";

const HeroSprinkles = () => {
  const sprinklesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sprinklesRef.current) return;
    
    // Create colorful sprinkles
    const colors = ['#A5D8FF', '#FFD6E0', '#FF9FB5', '#7CC3FF', '#FFC107', '#9C27B0'];
    const sprinkleCount = 30;
    
    for (let i = 0; i < sprinkleCount; i++) {
      const sprinkle = document.createElement('div');
      sprinkle.classList.add('cupcake-sprinkle');
      sprinkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      sprinkle.style.left = `${Math.random() * 100}%`;
      sprinkle.style.setProperty('--delay', `${Math.random() * 5}`);
      sprinklesRef.current.appendChild(sprinkle);
    }
    
    // Initial confetti shower on page load
    showConfetti();
  }, []);

  return <div ref={sprinklesRef} className="absolute inset-0 pointer-events-none"></div>;
};

export default HeroSprinkles;
