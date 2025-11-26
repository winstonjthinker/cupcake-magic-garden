
import React from 'react';
import { Instagram, Send } from 'lucide-react';

interface ProductCardProps {
  id: string | number;
  imageUrl: string;
  name: string;
  description: string;
  price: string;
}

const ProductCard = ({ id, imageUrl, name, description, price }: ProductCardProps) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm text-cupcake-darkPink px-3 py-1 rounded-full font-bold shadow-md border border-cupcake-pink animate-pulse-light">
            {price}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <div className="flex gap-2">
          <a 
            href="https://wa.me/1234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-btn flex-1 flex justify-center items-center gap-2 bg-cupcake-green text-white py-2 rounded-lg font-medium"
          >
            <Send size={18} /> Order
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="instagram-btn flex justify-center items-center gap-2 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] text-white py-2 px-4 rounded-lg font-medium"
          >
            <Instagram size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
