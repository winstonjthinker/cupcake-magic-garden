
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { blogApi } from '@/lib/api';

interface BlogArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image?: string | null;
  author?: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const BlogManagement = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: ''
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await blogApi.getPosts({ ordering: '-published_at' });
        const data = response.data || [];
        
        setArticles(data || []);
      } catch (error) {
        console.error('Error fetching blog articles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog articles',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: ''
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (article: BlogArticle) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content || '',
      image: article.image || '',
      author: article.author || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (article: BlogArticle) => {
    setSelectedArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      const newArticle = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image || null,
        author: formData.author || null,
        published_at: new Date().toISOString()
      };

      const response = await blogApi.createPost(newArticle);
      const createdArticle = response.data;

      setArticles(prev => [createdArticle, ...prev]);
      setIsAddDialogOpen(false);
      resetForm();
      
      toast({
        title: 'Success',
        description: 'Article created successfully',
      });
    } catch (error) {
      console.error('Error adding blog article:', error);
      toast({
        title: 'Error',
        description: 'Failed to create blog article',
        variant: 'destructive',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;
    
    setFormSubmitting(true);
    
    try {
      const updatedArticle = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image || null,
        author: formData.author || null
      };

      const response = await blogApi.updatePost(selectedArticle.id, updatedArticle);
      const updatedData = response.data;

      setArticles(prev => 
        prev.map(article => 
          article.id === selectedArticle.id ? updatedData : article
        )
      );
      
      setIsEditDialogOpen(false);
      setSelectedArticle(null);
      
      toast({
        title: 'Success',
        description: 'Article updated successfully',
      });
    } catch (error) {
      console.error('Error updating blog article:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blog article',
        variant: 'destructive',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    
    setFormSubmitting(true);
    
    try {
      await blogApi.deletePost(selectedArticle.id);

      setArticles(prev => prev.filter(article => article.id !== selectedArticle.id));
      setIsDeleteDialogOpen(false);
      setSelectedArticle(null);
      
      toast({
        title: 'Success',
        description: 'Article deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting blog article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog article',
        variant: 'destructive',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        <h2 className="text-xl font-semibold">Blog Management</h2>
        <Button 
          onClick={openAddDialog} 
          className="bg-cupcake-darkBlue hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" /> New Article
        </Button>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-gray-500 mb-4">No blog articles found.</p>
            <Button 
              onClick={openAddDialog} 
              className="bg-cupcake-darkBlue hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Your First Article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {article.image ? (
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                          No img
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{article.author || 'Anonymous'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(article.published_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-2 text-gray-600 border-gray-300 hover:bg-gray-50"
                        onClick={() => window.open(`/blog/${article.id}`, '_blank')}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                        onClick={() => openEditDialog(article)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => openDeleteDialog(article)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Article Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Article</DialogTitle>
            <DialogDescription>
              Write and publish a new blog article
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddArticle} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium text-gray-700">Author</label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Your name (optional)"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium text-gray-700">Excerpt</label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={2}
                placeholder="A brief summary of the article"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-gray-700">Content</label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                placeholder="Write your article content here..."
                required
              />
              <p className="text-xs text-gray-500">Use double line breaks to create new paragraphs</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium text-gray-700">Featured Image URL</label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="Image URL"
                className="mt-1"
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
                    Publishing...
                  </>
                ) : (
                  'Publish Article'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Article</DialogTitle>
            <DialogDescription>
              Update the content and details of this article
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditArticle} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium text-gray-700">Title</label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-author" className="text-sm font-medium text-gray-700">Author</label>
              <Input
                id="edit-author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Your name (optional)"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-excerpt" className="text-sm font-medium text-gray-700">Excerpt</label>
              <Textarea
                id="edit-excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={2}
                placeholder="A brief summary of the article"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-content" className="text-sm font-medium text-gray-700">Content</label>
              <Textarea
                id="edit-content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                placeholder="Write your article content here..."
                required
              />
              <p className="text-xs text-gray-500">Use double line breaks to create new paragraphs</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-image_url" className="text-sm font-medium text-gray-700">Featured Image URL</label>
              <Input
                id="edit-image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting}>
                {formSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Article'
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
              Are you sure you want to delete the article "{selectedArticle?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteArticle}
              disabled={formSubmitting}
            >
              {formSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Article'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
