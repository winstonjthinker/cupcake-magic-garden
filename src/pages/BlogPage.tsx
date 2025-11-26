import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, Clock, Search, Filter, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { blogApi } from '@/lib/api';
import { Link } from 'react-router-dom';

interface BlogArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  image_url?: string;
  author?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  read_time?: number;
  category?: string;
}

const BlogPage = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  // Static fallback data with enhanced properties
  const staticArticles: BlogArticle[] = [
    {
      id: 1,
      title: 'The Secret to Perfect Cupcake Frosting',
      excerpt: 'Learn the techniques professional bakers use to create beautiful cupcake frosting every time.',
      content: 'Frosting is an art form that takes practice to master...',
      image: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80',
      author: 'LaKeisha Johnson',
      published_at: '2023-06-15T00:00:00Z',
      created_at: '2023-06-15T00:00:00Z',
      updated_at: '2023-06-15T00:00:00Z',
      read_time: 5,
      category: 'baking-tips'
    },
    {
      id: 2,
      title: '5 Birthday Cake Ideas for Kids',
      excerpt: 'Make your child\'s birthday special with these creative and fun cake designs they\'ll love.',
      content: 'Planning a birthday party for your child?...',
      image_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80',
      author: 'Marcus Wilson',
      published_at: '2023-05-22T00:00:00Z',
      created_at: '2023-05-22T00:00:00Z',
      updated_at: '2023-05-22T00:00:00Z',
      read_time: 4,
      category: 'cake-design'
    },
    {
      id: 3,
      title: 'Behind the Scenes: A Day at LaKeisha\'s Bakery',
      excerpt: 'Take a peek behind the curtain and see how our delicious treats are made with love.',
      content: 'Ever wondered what goes on behind the scenes at a busy bakery?...',
      image_url: 'https://images.unsplash.com/photo-1586985290301-8db40143d525?ixlib=rb-4.0.3&auto=format&fit=crop&w=970&q=80',
      author: 'LaKeisha Johnson',
      published_at: '2023-04-10T00:00:00Z',
      created_at: '2023-04-10T00:00:00Z',
      updated_at: '2023-04-10T00:00:00Z',
      read_time: 6,
      category: 'bakery-life'
    },
    {
      id: 4,
      title: 'Vegan Baking: Substitutes That Actually Work',
      excerpt: 'Discover the best plant-based alternatives for eggs, butter, and milk in your baking recipes.',
      content: 'Vegan baking doesn\'t mean you have to sacrifice flavor or texture...',
      image_url: 'https://images.unsplash.com/photo-1612198790767-3fb5b455b3e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      author: 'Sophia Greene',
      published_at: '2023-03-18T00:00:00Z',
      created_at: '2023-03-18T00:00:00Z',
      updated_at: '2023-03-18T00:00:00Z',
      read_time: 7,
      category: 'dietary'
    },
    {
      id: 5,
      title: 'Seasonal Flavors: Summer Berry Desserts',
      excerpt: 'Make the most of fresh summer berries with these delightful dessert recipes.',
      content: 'Summer brings an abundance of fresh, juicy berries...',
      image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      author: 'James Peterson',
      published_at: '2023-07-05T00:00:00Z',
      created_at: '2023-07-05T00:00:00Z',
      updated_at: '2023-07-05T00:00:00Z',
      read_time: 5,
      category: 'seasonal'
    },
    {
      id: 6,
      title: 'How to Start a Home Baking Business',
      excerpt: 'Tips and advice for turning your passion for baking into a successful small business.',
      content: 'Starting a home baking business can be a rewarding way...',
      image_url: 'https://images.unsplash.com/photo-1556910096-5cdae96a4c77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      author: 'Amanda Richards',
      published_at: '2023-02-28T00:00:00Z',
      created_at: '2023-02-28T00:00:00Z',
      updated_at: '2023-02-28T00:00:00Z',
      read_time: 8,
      category: 'business'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'baking-tips', name: 'Baking Tips' },
    { id: 'cake-design', name: 'Cake Design' },
    { id: 'bakery-life', name: 'Bakery Life' },
    { id: 'dietary', name: 'Dietary' },
    { id: 'seasonal', name: 'Seasonal' },
    { id: 'business', name: 'Business' }
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await blogApi.getPosts({ ordering: '-published_at' });
        
        // Handle different API response structures
        let articlesData: BlogArticle[] = [];
        
        if (response.data && Array.isArray(response.data)) {
          // If response.data is directly an array
          articlesData = response.data;
        } else if (response.data?.results && Array.isArray(response.data.results)) {
          // If response.data has a results property
          articlesData = response.data.results;
        } else if (Array.isArray(response)) {
          // If response itself is an array
          articlesData = response;
        }
        
        if (articlesData.length > 0) {
          const articlesWithDefaults = articlesData.map(article => ({
            ...article,
            read_time: article.read_time || Math.ceil(article.content?.length / 200) || 5,
            category: article.category || 'baking-tips'
          }));
          setArticles(articlesWithDefaults);
          setFilteredArticles(articlesWithDefaults);
        } else {
          setArticles(staticArticles);
          setFilteredArticles(staticArticles);
        }
      } catch (error) {
        console.error("Error fetching blog articles:", error);
        setArticles(staticArticles);
        setFilteredArticles(staticArticles);
        toast({
          title: "Showing demo articles",
          description: "Couldn't load latest articles. Showing demo content instead.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
    window.scrollTo(0, 0);
  }, [toast]);

  // Filter articles based on search and category
  useEffect(() => {
    let filtered = articles;

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  }, [searchQuery, selectedCategory, articles]);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getArticleImage = (article: BlogArticle) => {
    return article.image || article.image_url || 'https://images.unsplash.com/photo-1588195538326-c5b1e75f8fe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80';
  };

  // Skeleton loader component
  const ArticleSkeleton = () => (
    <div className="group bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-500 animate-pulse">
      <div className="h-52 bg-gray-200 rounded-t-2xl"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-pink-50/30">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-sm border border-gray-100">
              <BookOpen className="text-cupcake-darkPink" size={20} />
              <span className="text-gray-600 font-medium">Baking Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-pacifico text-cupcake-darkBlue mb-4">
              Sweet Stories & Tips
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Discover recipes, baking secrets, and behind-the-scenes stories from our kitchen to yours
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cupcake-pink focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cupcake-pink focus:border-transparent transition-all duration-300 bg-white"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Back to Home */}
              <Link 
                to="/" 
                className="flex items-center gap-2 text-cupcake-darkPink hover:text-cupcake-pink transition-all duration-300 font-semibold group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>

          {/* Results Count */}
          {!isLoading && (
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredArticles.length} of {articles.length} articles
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              </p>
            </div>
          )}

          {/* Articles Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <ArticleSkeleton key={index} />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <article 
                  key={article.id}
                  className="group bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-gray-100"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={getArticleImage(article)} 
                      alt={article.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{article.read_time || 5} min read</span>
                        </div>
                      </div>
                      {article.category && (
                        <span className="px-2 py-1 bg-cupcake-blue/10 text-cupcake-darkBlue rounded-full text-xs font-medium">
                          {categories.find(c => c.id === article.category)?.name}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cupcake-darkPink transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {article.author && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                        <span>By</span>
                        <span className="font-semibold text-gray-700">{article.author}</span>
                      </div>
                    )}
                    
                    <Link
                      to={`/blog/${article.id}`}
                      className="inline-flex items-center gap-2 text-cupcake-darkBlue font-semibold hover:text-cupcake-blue transition-all duration-300 group/link"
                    >
                      Read More
                      <ChevronLeft className="h-4 w-4 rotate-180 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            // No results state
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No articles matching "${searchQuery}" were found. Try different keywords.`
                    : 'No articles available in this category.'
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="bg-cupcake-darkPink text-white px-6 py-3 rounded-xl hover:bg-cupcake-pink transition-colors duration-300 font-semibold"
                >
                  Show All Articles
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;