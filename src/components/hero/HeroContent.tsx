
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, ChevronDown } from 'lucide-react';

interface HeroContentProps {
  handleLogoClick: () => void;
  scrollToCategories: () => void;
}

const HeroContent = ({ handleLogoClick, scrollToCategories }: HeroContentProps) => {
  return (
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
  );
};

export default HeroContent;
