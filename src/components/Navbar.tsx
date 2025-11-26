import React, { useState, useEffect, useMemo } from 'react';
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
  X,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Helper function to get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.first_name?.[0] || '';
    const lastInitial = user.last_name?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active link checker
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Memoized menu items for better performance
  const menuItems = useMemo(() => [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/category/cupcakes", icon: <ShoppingBag size={20} />, label: "Cupcakes" },
    { to: "/category/cakes", icon: <ShoppingBag size={20} />, label: "Cakes" },
    { to: "/category/cakesicles", icon: <ShoppingBag size={20} />, label: "Cakesicles" },
    { to: "/category/sweet-treats", icon: <ShoppingBag size={20} />, label: "Sweet Treats" },
    { to: "/blog", icon: <BookOpen size={20} />, label: "Blog" },
    { to: "/contact", icon: <PhoneCall size={20} />, label: "Contact Us" },
    { to: "/login", icon: <LogIn size={20} />, label: "Login" },
    { to: "/register", icon: <UserPlus size={20} />, label: "Create Account" }
  ], []);

  const regularItems = menuItems.slice(0, 7);
  const authItems = menuItems.slice(7);

  const handleNavigation = () => {
    setIsLoading(true);
    setSheetOpen(false);
    // Simulate loading completion
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cupcake-darkPink"></div>
        </div>
      )}

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 md:px-6",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
            : "bg-white/90 backdrop-blur-sm py-3 md:py-4"
        )}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cupcake-darkPink text-white p-3 rounded-md z-50 text-sm font-medium"
        >
          Skip to main content
        </a>

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo - Optimized for mobile */}
            <Link
              to="/"
              className="flex items-center gap-2 group min-w-0 flex-shrink"
              onClick={handleNavigation}
            >
            </Link>

            {/* Desktop Navigation - Optimized spacing */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center">
              {regularItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleNavigation}
                  className={cn(
                    "nav-link text-gray-700 hover:text-cupcake-darkBlue flex items-center gap-1.5 transition-all duration-300 hover:scale-105 px-2 py-1 rounded-md",
                    isActiveLink(item.to) && "text-cupcake-darkBlue font-semibold bg-cupcake-blue/10"
                  )}
                >
                  {item.icon}
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons / User Menu */}
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 min-w-0">
              {isAuthenticated ? (
                // Authenticated: Show user avatar with dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-cupcake-blue/10"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profile_picture} alt={`${user?.first_name} ${user?.last_name}`} />
                        <AvatarFallback className="bg-cupcake-pink text-white text-sm font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">{user?.first_name}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="flex items-center cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Not authenticated: Show login and register buttons
                <>
                  {authItems.map((item) => (
                    <Button
                      key={item.to}
                      variant={item.label === "Create Account" ? "default" : "ghost"}
                      size="sm"
                      asChild
                      className={cn(
                        "whitespace-nowrap",
                        item.label === "Create Account"
                          ? "bg-cupcake-darkPink hover:bg-cupcake-darkPink/90 text-white"
                          : "text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10"
                      )}
                    >
                      <Link to={item.to} onClick={handleNavigation}>
                        {item.icon}
                        <span className="ml-1.5 text-sm font-medium">{item.label}</span>
                      </Link>
                    </Button>
                  ))}
                </>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden flex-shrink-0 ml-2"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] max-w-[320px] bg-white/95 backdrop-blur-md border-l border-gray-200"
              >
                <div className="flex flex-col h-full">
                  {/* Sheet Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSheetOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* User Profile Section (Mobile - when authenticated) */}
                  {isAuthenticated && (
                    <div className="pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3 px-4 py-3 bg-cupcake-blue/5 rounded-lg mx-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.profile_picture} alt={`${user?.first_name} ${user?.last_name}`} />
                          <AvatarFallback className="bg-cupcake-pink text-white font-semibold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <nav className="flex flex-col gap-1 py-6 flex-1 overflow-y-auto">
                    {/* Regular navigation items */}
                    {regularItems.map((item) => (
                      <SheetClose asChild key={item.to}>
                        <Link
                          to={item.to}
                          onClick={handleNavigation}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10 rounded-lg transition-all duration-200 mx-1",
                            isActiveLink(item.to) && "text-cupcake-darkBlue bg-cupcake-blue/10 font-semibold"
                          )}
                        >
                          <div className="flex-shrink-0">
                            {item.icon}
                          </div>
                          <span className="font-medium text-base whitespace-nowrap">{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}

                    {/* Conditional auth items */}
                    {isAuthenticated ? (
                      <>
                        <div className="h-px bg-gray-200 my-2 mx-4" />
                        <SheetClose asChild>
                          <Link
                            to="/account"
                            onClick={handleNavigation}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10 rounded-lg transition-all duration-200 mx-1",
                              isActiveLink("/account") && "text-cupcake-darkBlue bg-cupcake-blue/10 font-semibold"
                            )}
                          >
                            <div className="flex-shrink-0">
                              <UserIcon size={20} />
                            </div>
                            <span className="font-medium text-base whitespace-nowrap">My Account</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/account/settings"
                            onClick={handleNavigation}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10 rounded-lg transition-all duration-200 mx-1",
                              isActiveLink("/account/settings") && "text-cupcake-darkBlue bg-cupcake-blue/10 font-semibold"
                            )}
                          >
                            <div className="flex-shrink-0">
                              <Settings size={20} />
                            </div>
                            <span className="font-medium text-base whitespace-nowrap">Settings</span>
                          </Link>
                        </SheetClose>
                        <button
                          onClick={() => {
                            setSheetOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 mx-1 w-full"
                        >
                          <div className="flex-shrink-0">
                            <LogOut size={20} />
                          </div>
                          <span className="font-medium text-base whitespace-nowrap">Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="h-px bg-gray-200 my-2 mx-4" />
                        {authItems.map((item) => (
                          <SheetClose asChild key={item.to}>
                            <Link
                              to={item.to}
                              onClick={handleNavigation}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10 rounded-lg transition-all duration-200 mx-1",
                                isActiveLink(item.to) && "text-cupcake-darkBlue bg-cupcake-blue/10 font-semibold"
                              )}
                            >
                              <div className="flex-shrink-0">
                                {item.icon}
                              </div>
                              <span className="font-medium text-base whitespace-nowrap">{item.label}</span>
                            </Link>
                          </SheetClose>
                        ))}
                      </>
                    )}
                  </nav>

                  {/* Social/Footer section in mobile menu */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-cupcake-darkPink hover:text-cupcake-darkBlue hover:bg-cupcake-blue/10"
                      >
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Follow us on Instagram"
                        >
                          <Instagram size={20} />
                        </a>
                      </Button>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Follow us on Instagram
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Secondary Navigation - For tablets and smaller screens */}
          <div className="lg:hidden mt-3 overflow-x-auto pb-2">
            <nav className="flex items-center gap-3 min-w-max">
              {regularItems.slice(0, 4).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleNavigation}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full border border-gray-200 transition-all duration-200 flex-shrink-0",
                    isActiveLink(item.to)
                      ? "text-cupcake-darkBlue bg-cupcake-blue/10 border-cupcake-blue/30"
                      : "text-gray-600 hover:text-cupcake-darkBlue hover:border-cupcake-blue/20"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/blog"
                onClick={handleNavigation}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full border border-gray-200 transition-all duration-200 flex-shrink-0",
                  isActiveLink("/blog")
                    ? "text-cupcake-darkBlue bg-cupcake-blue/10 border-cupcake-blue/30"
                    : "text-gray-600 hover:text-cupcake-darkBlue hover:border-cupcake-blue/20"
                )}
              >
                <BookOpen size={14} />
                <span>Blog</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div
        className={cn(
          "w-full transition-all duration-300",
          scrolled ? "h-16" : "h-20 md:h-24"
        )}
      />
    </>
  );
};

export default Navbar;