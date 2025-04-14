
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Lazy load components that aren't immediately needed
const Navbar = lazy(() => import('@/components/Navbar'));
const Footer = lazy(() => import('@/components/Footer'));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    const adminEmail = localStorage.getItem('adminEmail');
    if (adminEmail) {
      navigate('/admin');
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Create floating cupcake elements - optimized for performance
    const floatingElementsCount = window.innerWidth < 768 ? 3 : 6; // Reduce elements on mobile
    const loginContainer = document.getElementById('login-container');
    
    if (loginContainer) {
      const shapes = ['🧁', '🍰', '🎂', '🍪'];
      const elements: HTMLDivElement[] = [];
      
      const createFloatingElement = (i: number) => {
        const element = document.createElement('div');
        
        // Random position with mobile considerations
        const top = Math.random() * (window.innerWidth < 768 ? 70 : 100);
        const left = Math.random() * (window.innerWidth < 768 ? 80 : 100);
        
        // Optimized styles
        element.style.cssText = `
          position: absolute;
          top: ${top}%;
          left: ${left}%;
          font-size: ${Math.random() * (window.innerWidth < 768 ? 16 : 20) + 16}px;
          opacity: 0.2;
          z-index: -1;
          transform: translate(-50%, -50%);
          animation: float ${Math.random() * 3 + 3}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
        `;
        
        element.innerText = shapes[Math.floor(Math.random() * shapes.length)];
        elements.push(element);
        loginContainer.appendChild(element);
      };
      
      // Batch DOM operations
      requestAnimationFrame(() => {
        for (let i = 0; i < floatingElementsCount; i++) {
          createFloatingElement(i);
        }
      });
      
      // Cleanup
      return () => {
        elements.forEach(element => element.remove());
      };
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Verify password using pgcrypto on Supabase
      const { data: authResult, error: authError } = await supabase.rpc('verify_admin_password', {
        email_input: email.trim(),
        password_input: password
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authResult) {
        throw new Error('Invalid email or password');
      }
      
      // Login successful
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('isAdminLoggedIn', 'true');
      
      toast({
        title: "Login successful!",
        description: "Welcome to the admin dashboard.",
        duration: 3000,
      });
      
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 bg-white/80"></div>}>
        <Navbar />
      </Suspense>
      
      <main className="flex-1 pt-16 md:pt-24 pb-8 md:pb-16" id="login-container">
        <div className="container mx-auto px-4 max-w-[95%] sm:max-w-md">
          <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-cupcake-pink/20 animate-fade-in">
            <CardHeader className="space-y-1 p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl font-pacifico text-center text-cupcake-darkPink">Admin Login</CardTitle>
              <CardDescription className="text-center text-sm md:text-base">
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:gap-4 p-4 md:p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-3 md:gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      className="pl-10 h-11"
                      placeholder="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      className="pl-10 h-11"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-cupcake-darkPink hover:bg-pink-700 text-white rounded-md h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : (
                      <>
                        Sign In <ArrowRight className="ml-2" size={16} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 p-4 md:p-6">
              <div className="text-xs md:text-sm text-center text-gray-500">
                <p>Default Admin Credentials:</p>
                <p>Email: admin@lakeishascupcakery.com</p>
                <p>Password: admin123</p>
              </div>
              <div className="text-center text-xs md:text-sm text-gray-500">
                <Link to="/" className="text-cupcake-darkBlue hover:underline">
                  Return to Website
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Suspense fallback={<div className="h-16 bg-white/80"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default LoginPage;
