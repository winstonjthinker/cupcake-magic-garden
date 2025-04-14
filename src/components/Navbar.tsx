
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
  Menu,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const menuItems = [
    { to: "/", icon: <Home size={18} />, label: "Home" },
    { to: "/category/cupcakes", icon: <ShoppingBag size={18} />, label: "Cupcakes" },
    { to: "/category/cakes", icon: <ShoppingBag size={18} />, label: "Cakes" },
    { to: "/category/cakesicles", icon: <ShoppingBag size={18} />, label: "Cakesicles" },
    { to: "/category/sweet-treats", icon: <ShoppingBag size={18} />, label: "Sweet Treats" },
    { to: "/blog", icon: <BookOpen size={18} />, label: "Blog" },
    { to: "/contact", icon: <PhoneCall size={18} />, label: "Contact" },
    { to: "/login", icon: <LogIn size={18} />, label: "Login" },
    { to: "/register", icon: <UserPlus size={18} />, label: "Create Account" }
  ];

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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.slice(0, 7).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1 transition-all duration-300 hover:scale-105"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="flex items-center gap-2">
              {menuItems.slice(7).map((item) => (
                <Button
                  key={item.to}
                  variant="ghost"
                  asChild
                  className="text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10"
                >
                  <Link to={item.to}>
                    {item.icon}
                    <span className="ml-1">{item.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-white">
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <Link
                      to={item.to}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10 rounded-lg transition-all duration-300"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
