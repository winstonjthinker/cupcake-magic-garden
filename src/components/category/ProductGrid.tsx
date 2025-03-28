
import React from 'react';
import EnhancedProductCard from '@/components/EnhancedProductCard';

interface ProductGridProps {
  products: any[];
  categoryId?: string;
}

const ProductGrid = ({ products, categoryId }: ProductGridProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <EnhancedProductCard
              key={product.id}
              image={product.image_url || `https://source.unsplash.com/random/300x300/?${product.name.replace(/\s+/g, '-').toLowerCase()}`}
              title={product.name}
              description={product.description || ""}
              price={`$${parseFloat(product.price).toFixed(2)}`}
              delayAnimation={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found for this category.</p>
        </div>
      )}
      
      {/* Bulk order notice for cakesicles */}
      {categoryId === 'cakesicles' && (
        <div className="mt-12 bg-purple-100 rounded-xl p-6 animate-pulse-slow">
          <h3 className="text-xl text-purple-800 font-semibold mb-2">Bulk Order Discount!</h3>
          <p className="text-purple-700">
            Order 20 or more cakesicles and pay only $2.00 each. Perfect for parties, events, and special celebrations!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
