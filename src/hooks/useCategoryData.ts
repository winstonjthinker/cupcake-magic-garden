
import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import categoryData from '@/data/categoryData';
import { Product, Category } from '@/types/product';

type CategoryResponse = Category & {
  description?: string;
  image?: string;
  products?: Product[];
  created_at?: string;
  updated_at?: string;
  slug?: string;
};

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
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
            const response = await productsApi.getProducts({ 
              category: categoryId,
              is_available: true  // Only fetch available products
            });
            
            // Handle the response based on the API structure
            const responseData = response.data;
            let productsData: Product[] = [];
            
            if (responseData) {
              // Handle both paginated and non-paginated responses
              productsData = Array.isArray(responseData) 
                ? responseData 
                : ('results' in responseData ? responseData.results : []);
            }
            
            if (productsData.length > 0) {
              // Map the API response to our Product type
              const formattedProducts = productsData.map((product: any) => {
                const imageSrc = product.image || product.image_url || '';
                const name = product.name || product.title || 'Unnamed Product';
                
                return {
                  id: product.id,
                  name: name,
                  title: product.title || name,
                  description: product.description || '',
                  price: product.price || '0.00',
                  price_raw: product.price_raw || parseFloat(product.price) || 0,
                  image: imageSrc,
                  image_url: imageSrc,
                  is_available: product.is_available ?? true,
                  is_featured: product.is_featured ?? false,
                  category: typeof product.category === 'object' 
                    ? product.category.id 
                    : product.category,
                  created_at: product.created_at,
                  updated_at: product.updated_at,
                  slug: product.slug || `product-${product.id}`
                };
              });
              
              setProducts(formattedProducts);
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
            const categories = Array.isArray(categoryResponse.data) 
              ? categoryResponse.data 
              : ('results' in (categoryResponse.data as any) ? (categoryResponse.data as any).results : []);
            const foundCategory = categories.find(
              (cat: CategoryResponse) => cat.name.toLowerCase() === categoryId?.toLowerCase()
            );
            
            if (foundCategory) {
              setCategory(foundCategory);
              
              // Fetch products for this category
              const productsResponse = await productsApi.getProducts({ 
                category: foundCategory.id,
                is_available: true  // Only fetch available products
              });
              
              // Handle the response based on the API structure
              const responseData = productsResponse.data;
              let productsData: Product[] = [];
              
              if (responseData) {
                // Handle both paginated and non-paginated responses
                productsData = Array.isArray(responseData) 
                  ? responseData 
                  : ('results' in responseData ? responseData.results : []);
              }
              
              if (productsData.length > 0) {
                // Map the API response to our Product type
                const formattedProducts = productsData.map((product: any) => {
                  const imageSrc = product.image || product.image_url || '';
                  const name = product.name || product.title || 'Unnamed Product';
                  
                  return {
                    id: product.id,
                    name: name,
                    title: product.title || name,
                    description: product.description || '',
                    price: product.price || '0.00',
                    price_raw: product.price_raw || parseFloat(product.price) || 0,
                    image: imageSrc,
                    image_url: imageSrc,
                    is_available: product.is_available ?? true,
                    is_featured: product.is_featured ?? false,
                    category: typeof product.category === 'object' 
                      ? product.category.id 
                      : product.category,
                    created_at: product.created_at,
                    updated_at: product.updated_at,
                    slug: product.slug || `product-${product.id}`
                  };
                });
                
                setProducts(formattedProducts);
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
