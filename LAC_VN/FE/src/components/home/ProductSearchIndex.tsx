import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, Filter, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFetchProducts } from '../../hooks/useFetchProducts';
import ProductCard, { ProductCardSkeleton } from './ProductCard';

const ProductSearchIndex: React.FC = () => {
  const { products, loading, error } = useFetchProducts(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Extract unique brands from products
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brandName)));
    return uniqueBrands.sort();
  }, [products]);

  // Filter products based on search and selected brand
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand ? product.brandName === selectedBrand : true;
      return matchesSearch && matchesBrand;
    });
  }, [products, searchQuery, selectedBrand]);

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-12 flex flex-col items-center text-center">
          <AlertCircle size={48} className="text-rose-500 mb-4" />
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">
            {error}
          </h2>
          <p className="text-rose-600/60 font-medium">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                Hệ thống tra cứu
              </span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
              Mục lục tìm kiếm sản phẩm
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm trong danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Brand Index / Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-4 text-gray-400">
            <Filter size={16} />
            <span className="text-[11px] font-black uppercase tracking-widest">Thương hiệu:</span>
          </div>
          <button
            onClick={() => setSelectedBrand(null)}
            className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              selectedBrand === null
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'
            }`}
          >
            Tất cả
          </button>
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                selectedBrand === brand
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-${i}`}>
                <ProductCardSkeleton />
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl"
            >
              <Search size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest">Không tìm thấy sản phẩm phù hợp</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
        <div className="flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Hiển thị: {filteredProducts.length} sản phẩm</span>
          </div>
        </div>
        <button className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-8">
          Xem báo cáo chi tiết danh mục
        </button>
      </div>
    </section>
  );
};

export default ProductSearchIndex;
