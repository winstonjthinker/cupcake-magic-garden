
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components that aren't immediately needed
const Navbar = lazy(() => import('@/components/Navbar'));
const Footer = lazy(() => import('@/components/Footer'));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the previous page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      
      toast({
        title: 'Success',
        description: 'Login successful!',
      });
      
      // The navigation will be handled by the useEffect when isAuthenticated changes
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Login Error',
        description: errorMessage,
        variant: 'destructive',
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
      
      <main className="flex-1 pt-16 md:pt-24 pb-8 md:pb-16">
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
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
            <div className="p-4 md:p-6 pt-0">
              <div className="text-center text-xs text-gray-400">
                <Link to="/forgot-password" className="hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default LoginPage;
