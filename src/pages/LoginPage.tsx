
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Admin credentials for demo (in a real app, this would be handled by a backend)
  const ADMIN_EMAIL = 'admin@lakeishascupcakery.com';
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Create floating cupcake elements
    const floatingElementsCount = 6;
    const loginContainer = document.getElementById('login-container');
    
    if (loginContainer) {
      const colors = ['#FFD6E0', '#A5D8FF', '#FFC107', '#FF9FB5'];
      const shapes = ['🧁', '🍰', '🎂', '🍪'];
      
      for (let i = 0; i < floatingElementsCount; i++) {
        const element = document.createElement('div');
        
        // Random position
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        
        // Set styles
        element.style.position = 'absolute';
        element.style.top = `${top}%`;
        element.style.left = `${left}%`;
        element.style.fontSize = `${Math.random() * 20 + 20}px`;
        element.style.opacity = '0.2';
        element.style.zIndex = '-1';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.animation = `float ${Math.random() * 3 + 3}s ease-in-out infinite`;
        element.style.animationDelay = `${Math.random() * 2}s`;
        
        // Add content
        element.innerText = shapes[Math.floor(Math.random() * shapes.length)];
        
        loginContainer.appendChild(element);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store login info in localStorage (in a real app, you'd use a token)
        localStorage.setItem('isAdminLoggedIn', 'true');
        
        toast({
          title: "Login successful!",
          description: "Welcome to the admin dashboard.",
          duration: 3000,
        });
        
        navigate('/admin');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16" id="login-container">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-cupcake-pink/20 animate-fade-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-pacifico text-center text-cupcake-darkPink">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      className="pl-10"
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
                      className="pl-10"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-cupcake-darkPink hover:bg-pink-700 text-white rounded-md py-2"
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
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-gray-500">
                <p>Demo Credentials:</p>
                <p>Email: admin@lakeishascupcakery.com</p>
                <p>Password: admin123</p>
              </div>
              <div className="text-center text-sm text-gray-500">
                <Link to="/" className="text-cupcake-darkBlue hover:underline">
                  Return to Website
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
