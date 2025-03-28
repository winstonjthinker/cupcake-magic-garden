
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

const Hero = () => {
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
  }, []);

  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      {/* Sprinkles animation container */}
      <div ref={sprinklesRef} className="absolute inset-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="block font-pacifico text-cupcake-darkPink mb-2">LaKeisha's</span>
              <span className="text-cupcake-darkBlue">Cupcakery</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 font-pacifico">
              Made with Love, Baked to Perfection
            </p>
            <p className="text-gray-600 mb-8 max-w-lg">
              Indulge in our handcrafted, delicious cupcakes and cakes that will sweeten any occasion. 
              From classic flavors to unique creations, we bake happiness into every bite.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <Button className="whatsapp-btn bg-cupcake-green hover:bg-cupcake-green/90 text-white px-6 py-6 rounded-full shadow-lg">
                  <Send className="mr-2 h-5 w-5" /> Order Now
                </Button>
              </a>
              <Button variant="outline" className="border-cupcake-blue text-cupcake-darkBlue hover:bg-cupcake-blue/10 px-6 py-6 rounded-full">
                Explore Menu
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-cupcake-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cupcake-blue rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '1s' }}></div>
              
              {/* Hero image */}
              <div className="relative z-10 animate-bounce-light">
                <img 
                  src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Delicious Cupcakes" 
                  className="rounded-2xl shadow-2xl max-w-full h-auto"
                />
              </div>
              
              {/* Floating cupcake elements */}
              <div className="absolute top-1/4 -right-12 z-20 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="bg-white p-3 rounded-full shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                    alt="Cupcake" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              </div>
              
              <div className="absolute bottom-1/4 -left-8 z-20 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="bg-white p-3 rounded-full shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                    alt="Cake" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
