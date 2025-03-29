
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import categoryData from '@/data/categoryData';

// Define proper types for our category data
interface Product {
  id: string | number;
  name: string;
  description?: string;
  // Make price property handle both number and string types
  price: number | string;
  price_raw?: number;
  image_url?: string;
  title?: string;
  image?: string;
}

interface Category {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  products?: Product[];
  image_url?: string;
  icon?: any;
  color?: string;
}

export const useCategoryData = (categoryId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      
      try {
        // Fetch the category from Supabase
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('name', categoryId)
          .maybeSingle();
        
        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          // Fall back to static data
          if (categoryId) {
            const fallbackCategoryData = categoryData as any;
            const fallbackCategory = fallbackCategoryData ? 
              fallbackCategoryData[categoryId as keyof typeof fallbackCategoryData] : 
              null;
              
            if (fallbackCategory) {
              setCategory(fallbackCategory as Category);
              setProducts((fallbackCategory as Category).products || []);
            } else {
              // Try to get from imported static data
              const staticCategory = categoryId && categoryId in categoryData ? 
                categoryData[categoryId as keyof typeof categoryData] : 
                null;
              
              // Explicitly cast to Category type
              setCategory(staticCategory as unknown as Category);
              setProducts((staticCategory as unknown as Category)?.products || []);
            }
          }
          
          toast({
            title: "Error",
            description: "Failed to load category data. Using static data instead.",
            variant: "destructive"
          });
        } else if (categoryData) {
          setCategory(categoryData);
          
          // Fetch products for this category
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryData.id);
          
          if (productsError) {
            console.error('Error fetching products:', productsError);
            // Fall back to static data
            if (categoryId) {
              const staticCategory = categoryData[categoryId as keyof typeof categoryData];
              // Explicitly cast to Category type
              setProducts((staticCategory as unknown as Category)?.products || []);
            }
            
            toast({
              title: "Error",
              description: "Failed to load products. Using static data instead.",
              variant: "destructive"
            });
          } else {
            setProducts(productsData || []);
          }
        } else {
          // Fall back to static data if no category found in database
          if (categoryId) {
            const staticCategory = categoryData[categoryId as keyof typeof categoryData];
            // Explicitly cast to Category type
            setCategory(staticCategory as unknown as Category);
            setProducts((staticCategory as unknown as Category)?.products || []);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        // Fall back to static data
        if (categoryId) {
          const staticCategory = categoryData[categoryId as keyof typeof categoryData];
          // Explicitly cast to Category type
          setCategory(staticCategory as unknown as Category);
          setProducts((staticCategory as unknown as Category)?.products || []);
        }
        
        toast({
          title: "Error",
          description: "Failed to load category data. Using static data instead.",
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
