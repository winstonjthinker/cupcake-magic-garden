
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Instagram, Home, ShoppingBag, BookOpen, PhoneCall, LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
        scrolled 
          ? "bg-white/90 backdrop-blur-sm shadow-md py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-pacifico text-2xl md:text-3xl text-cupcake-darkPink">LaKeisha's</span>
            <span className="font-pacifico text-2xl md:text-3xl text-cupcake-darkBlue">Cupcakery</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1">
              <Home size={18} />
              <span>Home</span>
            </a>
            <a href="#categories" className="nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1">
              <ShoppingBag size={18} />
              <span>Categories</span>
            </a>
            <a href="#blog" className="nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1">
              <BookOpen size={18} />
              <span>Blog</span>
            </a>
            <a href="#contact" className="nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1">
              <PhoneCall size={18} />
              <span>Contact</span>
            </a>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden md:flex text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10">
              <LogIn size={18} className="mr-1" /> Login
            </Button>
            <Button variant="ghost" className="hidden md:flex text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10">
              <UserPlus size={18} className="mr-1" /> Create Account
            </Button>
            <Button className="bg-cupcake-blue hover:bg-cupcake-darkBlue transition-colors">
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
