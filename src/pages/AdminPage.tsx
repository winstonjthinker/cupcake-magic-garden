import React, { useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  Package, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Cake, 
  BarChart,
  FileText,
  UserCog
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
const ProductManagement = lazy(() => import('@/components/admin/ProductManagement'));
const BlogManagement = lazy(() => import('@/components/admin/BlogManagement'));
const AdminUserManagement = lazy(() => import('@/components/admin/AdminUserManagement'));

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  
  useEffect(() => {
    // Redirect to login if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page.",
        variant: "destructive",
        duration: 3000,
      });
      navigate('/login', { state: { from: '/admin' } });
      return;
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [isAuthenticated, isAdmin, navigate, toast]);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin area",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cupcake-darkPink"></div>
        <p className="mt-4 text-gray-600">Redirecting to login...</p>
      </div>
    );
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
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto mb-6">
              <TabsTrigger value="orders" className="data-[state=active]:bg-cupcake-pink/20 data-[state=active]:text-cupcake-darkPink">
                <ShoppingBag className="w-4 h-4 mr-2" /> Orders
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-cupcake-blue/20 data-[state=active]:text-cupcake-darkBlue">
                <Cake className="w-4 h-4 mr-2" /> Products
              </TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                <FileText className="w-4 h-4 mr-2" /> Blog
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
                <UserCog className="w-4 h-4 mr-2" /> Admins
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
                  <Suspense fallback={<div className="p-4">Loading product tools...</div>}>
                    <ProductManagement />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="blog" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="p-4">Loading blog tools...</div>}>
                    <BlogManagement />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="admin" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Admin User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="p-4">Loading admin users...</div>}>
                    <AdminUserManagement />
                  </Suspense>
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
