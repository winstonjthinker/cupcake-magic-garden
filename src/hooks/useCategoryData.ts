
import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import categoryData from '@/data/categoryData';

// Define proper types for our category data
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  products?: Product[];
  created_at?: string;
  updated_at?: string;
}

export const useCategoryData = (categoryId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      
      try {
        // First try to get from static data
        const staticCategory = categoryId in categoryData ? 
          categoryData[categoryId as keyof typeof categoryData] : 
          null;
        
        if (staticCategory) {
          setCategory(staticCategory as unknown as Category);
          
          // Try to fetch products from the API
          try {
            const response = await productsApi.getProducts({ category: categoryId });
            if (response.data && response.data.length > 0) {
              setProducts(response.data);
            } else if (staticCategory.products) {
              // Fall back to static products if API returns nothing
              setProducts(staticCategory.products);
            }
          } catch (error) {
            console.error('Error fetching products:', error);
            // Use static products if API fails
            if (staticCategory.products) {
              setProducts(staticCategory.products);
            }
            
            toast({
              title: "Error",
              description: "Failed to load products. Using static data instead.",
              variant: "destructive"
            });
          }
        } else {
          // If no static data, try to fetch from API
          try {
            // Try to get category by name
            const categoryResponse = await productsApi.getCategories();
            const foundCategory = categoryResponse.data?.find(
              (cat: any) => cat.name.toLowerCase() === categoryId.toLowerCase()
            );
            
            if (foundCategory) {
              setCategory(foundCategory);
              
              // Fetch products for this category
              const productsResponse = await productsApi.getProducts({ 
                category: foundCategory.id 
              });
              
              if (productsResponse.data) {
                setProducts(productsResponse.data);
              }
            } else {
              // If category not found in API, create a fallback
              const fallbackCategory = {
                id: -1, // Indicates a fallback category
                name: categoryId,
                title: categoryId.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '),
                description: `Delicious ${categoryId} cupcakes and treats.`,
              };
              setCategory(fallbackCategory as Category);
              
              toast({
                title: "Category not found",
                description: `No category found with name "${categoryId}". Showing fallback data.`,
                variant: "destructive"
              });
            }
          } catch (error) {
            console.error('Error fetching category data:', error);
            
            // Create a fallback category if API fails
            const fallbackCategory = {
              id: -1, // Indicates a fallback category
              name: categoryId,
              title: categoryId.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' '),
              description: `Delicious ${categoryId} cupcakes and treats.`,
            };
            setCategory(fallbackCategory as Category);
            
            toast({
              title: "Error",
              description: "Failed to load category data. Using fallback data instead.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
        
        // If we still don't have a category, use a default one based on the ID
        if (!category && categoryId) {
          const fallbackCategory = {
            id: -1, // Indicates a fallback category
            name: categoryId,
            title: categoryId.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            description: `Delicious ${categoryId} cupcakes and treats.`,
          };
          setCategory(fallbackCategory as Category);
        }
        
        toast({
          title: "Error",
          description: "Failed to load category data. Using fallback data instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [categoryId, toast]);

  return { loading, category, products };
};

export default useCategoryData;
