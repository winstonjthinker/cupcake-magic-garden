
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, CakeSlice, Cake, IceCream, Cookie } from 'lucide-react';

interface CategoryHeaderProps {
  categoryId?: string;
  categoryName?: string;
  description?: string;
}

export const CategoryHeader = ({ categoryId, categoryName, description }: CategoryHeaderProps) => {
  // Determine which icon to show based on category
  const getCategoryIcon = () => {
    if (!categoryId) return <CakeSlice className="text-cupcake-darkPink animate-bounce-light" size={28} />;
    
    switch(categoryId) {
      case 'cupcakes':
        return <CakeSlice className="text-cupcake-darkPink animate-bounce-light" size={28} />;
      case 'cakes':
        return <Cake className="text-cupcake-darkBlue animate-bounce-light" size={28} />;
      case 'cakesicles':
        return <IceCream className="text-purple-700 animate-bounce-light" size={28} />;
      case 'sweet-treats':
        return <Cookie className="text-amber-600 animate-bounce-light" size={28} />;
      default:
        return <CakeSlice className="text-cupcake-darkPink animate-bounce-light" size={28} />;
    }
  };
  
  // Determine gradient color based on category
  const getCategoryColor = () => {
    if (!categoryId) return "from-cupcake-pink to-cupcake-darkPink";
    
    switch(categoryId) {
      case 'cupcakes':
        return "from-cupcake-pink to-cupcake-darkPink";
      case 'cakes':
        return "from-cupcake-blue to-cupcake-darkBlue";
      case 'cakesicles':
        return "from-purple-300 to-purple-700";
      case 'sweet-treats':
        return "from-amber-300 to-amber-700";
      default:
        return "from-cupcake-pink to-cupcake-darkPink";
    }
  };

  return (
    <div className={`bg-gradient-to-b ${getCategoryColor()} py-12`}>
      <div className="container mx-auto px-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-white mb-6 hover:translate-x-1 transition-transform duration-300"
        >
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          {getCategoryIcon()}
          <h1 className="text-4xl md:text-5xl font-pacifico text-white">{categoryName || categoryId}</h1>
        </div>
        <p className="text-white/90 max-w-2xl text-lg">{description || ""}</p>
      </div>
    </div>
  );
};

export default CategoryHeader;
