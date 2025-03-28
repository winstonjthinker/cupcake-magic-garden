
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Package, DollarSign, Users, ShoppingBag, Cake, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    
    if (!isAdminLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to access the admin dashboard",
        variant: "destructive",
        duration: 3000,
      });
      navigate('/login');
      return;
    }
    
    setIsAuthenticated(true);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [navigate, toast]);
  
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin area",
      duration: 3000,
    });
    
    navigate('/');
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything while checking authentication
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-pacifico text-cupcake-darkBlue">Admin Dashboard</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-cupcake-pink/20 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-cupcake-darkPink" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">428</div>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <span>↑ 12%</span> <span className="text-gray-500">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-cupcake-blue/20 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-cupcake-darkBlue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,458</div>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <span>↑ 8%</span> <span className="text-gray-500">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-300/20 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Customers</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">192</div>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <span>↑ 18%</span> <span className="text-gray-500">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-amber-300/20 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle>
                <Cake className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                  <span>+3</span> <span className="text-gray-500">new this month</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="orders" className="data-[state=active]:bg-cupcake-pink/20 data-[state=active]:text-cupcake-darkPink">
                <ShoppingBag className="w-4 h-4 mr-2" /> Orders
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-cupcake-blue/20 data-[state=active]:text-cupcake-darkBlue">
                <Cake className="w-4 h-4 mr-2" /> Products
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                <BarChart className="w-4 h-4 mr-2" /> Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { id: 'ORD-001', customer: 'Jane Smith', product: 'Birthday Cake', amount: '$45.00', status: 'Completed' },
                          { id: 'ORD-002', customer: 'John Doe', product: 'Cupcakes (12)', amount: '$36.00', status: 'Processing' },
                          { id: 'ORD-003', customer: 'Sarah Johnson', product: 'Cakesicles (24)', amount: '$48.00', status: 'Delivered' },
                          { id: 'ORD-004', customer: 'Michael Brown', product: 'Sweet Treats Box', amount: '$25.00', status: 'Processing' },
                          { id: 'ORD-005', customer: 'Emily Wilson', product: 'Wedding Cake', amount: '$350.00', status: 'Pending' },
                        ].map((order, i) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Product management features coming soon!</p>
                    <Button className="bg-cupcake-darkBlue hover:bg-blue-700">Add New Product</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Detailed analytics and reporting coming soon!</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">Generate Report</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
