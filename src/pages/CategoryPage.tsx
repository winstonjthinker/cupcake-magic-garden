
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryHeader from '@/components/category/CategoryHeader';
import ProductGrid from '@/components/category/ProductGrid';
import ConfettiEffect from '@/components/effects/ConfettiEffect';
import useCategoryData from '@/hooks/useCategoryData';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { loading, category, products } = useCategoryData(categoryId);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // If no category found, show error
  if (!category && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Category not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col page-enter page-enter-active">
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Add confetti effect */}
        <ConfettiEffect />
        
        {/* Hero Section */}
        <CategoryHeader 
          categoryId={categoryId} 
          categoryName={category.name || category.title} 
          description={category.description} 
        />
        
        {/* Products Grid */}
        <ProductGrid products={products} categoryId={categoryId} />
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
