
import React from 'react';

const HeroImage = () => {
  return (
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
  );
};

export default HeroImage;
