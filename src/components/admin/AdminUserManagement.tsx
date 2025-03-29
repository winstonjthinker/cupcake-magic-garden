
import React, { useState, useEffect } from 'react';
import { User, Loader2, Plus, Trash2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

const AdminUserManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, email, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setAdminUsers(data || []);
      } catch (error) {
        console.error('Error fetching admin users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load admin users',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUsers();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openDeleteDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const validatePassword = () => {
    return formData.password.length >= 6 && formData.password === formData.confirmPassword;
  };

  const handleAddAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) {
      toast({
        title: 'Validation Error',
        description: formData.password.length < 6 
          ? 'Password must be at least 6 characters long' 
          : 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      const newAdminUser = {
        email: formData.email,
        password: formData.password,
      };

      const { data, error } = await supabase
        .from('admin_users')
        .insert([newAdminUser])
        .select()
        .single();

      if (error) throw error;

      setAdminUsers(prev => [data, ...prev]);
      setIsAddDialogOpen(false);
      resetForm();
      
      toast({
        title: 'Success',
        description: 'Admin user added successfully',
      });
    } catch (error: any) {
      console.error('Error adding admin user:', error);
      
      // Handle duplicate email error
      if (error.code === '23505') {
        toast({
          title: 'Error',
          description: 'This email is already registered as an admin user',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add admin user',
          variant: 'destructive',
        });
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteAdminUser = async () => {
    if (!selectedUser) return;
    
    setFormSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', selectedUser.id);

      if (error) throw error;

      setAdminUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      
      toast({
        title: 'Success',
        description: 'Admin user deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting admin user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete admin user',
        variant: 'destructive',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-cupcake-darkPink" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Admin User Management</h2>
        <Button 
          onClick={openAddDialog} 
          className="bg-cupcake-darkPink hover:bg-pink-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Admin User
        </Button>
      </div>

      {adminUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-gray-500 mb-4">No admin users found.</p>
            <Button 
              onClick={openAddDialog} 
              className="bg-cupcake-darkPink hover:bg-pink-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Your First Admin User
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-gray-400" />
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => openDeleteDialog(user)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Admin User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
            <DialogDescription>
              Create a new administrator account with login credentials
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAdminUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting}>
                {formSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Admin User'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete admin user "{selectedUser?.email}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAdminUser}
              disabled={formSubmitting}
            >
              {formSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Admin User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
