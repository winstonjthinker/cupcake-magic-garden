
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Categories = () => {
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
          {/* Cupcakes Category */}
          <Link to="/category/cupcakes" className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-cupcake-pink/30 to-cupcake-darkPink/80 opacity-75 transition-opacity group-hover:opacity-90"></div>
            <img 
              src="https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
              alt="Cupcakes" 
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-pacifico text-white mb-2 transition-transform duration-300 group-hover:-translate-y-1">Cupcakes</h3>
              <p className="text-white/90 mb-4 transition-opacity duration-300 group-hover:opacity-100 opacity-80">
                Delicious bite-sized treats perfect for any occasion.
              </p>
              <span 
                className="inline-flex items-center text-white font-semibold border-b-2 border-white pb-1 opacity-90 transition-all hover:opacity-100 w-fit group-hover:translate-x-2 duration-300"
              >
                Explore Collection <ChevronRight className="ml-1 h-4 w-4 animate-bounce-horizontal" />
              </span>
            </div>
          </Link>
          
          {/* Cakes Category */}
          <Link to="/category/cakes" className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-cupcake-blue/30 to-cupcake-darkBlue/80 opacity-75 transition-opacity group-hover:opacity-90"></div>
            <img 
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=789&q=80" 
              alt="Cakes" 
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-pacifico text-white mb-2 transition-transform duration-300 group-hover:-translate-y-1">Cakes</h3>
              <p className="text-white/90 mb-4 transition-opacity duration-300 group-hover:opacity-100 opacity-80">
                Beautifully crafted cakes for celebrations and special moments.
              </p>
              <span 
                className="inline-flex items-center text-white font-semibold border-b-2 border-white pb-1 opacity-90 transition-all hover:opacity-100 w-fit group-hover:translate-x-2 duration-300"
              >
                Explore Collection <ChevronRight className="ml-1 h-4 w-4 animate-bounce-horizontal" />
              </span>
            </div>
          </Link>
          
          {/* Cakesicles Category */}
          <Link to="/category/cakesicles" className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-purple-300/30 to-purple-700/80 opacity-75 transition-opacity group-hover:opacity-90"></div>
            <img 
              src="https://images.unsplash.com/photo-1596223430183-9e318f2d05e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
              alt="Cakesicles" 
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-pacifico text-white mb-2 transition-transform duration-300 group-hover:-translate-y-1">Cakesicles</h3>
              <p className="text-white/90 mb-4 transition-opacity duration-300 group-hover:opacity-100 opacity-80">
                Delicious cake pops on a stick! Perfect for parties and gifts.
              </p>
              <span 
                className="inline-flex items-center text-white font-semibold border-b-2 border-white pb-1 opacity-90 transition-all hover:opacity-100 w-fit group-hover:translate-x-2 duration-300"
              >
                Explore Collection <ChevronRight className="ml-1 h-4 w-4 animate-bounce-horizontal" />
              </span>
            </div>
          </Link>
          
          {/* Sweet Treats Category */}
          <Link to="/category/sweet-treats" className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-amber-300/30 to-amber-700/80 opacity-75 transition-opacity group-hover:opacity-90"></div>
            <img 
              src="https://images.unsplash.com/photo-1558304414-fd2249afea97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Sweet Treats" 
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-pacifico text-white mb-2 transition-transform duration-300 group-hover:-translate-y-1">Sweet Treats</h3>
              <p className="text-white/90 mb-4 transition-opacity duration-300 group-hover:opacity-100 opacity-80">
                Assortment of cookies, brownies, and other sweet delights.
              </p>
              <span 
                className="inline-flex items-center text-white font-semibold border-b-2 border-white pb-1 opacity-90 transition-all hover:opacity-100 w-fit group-hover:translate-x-2 duration-300"
              >
                Explore Collection <ChevronRight className="ml-1 h-4 w-4 animate-bounce-horizontal" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
