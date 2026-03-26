import React, { useRef } from 'react';
import { Product } from '../../types/product.types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductSliderProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products, title, subtitle }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="py-12">
      <div className="flex items-end justify-between mb-8 px-4 md:px-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400 font-medium">{subtitle}</p>}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 border border-gray-200 rounded-[4px] hover:bg-gray-50 transition-colors text-gray-600"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 border border-gray-200 rounded-[4px] hover:bg-gray-50 transition-colors text-gray-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-0 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
