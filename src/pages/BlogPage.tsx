
import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface BlogArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  author?: string;
  published_at: string;
}

const BlogPage = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_articles')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setArticles(data as BlogArticle[]);
        } else {
          // If no articles in database, use static data
          setArticles([
            {
              id: '1',
              title: 'The Secret to Perfect Cupcake Frosting',
              excerpt: 'Learn the techniques professional bakers use to create beautiful cupcake frosting every time.',
              content: 'Frosting is an art form that takes practice to master. The key to perfect frosting lies in the temperature of your butter and the consistency of your mixture. Start with butter that is at room temperature, but not too soft. Beat it for several minutes until it becomes light and fluffy before adding your powdered sugar gradually. For the creamiest frosting, add a splash of heavy cream and vanilla extract. The final step is to use the right piping tips and techniques to create beautiful decorative patterns.',
              image_url: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80',
              author: 'LaKeisha Johnson',
              published_at: '2023-06-15T00:00:00Z'
            },
            {
              id: '2',
              title: '5 Birthday Cake Ideas for Kids',
              excerpt: 'Make your child\'s birthday special with these creative and fun cake designs they\'ll love.',
              content: 'Planning a birthday party for your child? The cake is often the centerpiece of the celebration. Here are five creative cake ideas that will delight children of all ages: 1) Character cakes shaped like their favorite cartoon character, 2) Rainbow layer cakes with vibrant colors inside and out, 3) Interactive cakes with candy surprises inside, 4) Sports-themed cakes customized to their favorite activity, and 5) Miniature cupcake towers that offer variety and eye-catching presentation. With these ideas, your child\'s birthday cake will be memorable and perfect for Instagram-worthy photos!',
              image_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80',
              author: 'Marcus Wilson',
              published_at: '2023-05-22T00:00:00Z'
            },
            {
              id: '3',
              title: 'Behind the Scenes: A Day at LaKeisha\'s Bakery',
              excerpt: 'Take a peek behind the curtain and see how our delicious treats are made with love.',
              content: 'Ever wondered what goes on behind the scenes at a busy bakery? At LaKeisha\'s Cupcakery, our day starts at 4:30 AM when our bakers arrive to begin the morning\'s first batch of fresh pastries. The kitchen comes alive with the smell of vanilla, chocolate, and cinnamon as mixers whirl and ovens heat up. Each cupcake is handcrafted with precision and care, from mixing the batter to the final decorative touch. Our team works together like a well-oiled machine, with specialized roles for baking, frosting, decorating, and packaging. By the time our doors open at a a.m., we\'ve already created hundreds of delicious treats ready for our customers to enjoy.',
              image_url: 'https://images.unsplash.com/photo-1586985290301-8db40143d525?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=970&q=80',
              author: 'LaKeisha Johnson',
              published_at: '2023-04-10T00:00:00Z'
            },
            {
              id: '4',
              title: 'Vegan Baking: Substitutes That Actually Work',
              excerpt: 'Discover the best plant-based alternatives for eggs, butter, and milk in your baking recipes.',
              content: 'Vegan baking doesn\'t mean you have to sacrifice flavor or texture. With the right substitutes, you can create delicious treats that everyone will enjoy. For eggs, try applesauce, mashed bananas, or commercial egg replacers. Instead of butter, opt for coconut oil, vegan butter alternatives, or even avocado in chocolate desserts. Plant milks like oat, almond, or soy work wonderfully in most recipes, but coconut milk is best for rich, creamy results. The key is understanding the role each ingredient plays in your recipe and finding the appropriate substitute that serves the same purpose.',
              image_url: 'https://images.unsplash.com/photo-1612198790767-3fb5b455b3e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              author: 'Sophia Greene',
              published_at: '2023-03-18T00:00:00Z'
            },
            {
              id: '5',
              title: 'Seasonal Flavors: Summer Berry Desserts',
              excerpt: 'Make the most of fresh summer berries with these delightful dessert recipes.',
              content: 'Summer brings an abundance of fresh, juicy berries that are perfect for incorporating into your baking. From strawberry shortcakes to blueberry pies and raspberry tarts, the possibilities are endless. One of our favorite recipes is a mixed berry galette - a rustic, free-form tart that\'s easier than pie but just as delicious. Simply toss your favorite berries with sugar, lemon juice, and cornstarch, then fold them into a simple pastry dough. Bake until golden and serve with a scoop of vanilla ice cream for the perfect summer dessert that lets the natural flavors of seasonal berries shine.',
              image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
              author: 'James Peterson',
              published_at: '2023-07-05T00:00:00Z'
            },
            {
              id: '6',
              title: 'How to Start a Home Baking Business',
              excerpt: 'Tips and advice for turning your passion for baking into a successful small business.',
              content: 'Starting a home baking business can be a rewarding way to turn your passion into profit. Begin by researching your local cottage food laws and obtaining any necessary permits or licenses. Develop a business plan that outlines your unique selling proposition, target market, and pricing strategy. Invest in quality equipment and ingredients - while it may cost more upfront, the results will speak for themselves. Build your brand through social media marketing, high-quality photography, and word-of-mouth referrals. Start small with a focused menu of your best items, and expand as you gain experience and regular customers. With dedication and the right approach, your home kitchen can become the foundation of a thriving business.',
              image_url: 'https://images.unsplash.com/photo-1556910096-5cdae96a4c77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              author: 'Amanda Richards',
              published_at: '2023-02-28T00:00:00Z'
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching blog articles:", error);
        toast({
          title: "Error loading articles",
          description: "Could not load blog articles. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    window.scrollTo(0, 0);
  }, [toast]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-pacifico text-cupcake-darkBlue mb-2">Baking Blog</h1>
              <p className="text-gray-600 max-w-2xl">
                Discover recipes, tips, and stories from our kitchen to yours
              </p>
            </div>
            <Link 
              to="/" 
              className="hidden md:flex items-center text-cupcake-darkPink hover:text-cupcake-pink transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Back to Home</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cupcake-darkPink"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(article => (
                <div 
                  key={article.id}
                  className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="h-52 overflow-hidden">
                    <img 
                      src={article.image_url || 'https://images.unsplash.com/photo-1606890658317-7d14490b76fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80'} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                      {article.author && (
                        <span>By {article.author}</span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-cupcake-darkPink transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <Link
                      to={`/blog/${article.id}`}
                      className="inline-flex items-center text-cupcake-darkBlue font-medium hover:text-cupcake-blue transition-colors"
                    >
                      Read More <ChevronLeft className="ml-1 h-4 w-4 rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
