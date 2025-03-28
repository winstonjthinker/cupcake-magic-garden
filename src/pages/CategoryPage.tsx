
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnhancedProductCard from '@/components/EnhancedProductCard';
import { ChevronLeft, CakeSlice, Cake, IceCream, Cookie } from 'lucide-react';

// Sample data for each category
const categoryData = {
  cupcakes: {
    title: "Cupcakes",
    description: "Delicious handcrafted cupcakes for every occasion",
    icon: <CakeSlice className="text-cupcake-darkPink animate-bounce-light" size={28} />,
    color: "from-cupcake-pink to-cupcake-darkPink",
    products: [
      {
        id: 1,
        title: "Vanilla Delight",
        description: "Classic vanilla cupcake with buttercream frosting and rainbow sprinkles",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd"
      },
      {
        id: 2,
        title: "Chocolate Dream",
        description: "Rich chocolate cupcake with chocolate ganache and chocolate shavings",
        price: "$3.75",
        image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb"
      },
      {
        id: 3,
        title: "Strawberry Bliss",
        description: "Fresh strawberry cupcake with strawberry frosting and white chocolate drizzle",
        price: "$3.95",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e"
      },
      {
        id: 4,
        title: "Red Velvet",
        description: "Classic red velvet cupcake with cream cheese frosting and red velvet crumbs",
        price: "$4.25",
        image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7"
      },
      {
        id: 5,
        title: "Lemon Burst",
        description: "Tangy lemon cupcake with lemon curd filling and light lemon frosting",
        price: "$3.85",
        image: "https://images.unsplash.com/photo-1519869325930-281384150729"
      },
      {
        id: 6,
        title: "Birthday Surprise",
        description: "Funfetti cupcake with vanilla frosting and colorful sprinkles",
        price: "$4.00",
        image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d"
      },
    ]
  },
  cakes: {
    title: "Cakes",
    description: "Beautiful custom cakes for special celebrations",
    icon: <Cake className="text-cupcake-darkBlue animate-bounce-light" size={28} />,
    color: "from-cupcake-blue to-cupcake-darkBlue",
    products: [
      {
        id: 1,
        title: "Chocolate Ganache Cake",
        description: "Three-layer chocolate cake with rich ganache and fresh berries",
        price: "$45.00",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
      },
      {
        id: 2,
        title: "Vanilla Bean Celebration",
        description: "Elegant vanilla cake with buttercream frosting and edible flowers",
        price: "$42.00",
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636"
      },
      {
        id: 3,
        title: "Red Velvet Dream",
        description: "Classic red velvet cake with cream cheese frosting and chocolate drizzle",
        price: "$48.00",
        image: "https://images.unsplash.com/photo-1616541823729-00fe0aaed36c"
      },
      {
        id: 4,
        title: "Strawberry Shortcake",
        description: "Light vanilla sponge with fresh strawberries and whipped cream",
        price: "$40.00",
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5c3"
      },
      {
        id: 5,
        title: "Carrot Cake",
        description: "Moist carrot cake with walnuts and traditional cream cheese frosting",
        price: "$38.00",
        image: "https://images.unsplash.com/photo-1621303837158-877731acafc6"
      },
      {
        id: 6,
        title: "Lemon Blueberry",
        description: "Zesty lemon cake with blueberry compote and lemon buttercream",
        price: "$44.00",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad"
      },
    ]
  },
  cakesicles: {
    title: "Cakesicles",
    description: "Delicious cake pops on a stick! Perfect for $2.50 each or $2.00 each for orders of 20+",
    icon: <IceCream className="text-purple-700 animate-bounce-light" size={28} />,
    color: "from-purple-300 to-purple-700",
    products: [
      {
        id: 1,
        title: "Birthday Cakesicle",
        description: "Vanilla cake with colorful sprinkles and white chocolate coating",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1596223430183-9e318f2d05e3"
      },
      {
        id: 2,
        title: "Chocolate Drizzle",
        description: "Chocolate cake with milk chocolate coating and white chocolate drizzle",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1618426703623-c1b335803e07"
      },
      {
        id: 3,
        title: "Red Velvet",
        description: "Red velvet cake with white chocolate coating and red velvet crumbs",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1627308595171-d1b5d67129c5"
      },
      {
        id: 4,
        title: "Cookies & Cream",
        description: "Oreo cake with white chocolate coating and cookie crumbs",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1629385701021-fcd568a743e8"
      },
      {
        id: 5,
        title: "Strawberry Shortcake",
        description: "Strawberry cake with pink chocolate coating and white chocolate drizzle",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1551404973-7cea035e427e"
      },
      {
        id: 6,
        title: "Rainbow Sprinkle",
        description: "Vanilla cake with white chocolate coating and rainbow sprinkles",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1583255448430-17c5eda08e5c"
      },
    ]
  },
  "sweet-treats": {
    title: "Sweet Treats",
    description: "An assortment of cookies, brownies, and other sweet delights",
    icon: <Cookie className="text-amber-600 animate-bounce-light" size={28} />,
    color: "from-amber-300 to-amber-700",
    products: [
      {
        id: 1,
        title: "Chocolate Chip Cookies",
        description: "Classic chocolate chip cookies with walnuts",
        price: "$2.25",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e"
      },
      {
        id: 2,
        title: "Fudge Brownies",
        description: "Rich chocolate brownies with chocolate chips",
        price: "$3.00",
        image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7"
      },
      {
        id: 3,
        title: "Macarons",
        description: "Assorted flavors of French macarons",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43"
      },
      {
        id: 4,
        title: "Lemon Bars",
        description: "Tangy lemon filling on a buttery shortbread crust",
        price: "$2.75",
        image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c"
      },
      {
        id: 5,
        title: "Chocolate Truffles",
        description: "Handmade chocolate truffles in assorted flavors",
        price: "$1.50",
        image: "https://images.unsplash.com/photo-1548329408-c49d8c0b3e98"
      },
      {
        id: 6,
        title: "Cinnamon Rolls",
        description: "Freshly baked cinnamon rolls with cream cheese frosting",
        price: "$3.75",
        image: "https://images.unsplash.com/photo-1609150143086-7a777e2be0fc"
      },
    ]
  }
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const category = categoryId && categoryData[categoryId as keyof typeof categoryData];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Add some confetti effect on page load
    const confettiCount = 30;
    const colors = ['#FFD6E0', '#A5D8FF', '#FFC107', '#FF9FB5'];
    
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'absolute animate-confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-20px';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        
        // Set random animation duration and delay
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
          if (confettiContainer.contains(confetti)) {
            confettiContainer.removeChild(confetti);
          }
        }, 5000);
      }, i * 100);
    }
    
    // Cleanup
    return () => {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer);
      }
    };
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Category not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col page-enter page-enter-active">
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <div className={`bg-gradient-to-b ${category.color} py-12`}>
          <div className="container mx-auto px-4">
            <Link 
              to="/" 
              className="inline-flex items-center text-white mb-6 hover:translate-x-1 transition-transform duration-300"
            >
              <ChevronLeft size={20} />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              {category.icon}
              <h1 className="text-4xl md:text-5xl font-pacifico text-white">{category.title}</h1>
            </div>
            <p className="text-white/90 max-w-2xl text-lg">{category.description}</p>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.products.map((product, index) => (
              <EnhancedProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                description={product.description}
                price={product.price}
                delayAnimation={index}
              />
            ))}
          </div>
          
          {/* Bulk order notice for cakesicles */}
          {categoryId === 'cakesicles' && (
            <div className="mt-12 bg-purple-100 rounded-xl p-6 animate-pulse-slow">
              <h3 className="text-xl text-purple-800 font-semibold mb-2">Bulk Order Discount!</h3>
              <p className="text-purple-700">
                Order 20 or more cakesicles and pay only $2.00 each. Perfect for parties, events, and special celebrations!
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
