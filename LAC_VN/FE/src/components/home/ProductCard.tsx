import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20">
            NEW
          </span>
        )}
        {product.isFeatured && (
          <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-rose-500/20">
            HOT
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image || 'https://picsum.photos/seed/product/400/400'}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/tech/400/400';
          }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-900 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={16} />
            Xem chi tiết
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-black text-gray-900">{product.rating}</span>
            <span className="text-[11px] font-medium text-gray-400">({product.reviewsCount})</span>
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">
            {product.brandName}
          </span>
        </div>

        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-black text-primary tracking-tighter">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-5 space-y-4">
      <div className="h-3 bg-gray-100 rounded-full w-1/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded-full w-full" />
        <div className="h-4 bg-gray-100 rounded-full w-2/3" />
      </div>
      <div className="h-6 bg-gray-100 rounded-full w-1/2 mt-auto" />
    </div>
  </div>
);

export default ProductCard;
