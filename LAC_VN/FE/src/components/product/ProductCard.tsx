import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product.types';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'motion/react';

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

  const placeholderImage = 'https://via.placeholder.com/300x300?text=No+Image';
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 tech-card-hover flex flex-col h-full"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-md">
            Giảm {discount}%
          </span>
        )}
        {product.isNew && (
          <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-md">
            Mới
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-primary transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300">
        <Heart size={16} />
      </button>

      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-white block p-4">
        <img
          src={product.image || placeholderImage}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            {product.brandName}
          </span>
        </div>
        
        <Link 
          to={`/products/${product.id}`}
          className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug h-10"
        >
          {product.name}
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-black text-primary">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-600">{product.rating}</span>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-primary transition-all active:scale-95">
              <ShoppingCart size={12} />
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
