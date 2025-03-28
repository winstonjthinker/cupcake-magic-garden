
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import categoryData from '@/data/categoryData';

export const useCategoryData = (categoryId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
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
          const fallbackCategory = categoryId && categoryData[categoryId as keyof typeof categoryData];
          setCategory(fallbackCategory);
          setProducts(fallbackCategory?.products || []);
          
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
            const fallbackCategory = categoryId && categoryData[categoryId as keyof typeof categoryData];
            setProducts(fallbackCategory?.products || []);
            
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
          const fallbackCategory = categoryId && categoryData[categoryId as keyof typeof categoryData];
          setCategory(fallbackCategory);
          setProducts(fallbackCategory?.products || []);
        }
      } catch (error) {
        console.error('Error:', error);
        // Fall back to static data
        const fallbackCategory = categoryId && categoryData[categoryId as keyof typeof categoryData];
        setCategory(fallbackCategory);
        setProducts(fallbackCategory?.products || []);
        
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
