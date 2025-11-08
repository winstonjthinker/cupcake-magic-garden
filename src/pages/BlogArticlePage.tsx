
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { blogApi } from '@/lib/api';

interface BlogArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  author?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const BlogArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      
      try {
        const response = await blogApi.getPost(articleId);
        
        if (response.data) {
          setArticle(response.data);
          setLoading(false);
          return;
        }
        
        // If no data from API, use static data
        const staticArticles = [
          {
            id: 1,
              title: 'The Secret to Perfect Cupcake Frosting',
              excerpt: 'Learn the techniques professional bakers use to create beautiful cupcake frosting every time.',
              content: 'Frosting is an art form that takes practice to master. The key to perfect frosting lies in the temperature of your butter and the consistency of your mixture. Start with butter that is at room temperature, but not too soft. Beat it for several minutes until it becomes light and fluffy before adding your powdered sugar gradually. For the creamiest frosting, add a splash of heavy cream and vanilla extract. The final step is to use the right piping tips and techniques to create beautiful decorative patterns.\n\nOne of the most common mistakes people make when frosting cupcakes is using butter that is too warm. This results in a runny frosting that won\'t hold its shape. If your butter is too soft, place it in the refrigerator for 5-10 minutes to firm up slightly before beginning.\n\nAnother important factor is the ratio of butter to sugar. Too much sugar will make your frosting too sweet and grainy, while too little will result in a frosting that\'s too buttery and won\'t hold its shape. A good starting point is a 1:2 ratio of butter to sugar, but you can adjust based on your preferences.\n\nWhen it comes to flavoring your frosting, the possibilities are endless. Vanilla is a classic, but don\'t be afraid to experiment with different extracts, citrus zest, spices, or even melted chocolate. Just be careful not to add too much liquid, as this can affect the consistency.\n\nFinally, invest in a set of quality piping tips and practice different techniques. The classic swirl is achieved with a large star tip, but you can create beautiful designs with round tips, petal tips, and more. With practice, you\'ll be creating professional-looking cupcakes in no time!',
              image: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80',
              author: 'LaKeisha Johnson',
              published_at: '2023-06-15T00:00:00Z',
              created_at: '2023-06-15T00:00:00Z',
              updated_at: '2023-06-15T00:00:00Z'
            },
            {
              id: '2',
              title: '5 Birthday Cake Ideas for Kids',
              excerpt: 'Make your child\'s birthday special with these creative and fun cake designs they\'ll love.',
              content: 'Planning a birthday party for your child? The cake is often the centerpiece of the celebration. Here are five creative cake ideas that will delight children of all ages.\n\n1. Character Cakes: Transform a simple cake into your child\'s favorite cartoon character or superhero. You can use fondant for detailed decorations or buttercream for a simpler approach. Templates are available online to help you get the shape just right.\n\n2. Rainbow Layer Cakes: Create a wow factor when the cake is cut by hiding vibrant rainbow layers inside. Divide your batter into 5-6 portions and color each one with gel food coloring before baking. Stack the layers with frosting between each one for a stunning effect.\n\n3. Surprise Piñata Cakes: Hollow out the center of your cake and fill it with candies or small treats. When your child cuts into the cake, the surprises will spill out, adding an element of fun and excitement to the celebration.\n\n4. Sports-Themed Cakes: For the young athlete, create a cake shaped like a basketball, soccer ball, or baseball field. Use colored frosting and fondant to add details like laces, lines, and team logos.\n\n5. Cupcake Towers: Instead of a traditional cake, arrange cupcakes in the shape of a number (their age) or stack them in tiers. This allows for variety in flavors and makes serving easier. Decorate each cupcake individually or create a cohesive design across all of them.\n\nRemember, the most important thing is that the cake reflects your child\'s interests and personality. With these ideas as inspiration, you can create a birthday cake that will be the highlight of their special day!',
              image_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80',
              author: 'Marcus Wilson',
              published_at: '2023-05-22T00:00:00Z'
            },
            {
              id: '3',
              title: 'Behind the Scenes: A Day at LaKeisha\'s Bakery',
              excerpt: 'Take a peek behind the curtain and see how our delicious treats are made with love.',
              content: 'Ever wondered what goes on behind the scenes at a busy bakery? At LaKeisha\'s Cupcakery, our day starts at 4:30 AM when our bakers arrive to begin the morning\'s first batch of fresh pastries.\n\nAs the city sleeps, our kitchen comes alive with the aroma of vanilla, chocolate, and cinnamon. The mixers whirl as our bakers carefully measure ingredients for the day\'s cupcakes, cookies, and special order cakes. Everything is made from scratch using family recipes that have been perfected over generations.\n\nBy 6:00 AM, the first batches of cupcakes are in the ovens, filling the bakery with an irresistible smell. While they bake, our decorators prepare frostings in a rainbow of colors, whipping butter and sugar into light, fluffy peaks. Fresh fruit is sliced for toppings, chocolate is melted for ganache, and edible decorations are carefully arranged for easy access.\n\nWhen the cupcakes emerge from the ovens, they\'re left to cool before the real artistry begins. Each cupcake is frosted by hand, with our decorators using various techniques to create our signature swirls, flowers, and patterns. Special orders receive extra attention, with custom decorations and personalized touches added according to customer specifications.\n\nThroughout the morning, deliveries arrive - fresh eggs from a local farm, premium chocolate from our favorite supplier, and seasonal fruits for our limited-edition flavors. Our team works like a well-oiled machine, with each person playing a vital role in creating the perfect products.\n\nBy the time our doors open at 9:00 AM, the display cases are filled with rows of beautiful cupcakes, cookies are piled high on plates, and custom order cakes await pickup. The coffee is brewed, the counters are spotless, and our front-of-house team is ready to greet the first customers of the day with a smile.\n\nThroughout the day, our bakers continue to replenish stock, ensuring that everything stays fresh. The most popular flavors often sell out by mid-afternoon, so we recommend coming early for the best selection!\n\nNext time you bite into one of our delicious treats, you\'ll know the love and care that went into making it - from the early morning mixing to the final decorative touch.',
              image_url: 'https://images.unsplash.com/photo-1586985290301-8db40143d525?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=970&q=80',
              author: 'LaKeisha Johnson',
              published_at: '2023-04-10T00:00:00Z'
            }
          ];
          
          const foundArticle = staticArticles.find(a => a.id === articleId);
          if (foundArticle) {
            setArticle(foundArticle);
          } else {
            toast({
              title: "Article not found",
              description: "The requested article could not be found.",
              variant: "destructive",
            });
          }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error loading article",
          description: "Could not load the article. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [articleId, toast]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to render content with proper paragraph breaks
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cupcake-darkPink"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for could not be found.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-cupcake-darkPink text-white rounded-md hover:bg-cupcake-pink transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center text-cupcake-darkPink hover:text-cupcake-pink transition-colors mb-6"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
          
          <div className="flex items-center text-gray-500 mb-6 space-x-4">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{formatDate(article.published_at)}</span>
            </div>
            {article.author && (
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{article.author}</span>
              </div>
            )}
          </div>
          
          {article.image_url && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none text-gray-700">
            {renderContent(article.content)}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogArticlePage;
