
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Send, ChevronDown } from 'lucide-react';
import HeroSprinkles from "./hero/HeroSprinkles";
import HeroContent from "./hero/HeroContent";
import HeroImage from "./hero/HeroImage";
import { showConfetti } from "./hero/confettiUtils";

const Hero = () => {
  const [clickCount, setClickCount] = useState(0);
  
  // Easter egg: clicking logo 5x makes a cupcake dance
  const handleLogoClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        showEasterEgg();
        return 0; // Reset count
      }
      return newCount;
    });
  };
  
  const showEasterEgg = () => {
    const easterEgg = document.createElement('div');
    easterEgg.innerHTML = '🧁';
    easterEgg.className = 'fixed z-50 text-7xl';
    easterEgg.style.left = '50%';
    easterEgg.style.top = '50%';
    easterEgg.style.transform = 'translate(-50%, -50%)';
    easterEgg.style.animation = 'dance 2s ease-in-out';
    document.body.appendChild(easterEgg);
    
    // Create dance animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes dance {
        0%, 100% { transform: translate(-50%, -50%) rotate(0); font-size: 5rem; }
        25% { transform: translate(-50%, -50%) rotate(-15deg) scale(1.5); font-size: 7rem; }
        50% { transform: translate(-50%, -50%) rotate(0) scale(2); font-size: 8rem; }
        75% { transform: translate(-50%, -50%) rotate(15deg) scale(1.5); font-size: 7rem; }
      }
    `;
    document.head.appendChild(style);
    
    // Show confetti shower
    showConfetti();
    
    // Remove after animation
    setTimeout(() => {
      document.body.removeChild(easterEgg);
      document.head.removeChild(style);
    }, 2000);
  };
  
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      {/* Sprinkles animation container */}
      <HeroSprinkles />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <HeroContent 
            handleLogoClick={handleLogoClick} 
            scrollToCategories={scrollToCategories} 
          />
          <HeroImage />
        </div>
      </div>
      
      {/* Add CSS for the steam effect and heart particles */}
      <style>
        {`
        @keyframes steam {
          0% { transform: translateY(0) translateX(-50%) scale(1); opacity: 0.3; }
          100% { transform: translateY(-15px) translateX(-50%) scale(1.5); opacity: 0; }
        }
        
        .steam-particle {
          position: absolute;
          left: 50%;
          bottom: 0;
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background-color: #fff;
          opacity: 0;
          animation: steam 2s ease-out infinite;
        }
        
        @keyframes float-heart {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
        }
        
        .heart-particle {
          position: absolute;
          bottom: 40%;
          font-size: 1.5rem;
          opacity: 0;
          animation: float-heart 3s ease-out infinite;
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        `}
      </style>
    </div>
  );
};

export default Hero;
