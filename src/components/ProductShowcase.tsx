
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Product } from '@/types/product';

const API_URL = 'http://localhost:8000/api';

const fallbackProducts: Product[] = [
  {
    id: 1,
    image_url: "/placeholder-product.jpg",
    name: "Sample Cupcake",
    description: "Delicious cupcake loaded with flavor",
    price: "4.99",
    is_available: true
  },
];

const ProductShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ results: Product[] }>(
          `${API_URL}/products/`,
          { 
            params: { 
              is_featured: true,
              is_available: true,
              limit: 6
            } 
          }
        );
        
        if (response.data && response.data.results) {
          setProducts(response.data.results);
        } else if (Array.isArray(response.data)) {
          // Handle case where the API returns an array directly
          setProducts(response.data);
        } else {
          setProducts([]);
          setError('No products available');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">Unable to load products</h3>
        <p className="text-gray-500 mt-2">Please check your connection and try again later.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-cupcake-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-pacifico text-cupcake-darkPink mb-3">Top Trending Treats</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most popular handcrafted creations that customers can't get enough of.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.image_url || '/placeholder-product.jpg'}
                name={product.name}
                description={product.description || ""}
                price={`$${parseFloat(product.price).toFixed(2)}`}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">No products available</h3>
              <p className="text-gray-500 mt-2">Check back soon for our delicious treats!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
