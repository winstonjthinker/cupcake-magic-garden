
import React from 'react';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    title: "Red Velvet Cupcake",
    description: "Rich and velvety with cream cheese frosting",
    price: "$3.99"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    title: "Chocolate Delight",
    description: "Decadent chocolate cake with chocolate ganache",
    price: "$4.99"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80",
    title: "Birthday Special",
    description: "Vanilla cake with colorful sprinkles and buttercream",
    price: "$5.99"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    title: "Strawberry Bliss",
    description: "Fresh strawberry cupcake with strawberry frosting",
    price: "$3.99"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    title: "Lemon Delight",
    description: "Tangy lemon cake with lemon zest frosting",
    price: "$4.49"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=936&q=80",
    title: "Signature Swirl",
    description: "Our signature cupcake with special frosting",
    price: "$5.49"
  },
];

const ProductShowcase = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-cupcake-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-pacifico text-cupcake-darkPink mb-3">Top Trending Treats</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most popular handcrafted creations that customers can't get enough of.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              image={product.image}
              title={product.title}
              description={product.description}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
