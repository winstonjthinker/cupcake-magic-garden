
import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const articles = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1557925923-cd4648e211a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80",
    title: "The Secret to Perfect Cupcake Frosting",
    excerpt: "Learn the techniques professional bakers use to create beautiful cupcake frosting every time.",
    date: "June 15, 2023"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80",
    title: "5 Birthday Cake Ideas for Kids",
    excerpt: "Make your child's birthday special with these creative and fun cake designs they'll love.",
    date: "May 22, 2023"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1586985290301-8db40143d525?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=970&q=80",
    title: "Behind the Scenes: A Day at LaKeisha's Bakery",
    excerpt: "Take a peek behind the curtain and see how our delicious treats are made with love.",
    date: "April 10, 2023"
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-16 bg-cupcake-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cupcake-pink rounded-full opacity-10"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cupcake-blue rounded-full opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-pacifico text-cupcake-darkBlue mb-3">Baking Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover recipes, baking tips, and stories from our kitchen to yours.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <div key={article.id} className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="p-5">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar size={14} className="mr-1" />
                  <span>{article.date}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-cupcake-darkPink transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {article.excerpt}
                </p>
                
                <Link
                  to={`/blog/${article.id}`}
                  className="inline-flex items-center text-cupcake-darkBlue font-medium hover:text-cupcake-blue transition-colors"
                >
                  Read More <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center text-cupcake-darkPink font-semibold hover:text-cupcake-pink transition-colors border-b-2 border-cupcake-pink pb-1"
          >
            View All Articles <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
