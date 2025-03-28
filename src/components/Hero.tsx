
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Send, ChevronDown } from 'lucide-react';

const Hero = () => {
  const sprinklesRef = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);
  
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
  
  const showConfetti = () => {
    const confettiCount = 100;
    const colors = ['#FFD6E0', '#A5D8FF', '#FFC107', '#FF9FB5'];
    
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'absolute';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-5vh';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.zIndex = '9999';
        
        // Set animation
        confetti.style.position = 'absolute';
        confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
          if (confettiContainer.contains(confetti)) {
            confettiContainer.removeChild(confetti);
          }
        }, 5000);
      }, i * 20);
    }
    
    // Remove container after all confetti are gone
    setTimeout(() => {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer);
      }
    }, 7000);
  };
  
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
      <div ref={sprinklesRef} className="absolute inset-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span 
                className="block font-pacifico text-cupcake-darkPink mb-2 hover:scale-105 transition-transform duration-300 cursor-pointer animate-bounce-light" 
                onClick={handleLogoClick}
              >
                LaKeisha's
              </span>
              <span className="text-cupcake-darkBlue animate-fade-in">Cupcakery</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 font-pacifico animate-pulse-light">
              Made with Love, Baked to Perfection
            </p>
            <p className="text-gray-600 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Indulge in our handcrafted, delicious cupcakes and cakes that will sweeten any occasion. 
              From classic flavors to unique creations, we bake happiness into every bite.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <Button className="whatsapp-btn bg-cupcake-green hover:bg-cupcake-green/90 text-white px-6 py-6 rounded-full shadow-lg animate-pulse-slow">
                  <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" /> Order Now
                </Button>
              </a>
              <Button 
                variant="outline" 
                className="border-cupcake-blue text-cupcake-darkBlue hover:bg-cupcake-blue/10 px-6 py-6 rounded-full hover:scale-105 transition-transform duration-300"
                onClick={scrollToCategories}
              >
                Explore Menu
              </Button>
            </div>
            
            <div className="mt-12 hidden md:block animate-bounce">
              <button 
                onClick={scrollToCategories}
                className="inline-flex items-center text-cupcake-darkBlue opacity-70 hover:opacity-100 transition-opacity"
              >
                <span className="mr-2">Scroll to explore</span>
                <ChevronDown className="animate-bounce" />
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-cupcake-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cupcake-blue rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '1s' }}></div>
              
              {/* Hero image */}
              <div className="relative z-10 animate-float hover:scale-105 transition-transform duration-500 transform-gpu">
                <img 
                  src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Delicious Cupcakes" 
                  className="rounded-2xl shadow-2xl max-w-full h-auto hover:shadow-cupcake-pink/50 transition-shadow duration-300"
                />
                
                {/* Steam effect */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                  <div className="steam-particle"></div>
                  <div className="steam-particle" style={{ animationDelay: '0.3s' }}></div>
                  <div className="steam-particle" style={{ animationDelay: '0.6s' }}></div>
                </div>
              </div>
              
              {/* Floating cupcake elements */}
              <div className="absolute top-1/4 -right-12 z-20 animate-float hover:scale-125 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>
                <div className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                    alt="Cupcake" 
                    className="w-16 h-16 rounded-full object-cover animate-jelly-bounce"
                  />
                </div>
              </div>
              
              <div className="absolute bottom-1/4 -left-8 z-20 animate-float hover:scale-125 transition-transform duration-300" style={{ animationDelay: '1.5s' }}>
                <div className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                    alt="Cake" 
                    className="w-16 h-16 rounded-full object-cover animate-jelly-bounce"
                  />
                </div>
              </div>
              
              {/* Floating hearts animation */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="heart-particle" style={{ left: '20%', animationDelay: '0s' }}>❤️</div>
                <div className="heart-particle" style={{ left: '70%', animationDelay: '1.5s' }}>❤️</div>
                <div className="heart-particle" style={{ left: '40%', animationDelay: '3s' }}>❤️</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS for the steam effect and heart particles */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default Hero;
