import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ChevronRight, 
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Loader2
} from 'lucide-react';
import productService from '../api/productService';
import { Product } from '../types/product.types';
import ProductCard from '../components/product/ProductCard';
import CategorySidebar from '../components/home/CategorySidebar';
import HomeBanner from '../components/home/HomeBanner';
import SpecialOffers from '../components/home/SpecialOffers';

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const keyword = searchParams.get('keyword');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = { size: 12 };
        if (categoryId) params.categoryId = Number(categoryId);
        if (keyword) params.keyword = keyword;

        const response = await productService.getProducts(params);
        setProducts(response.content);

        // If categoryId is present, find its name for the title
        if (categoryId) {
          const catRes = await productService.getCategories();
          const cat = catRes.find(c => c.id === Number(categoryId));
          setCategoryName(cat?.nameVn || null);
        } else {
          setCategoryName(null);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, keyword]);

  return (
    <div className="space-y-12 pb-20">
      {/* Top Section: Sidebar | Banner | Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Category Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <CategorySidebar />
        </div>

        {/* Middle: Banner Slide */}
        <div className="col-span-1 lg:col-span-6">
          <HomeBanner />
        </div>

        {/* Right: Special Offers */}
        <div className="hidden lg:block lg:col-span-3">
          <SpecialOffers />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Truck, title: 'Giao hàng nhanh', desc: 'Trong vòng 24h' },
          { icon: ShieldCheck, title: 'Chính hãng', desc: 'Bảo hành 12 tháng' },
          { icon: RotateCcw, title: 'Đổi trả dễ dàng', desc: 'Trong vòng 30 ngày' },
          { icon: Zap, title: 'Ưu đãi cực sốc', desc: 'Mỗi ngày một deal' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-neutral-50 rounded-lg text-primary">
              <item.icon size={24} />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-tight text-neutral-900">{item.title}</h4>
              <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Product List */}
      <section id="products" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              {keyword ? `Kết quả tìm kiếm: "${keyword}"` : categoryName ? `Danh mục: ${categoryName}` : 'Tất cả sản phẩm'}
            </h2>
            <p className="text-xs text-neutral-400 font-black uppercase tracking-widest ml-5">
              {products.length} sản phẩm được tìm thấy
            </p>
          </div>
          
          {(categoryId || keyword) && (
            <Link 
              to="/"
              className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-8 transition-all"
            >
              Xóa bộ lọc
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={48} className="text-primary animate-spin" />
            <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400">Đang tải dữ liệu...</p>
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
              <ShoppingBag size={64} className="text-neutral-200" />
            </div>
            <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tighter mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-sm text-neutral-400 font-medium mb-8">Thử tìm kiếm với từ khóa khác hoặc quay lại trang chủ.</p>
            <Link 
              to="/"
              className="px-8 py-4 bg-neutral-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-all shadow-xl"
            >
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-neutral-900 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <img src="https://picsum.photos/seed/tech-pattern/1920/1080" alt="Pattern" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-[11px] font-black uppercase tracking-widest text-primary mb-4 inline-block">Newsletter</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Đăng ký nhận tin</h2>
          <p className="text-neutral-400 mb-10 text-sm font-medium">Nhận ngay voucher giảm giá 10% cho đơn hàng đầu tiên và cập nhật các chương trình khuyến mãi sớm nhất.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Địa chỉ email của bạn" 
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary transition-all"
            />
            <button className="px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20">
              Đăng ký ngay
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
