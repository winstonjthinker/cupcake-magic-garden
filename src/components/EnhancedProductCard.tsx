
import React, { useState, memo } from 'react';
import { Instagram, Send, Heart } from 'lucide-react';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  delayAnimation?: number;
}

const EnhancedProductCard = ({ 
  image, 
  title, 
  description, 
  price, 
  delayAnimation = 0 
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl animate-fade-in animate-jelly-bounce" 
      style={{ animationDelay: `${delayAnimation * 0.1}s` }}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-sm text-cupcake-darkPink px-3 py-1 rounded-full font-bold shadow-md border border-cupcake-pink animate-pulse-light transition-transform duration-300 hover:scale-110 hover:rotate-3">
            {price}
          </div>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md border transition-all duration-300 hover:scale-110 ${isLiked ? 'border-cupcake-darkPink text-cupcake-darkPink' : 'border-gray-200 text-gray-500'}`}
          >
            <Heart 
              size={18} 
              className={isLiked ? 'fill-cupcake-darkPink animate-bounce-light' : ''}
            />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 transition-all duration-300 group-hover:text-cupcake-darkPink">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <div className="flex gap-2">
          <a 
            href="https://wa.me/1234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-btn flex-1 flex justify-center items-center gap-2 bg-cupcake-green text-white py-2 rounded-lg font-medium group-hover:animate-pulse-slow"
          >
            <Send size={18} className="transition-transform duration-300 group-hover:translate-x-1" /> Order
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="instagram-btn flex justify-center items-center gap-2 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] text-white py-2 px-4 rounded-lg font-medium hover:animate-pulse"
          >
            <Instagram size={18} className="transition-transform duration-300 hover:rotate-15" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default memo(EnhancedProductCard);
