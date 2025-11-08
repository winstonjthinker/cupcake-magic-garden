
import React, { useState, useEffect } from 'react';
import { User, Loader2, Plus, Trash2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';

interface AdminUser {
  id: number;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
  date_joined: string;
  first_name?: string;
  last_name?: string;
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
        // Since we don't have a direct endpoint to get all users,
        // we'll use the profile endpoint to get the current user's data
        // and handle admin users differently
        const response = await authApi.getProfile();
        // For now, just show the current user as admin
        // In a real app, you would have an admin endpoint to fetch all users
        if (response.data) {
          setAdminUsers([response.data]);
        }
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
      // Register the user with default name
      const registerResponse = await authApi.register({
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: 'Admin',
        last_name: 'User'
      });

      if (registerResponse.data) {
        toast({
          title: 'Success',
          description: 'Admin user created successfully',
        });
        // Refresh the admin users list
        const response = await authApi.getProfile();
        if (response.data) {
          setAdminUsers([response.data]);
        }
        setIsAddDialogOpen(false);
      }
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
      // In a real app, you would have an endpoint to update user roles
      // For now, we'll just show a message that this action is not available
      toast({
        title: 'Info',
        description: 'User management is currently limited in the demo version',
      });
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
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
        <div className="space-y-4">
          {adminUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.is_superuser ? 'Super Admin' : 'Staff'} • 
                    Joined {new Date(user.date_joined).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleResetPassword(user.id)}
                  className="h-8"
                >
                  <Key className="h-3.5 w-3.5 mr-1" /> Reset Password
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => openDeleteDialog(user)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
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
