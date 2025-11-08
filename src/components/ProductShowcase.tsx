
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { productsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const fallbackProducts = [
  {
    id: 1,
    image_url: "https://images.unsplash.com/photo-1587668178277-295251f900ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    name: "Red Velvet Cupcake",
    description: "Rich and velvety with cream cheese frosting",
    price: 3.99
  },
  {
    id: 2,
    image_url: "https://images.unsplash.com/photo-1607478900766-efe13248b125?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    name: "Chocolate Delight",
    description: "Decadent chocolate cake with chocolate ganache",
    price: 4.99
  },
  {
    id: 3,
    image_url: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80",
    name: "Birthday Special",
    description: "Vanilla cake with colorful sprinkles and buttercream",
    price: 5.99
  },
  {
    id: 4,
    image_url: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    name: "Strawberry Bliss",
    description: "Fresh strawberry cupcake with strawberry frosting",
    price: 3.99
  },
  {
    id: 5,
    image_url: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    name: "Lemon Delight",
    description: "Tangy lemon cake with lemon zest frosting",
    price: 4.49
  },
  {
    id: 6,
    image_url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=936&q=80",
    name: "Signature Swirl",
    description: "Our signature cupcake with special frosting",
    price: 5.49
  },
];

const ProductShowcase = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getProducts({ 
          limit: 6, 
          is_featured: true,
          is_available: true
        });
        
        if (response.data && response.data.results && response.data.results.length > 0) {
          const formattedProducts = response.data.results.map((product) => ({
            id: product.id,
            image_url: product.image || `https://source.unsplash.com/random/400x300/?cupcake,${product.name.split(' ').join(',')}`,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price).toFixed(2)
          }));
          setProducts(formattedProducts);
        } else {
          console.log('No featured products found, using fallback data');
          setProducts(fallbackProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Using default data.",
          variant: "destructive"
        });
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);

  if (loading) {
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
      </section>
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
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              imageUrl={product.image_url}
              name={product.name}
              description={product.description || ""}
              price={`$${parseFloat(product.price).toFixed(2)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
