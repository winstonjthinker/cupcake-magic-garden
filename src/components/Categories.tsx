import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { productsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
}

interface ApiResponse<T> {
  data: T;
  // Add other response properties if needed
}

const fallbackCategories = [
  {
    id: 'cupcakes',
    name: 'Cupcakes',
    description: 'Delicious bite-sized treats perfect for any occasion.',
    image_url: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75',
    color: 'from-cupcake-pink/30 to-cupcake-darkPink/80'
  },
  {
    id: 'cakes',
    name: 'Cakes',
    description: 'Beautifully crafted cakes for celebrations and special moments.',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    color: 'from-cupcake-blue/30 to-cupcake-darkBlue/80'
  },
  {
    id: 'cakesicles',
    name: 'Cakesicles',
    description: 'Delicious cake pops on a stick! Perfect for parties and gifts.',
    image_url: 'https://images.unsplash.com/photo-1596223430183-9e318f2d05e3',
    color: 'from-purple-300/30 to-purple-700/80'
  },
  {
    id: 'sweet-treats',
    name: 'Sweet Treats',
    description: 'Assortment of cookies, brownies, and other sweet delights.',
    image_url: 'https://images.unsplash.com/photo-1558304414-fd2249afea97',
    color: 'from-amber-300/30 to-amber-700/80'
  }
];

const Categories = () => {
  const [categories, setCategories] = useState<(Category & { color: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsApi.getCategories();
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const colors = [
            'from-pink-500 to-pink-700',
            'from-purple-500 to-purple-700',
            'from-blue-500 to-blue-700',
            'from-green-500 to-green-700',
          ];
          
          const categoriesWithColors = response.data.map((category: Category, index: number) => ({
            ...category,
            color: colors[index % colors.length],
          }));
          
          setCategories(categoriesWithColors);
        } else {
          // Use fallback categories if API returns no data
          setCategories(fallbackCategories);
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        
        if (error.response?.status === 401) {
          // If not authenticated, use fallback data
          toast({
            title: 'Notice',
            description: 'Using sample category data. Sign in for full features.',
            variant: 'default',
          });
        } else {
          // Handle other errors
          toast({
            title: 'Error',
            description: 'Failed to load categories. Using sample data.',
            variant: 'destructive',
          });
        }
        
        // Use fallback categories in case of any error
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if authenticated, otherwise use fallback
    if (isAuthenticated) {
      fetchCategories();
    } else {
      setCategories(fallbackCategories);
      setLoading(false);
    }
  }, [isAuthenticated, toast]);

  if (loading) {
    return (
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse h-64">
                <div className="h-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-pacifico text-cupcake-darkBlue mb-3 animate-bounce-light">Sweet Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Explore our delicious range of handcrafted treats, made with the finest ingredients and a whole lot of love.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${category.color} opacity-75 transition-opacity group-hover:opacity-90`}></div>
              <img 
                src={category.image || `https://source.unsplash.com/random/300x300/?${category.name.replace(/\s+/g, '-').toLowerCase()}`}
                alt={category.name} 
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-pacifico text-white mb-2 transition-transform duration-300 group-hover:-translate-y-1">{category.name}</h3>
                <p className="text-white/90 mb-4 transition-opacity duration-300 group-hover:opacity-100 opacity-80">
                  {category.description}
                </p>
                <span 
                  className="inline-flex items-center text-white font-semibold border-b-2 border-white pb-1 opacity-90 transition-all hover:opacity-100 w-fit group-hover:translate-x-2 duration-300"
                >
                  Explore Collection <ChevronRight className="ml-1 h-4 w-4 animate-bounce-horizontal" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
