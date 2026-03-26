import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, Loader2, Search, Filter, X } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { Product, ProductQueryParams } from '../types/product.types';
import productService from '../api/productService';
import FilterSidebar from '../components/catalog/FilterSidebar';

const Catalog: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [maxPriceFound, setMaxPriceFound] = useState(100000000);

  // Extract all query params
  const query = searchParams.get('q') || '';
  const brandId = searchParams.get('brandId');
  const categoryId = searchParams.get('categoryId');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const isNew = searchParams.get('isNew');
  const isFeatured = searchParams.get('isFeatured');
  const minRating = searchParams.get('minRating');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: ProductQueryParams & { limit?: number } = {
          keyword: query,
          limit: 20 // Higher limit for catalog
        };

        if (brandId) params.brandId = Number(brandId);
        if (categoryId) params.categoryId = Number(categoryId);
        if (minPrice) params.minPrice = Number(minPrice);
        if (maxPrice) params.maxPrice = Number(maxPrice);
        if (isNew) params.isNew = isNew === 'true';
        if (isFeatured) params.isFeatured = isFeatured === 'true';
        if (minRating) params.minRating = Number(minRating);

        const response = await productService.searchSuggestions(params);
        setProducts(response);

        // Update maxPriceFound based on results if not already filtering by maxPrice
        if (response.length > 0 && !maxPrice) {
          const max = Math.max(...response.map(p => p.price));
          setMaxPriceFound(max);
        }
      } catch (error) {
        console.error('Error fetching catalog products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query, brandId, categoryId, minPrice, maxPrice, isNew, isFeatured, minRating]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 sticky top-24 h-[calc(100vh-120px)] rounded-3xl overflow-hidden shadow-sm border border-neutral-200">
        <FilterSidebar maxPriceFound={maxPriceFound} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-xs animate-in slide-in-from-left duration-300">
            <FilterSidebar maxPriceFound={maxPriceFound} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase font-black tracking-widest">
              <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
              <span>/</span>
              <span className="text-neutral-900">Catalog</span>
            </div>
            <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">
              {query ? `Kết quả cho: "${query}"` : 'Tất cả sản phẩm'}
            </h1>
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
              Tìm thấy {products.length} sản phẩm
            </p>
          </div>

          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
          >
            <Filter size={14} />
            Bộ lọc nâng cao
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={48} className="text-primary animate-spin" />
            <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400">Đang tải sản phẩm...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white border border-neutral-200 rounded-3xl shadow-sm">
            <div className="bg-neutral-50 p-8 rounded-full mb-6">
              <Search size={64} className="text-neutral-200" />
            </div>
            <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tighter mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-sm text-neutral-400 font-medium mb-8">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
            <Link 
              to="/"
              className="px-8 py-4 bg-neutral-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-all shadow-xl"
            >
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
