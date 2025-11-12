import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, CakeSlice, Cake, IceCream, Cookie, Sparkles } from 'lucide-react';

interface CategoryHeaderProps {
  categoryId?: string;
  categoryName?: string;
  description?: string;
  productCount?: number;
}

export const CategoryHeader = ({ 
  categoryId, 
  categoryName, 
  description, 
  productCount 
}: CategoryHeaderProps) => {
  // Category configuration with extended details
  const categoryConfig = {
    cupcakes: {
      icon: <CakeSlice className="text-white" size={32} />,
      gradient: "from-pink-400 via-cupcake-darkPink to-rose-600",
      pattern: "bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_50%)]",
      accentColor: "text-pink-200",
      emoji: "🧁"
    },
    cakes: {
      icon: <Cake className="text-white" size={32} />,
      gradient: "from-blue-400 via-cupcake-darkBlue to-indigo-600",
      pattern: "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]",
      accentColor: "text-blue-200",
      emoji: "🎂"
    },
    cakesicles: {
      icon: <IceCream className="text-white" size={32} />,
      gradient: "from-purple-400 via-purple-600 to-violet-700",
      pattern: "bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]",
      accentColor: "text-purple-200",
      emoji: "🍡"
    },
    'sweet-treats': {
      icon: <Cookie className="text-white" size={32} />,
      gradient: "from-amber-400 via-amber-600 to-orange-600",
      pattern: "bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15),transparent_50%)]",
      accentColor: "text-amber-200",
      emoji: "🍪"
    },
    default: {
      icon: <CakeSlice className="text-white" size={32} />,
      gradient: "from-cupcake-pink via-cupcake-darkPink to-rose-500",
      pattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]",
      accentColor: "text-pink-200",
      emoji: "🍰"
    }
  };

  const category = categoryId ? categoryConfig[categoryId] || categoryConfig.default : categoryConfig.default;

  // Format category name for display
  const displayName = categoryName || 
    (categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'All Categories');

  return (
    <div className={`relative bg-gradient-to-br ${category.gradient} overflow-hidden`}>
      {/* Animated background elements */}
      <div className={`absolute inset-0 ${category.pattern} animate-pulse-slow`} />
      
      {/* Floating decorative elements */}
      <div className="absolute top-4 left-10 opacity-20 animate-float">
        <Sparkles size={24} className={category.accentColor} />
      </div>
      <div className="absolute bottom-8 right-16 opacity-30 animate-float-delayed">
        <Sparkles size={20} className={category.accentColor} />
      </div>
      <div className="absolute top-12 right-20 opacity-25 animate-bounce-slow">
        <Sparkles size={16} className={category.accentColor} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 py-6">
          <Link 
            to="/"
            className="group inline-flex items-center text-white/80 hover:text-white transition-all duration-300 font-medium text-sm"
          >
            <ChevronLeft 
              size={18} 
              className="group-hover:-translate-x-1 transition-transform duration-300" 
            />
            <span className="ml-1">Home</span>
          </Link>
          <span className="text-white/40 mx-2">•</span>
          <span className="text-white font-medium text-sm">{displayName}</span>
        </nav>

        {/* Main Content */}
        <div className="py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-white/30">
                {category.icon}
                <span className="text-white font-semibold text-sm uppercase tracking-wide">
                  {categoryId || 'Category'}
                </span>
                <span className="text-xl">{category.emoji}</span>
              </div>

              {/* Title Section */}
              <div className="mb-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-pacifico text-white mb-3 leading-tight">
                  {displayName}
                </h1>
                
                {/* Product Count */}
                {productCount !== undefined && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    <span className="text-white/90 font-medium">
                      {productCount} {productCount === 1 ? 'product' : 'products'} available
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {description && (
                <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button 
                  onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Browse Products
                </button>
                
                <button 
                  onClick={() => document.getElementById('filters')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Filter & Sort
                </button>
              </div>
            </div>

            {/* Visual Element */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center animate-float">
                  {category.icon}
                </div>
                <div className="absolute -inset-4 bg-white/10 rounded-3xl -z-10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator for scroll */}
        <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-out"
            style={{ 
              width: `${Math.min((window.scrollY / 500) * 100, 100)}%` 
            }}
          />
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-white [mask-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI4cHgiIHZpZXdCb3g9IjAgMCAxMjAwIDgiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMEwxMjAwIDBMMTIwMCA0QzEwODAgNCAxMDAwIDggODAwIDhDNjAwIDggNTAwIDQgMzAwIDRDMTAwIDQgMCAwIDAgMFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]" />
    </div>
  );
};

// Add these CSS animations to your global CSS or tailwind config
const customAnimations = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(-8px) translateX(4px); }
  66% { transform: translateY(-4px) translateX(-4px); }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}
`;

export default CategoryHeader;