
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { 
  Instagram, 
  Home, 
  ShoppingBag, 
  BookOpen, 
  PhoneCall, 
  LogIn, 
  UserPlus, 
  ChevronDown 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-pacifico text-2xl md:text-3xl text-cupcake-darkPink transition-transform group-hover:scale-110 duration-300">LaKeisha's</span>
            <span className="font-pacifico text-2xl md:text-3xl text-cupcake-darkBlue transition-transform group-hover:scale-110 duration-300">Cupcakery</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1 transition-all duration-300 hover:scale-105">
              <Home size={18} className="animate-bounce-light" />
              <span>Home</span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1 transition-all duration-300 hover:scale-105">
                  <ShoppingBag size={18} className="animate-pulse-light" />
                  <span>Categories</span>
                  <ChevronDown size={16} className="ml-1 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border border-cupcake-pink/30 shadow-lg rounded-xl p-2 w-48 animate-in slide-in-from-top-5 fade-in-80 z-50">
                <DropdownMenuItem asChild className="rounded-lg hover:bg-cupcake-pink/10 cursor-pointer px-4 py-2.5 my-1 transition-all duration-300 hover:translate-x-1 focus:bg-cupcake-pink/10">
                  <Link to="/category/cupcakes" className="flex items-center gap-2 w-full">
                    <span className="text-cupcake-darkPink">Cupcakes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg hover:bg-cupcake-blue/10 cursor-pointer px-4 py-2.5 my-1 transition-all duration-300 hover:translate-x-1 focus:bg-cupcake-blue/10">
                  <Link to="/category/cakes" className="flex items-center gap-2 w-full">
                    <span className="text-cupcake-darkBlue">Cakes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg hover:bg-purple-100 cursor-pointer px-4 py-2.5 my-1 transition-all duration-300 hover:translate-x-1 focus:bg-purple-100">
                  <Link to="/category/cakesicles" className="flex items-center gap-2 w-full">
                    <span className="text-purple-700">Cakesicles</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-100 cursor-pointer px-4 py-2.5 my-1 transition-all duration-300 hover:translate-x-1 focus:bg-amber-100">
                  <Link to="/category/sweet-treats" className="flex items-center gap-2 w-full">
                    <span className="text-amber-600">Sweet Treats</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/blog" className="nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1 transition-all duration-300 hover:scale-105">
              <BookOpen size={18} />
              <span>Blog</span>
            </Link>
            
            <Link to="/contact" className="nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1 transition-all duration-300 hover:scale-105">
              <PhoneCall size={18} />
              <span>Contact</span>
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden md:flex text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10 transition-all duration-300 hover:scale-105">
              <Link to="/login">
                <LogIn size={18} className="mr-1" /> Login
              </Link>
            </Button>
            <Button variant="ghost" asChild className="hidden md:flex text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10 transition-all duration-300 hover:scale-105">
              <Link to="/register">
                <UserPlus size={18} className="mr-1" /> Create Account
              </Link>
            </Button>
            <Button asChild className="bg-cupcake-blue hover:bg-cupcake-darkBlue transition-all duration-300 hover:scale-105 animate-pulse-slow">
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                Order Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
