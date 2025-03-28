
import React from 'react';
import { ChevronRight } from 'lucide-react';

const Categories = () => {
  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-pacifico text-cupcake-darkBlue mb-3">Sweet Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our delicious range of handcrafted treats, made with the finest ingredients and a whole lot of love.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Cupcakes Category */}
          <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-cupcake-pink/30 to-cupcake-darkPink/80 opacity-75 transition-opacity group-hover:opacity-90"></div>
            <img 
              src="https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
              alt="Cupcakes" 
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-3xl font-pacifico text-white mb-2">Cupcakes</h3>
              <p className="text-white/90 mb-4">
                Delicious bite-sized treats perfect for any occasion.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-white font-semibold border-b-2 border-white pb-1 opacity-90 transition-all hover:opacity-100 w-fit"
              >
                Explore Collection <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Cakes Category */}
          <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-cupcake-blue/30 to-cupcake-darkBlue/80 opacity-75 transition-opacity group-hover:opacity-90"></div>
            <img 
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=789&q=80" 
              alt="Cakes" 
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-3xl font-pacifico text-white mb-2">Cakes</h3>
              <p className="text-white/90 mb-4">
                Beautifully crafted cakes for celebrations and special moments.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-white font-semibold border-b-2 border-white pb-1 opacity-90 transition-all hover:opacity-100 w-fit"
              >
                Explore Collection <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
