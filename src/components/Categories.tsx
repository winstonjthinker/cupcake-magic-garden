import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        if (error) {
          console.error('Error fetching categories:', error);
          toast({
            title: "Error",
            description: "Failed to load categories. Using default data.",
            variant: "destructive"
          });
          setCategories(fallbackCategories);
        } else {
          if (data && data.length > 0) {
            const colors = [
              'from-cupcake-pink/30 to-cupcake-darkPink/80',
              'from-cupcake-blue/30 to-cupcake-darkBlue/80',
              'from-purple-300/30 to-purple-700/80',
              'from-amber-300/30 to-amber-700/80'
            ];
            
            const categoriesWithColors = data.map((category, index) => ({
              ...category,
              color: colors[index % colors.length]
            }));
            
            setCategories(categoriesWithColors);
          } else {
            setCategories(fallbackCategories);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);

  if (loading) {
    return (
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p>Loading categories...</p>
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
                src={category.image_url || `https://source.unsplash.com/random/300x300/?${category.name.replace(/\s+/g, '-').toLowerCase()}`}
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
