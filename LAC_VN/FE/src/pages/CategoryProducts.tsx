import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Loader2, Package } from 'lucide-react';
import productService from '../api/productService';
import { Product, Category } from '../types/product.types';
import ProductCard from '../components/product/ProductCard';

const CategoryProducts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // Fetch products by category
        const response = await productService.getProductsByCategory(Number(id));
        setProducts(response);

        // Fetch categories to find the name
        const catRes = await productService.getCategories();
        const found = catRes.find(c => c.id === Number(id));
        setCategory(found || null);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase font-black tracking-widest">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-neutral-900">Danh mục</span>
          {category && (
            <>
              <span>/</span>
              <span className="text-neutral-900">{category.nameVn}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">
          {category ? category.nameVn : 'Danh mục sản phẩm'}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 size={48} className="text-primary animate-spin" />
          <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400">Đang tải sản phẩm...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white border border-neutral-200 rounded-3xl shadow-sm">
          <div className="bg-neutral-50 p-8 rounded-full mb-6">
            <Package size={64} className="text-neutral-200" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tighter mb-2">Không có sản phẩm</h3>
          <p className="text-sm text-neutral-400 font-medium mb-8">Danh mục này hiện chưa có sản phẩm nào.</p>
          <Link 
            to="/"
            className="px-8 py-4 bg-neutral-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-all shadow-xl"
          >
            Quay lại trang chủ
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
