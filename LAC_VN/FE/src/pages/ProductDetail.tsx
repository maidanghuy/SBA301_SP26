import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../api/productService';
import cartService from '../api/cartService';
import { ProductDetail as IProductDetail } from '../types/product.types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../store/cart/CartContext';
import ProductSpecifications from '../components/product/ProductSpecifications';
import { 
  ChevronLeft, 
  ChevronRight,
  Star, 
  Package, 
  Tag, 
  Layers, 
  AlertCircle, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2
} from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { updateCart, addItem } = useCart();
  const [data, setData] = useState<IProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await productService.getProductById(id);
        setData(response);
      } catch (err: any) {
        console.error('Error fetching product detail:', err);
        setError(err.response?.data?.message || 'Failed to load product details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!data || !user?.email || !id) return;
    
    if (quantity <= 0) {
      setError('Quantity must be at least 1');
      return;
    }

    if (quantity > data.product.stock) {
      setError(`Only ${data.product.stock} units available in stock`);
      return;
    }

    setIsAddingToCart(true);
    setError(null);
    setSuccessMessage(null);

    // Optimistic UI: Show success immediately
    setSuccessMessage('Product added to cart!');
    const timer = setTimeout(() => setSuccessMessage(null), 3000);

    // Update global state optimistically for header count
    addItem({
      id: Date.now(), // Temporary ID
      productId: id,
      productName: data.product.name,
      quantity: quantity,
      selected: true
    });

    try {
      const response = await cartService.addToCart({
        email: user.email,
        productId: id,
        quantity: quantity
      });
      
      updateCart(response);
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      setSuccessMessage(null);
      clearTimeout(timer);
      setError(err.response?.data?.message || 'Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'inc') {
      if (data && quantity < data.product.stock) {
        setQuantity(prev => prev + 1);
      }
    } else {
      if (quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full mb-6">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Oops! Có lỗi xảy ra</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">{error || 'Không tìm thấy sản phẩm'}</p>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all shadow-lg"
        >
          <ChevronLeft size={16} />
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const { product, specifications } = data;
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <ChevronRight size={10} />
        <Link to="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
        <ChevronRight size={10} />
        <span className="text-gray-300">{product.categoryName}</span>
        <ChevronRight size={10} />
        <span className="text-primary truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-6">
            <div className="relative aspect-square bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm group p-8">
              <img 
                src={product.image || 'https://picsum.photos/seed/product/800/800'} 
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {discount > 0 && (
                <span className="absolute top-6 left-6 px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg">
                  Giảm {discount}%
                </span>
              )}
            </div>
            
            {/* Thumbnails Placeholder */}
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${i === 0 ? 'border-primary' : 'border-gray-100 hover:border-gray-200'}`}>
                  <img src={`https://picsum.photos/seed/thumb-${i}/200/200`} alt="Thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-5">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {product.brandName}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {product.categoryName}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight uppercase tracking-tighter">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"} 
                    />
                  ))}
                  <span className="ml-2 text-sm font-black text-gray-900">{product.rating.toFixed(1)}</span>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {product.reviewsCount} Đánh giá
                </span>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-black text-primary tracking-tighter">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through font-bold">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                <Truck size={12} /> Miễn phí vận chuyển toàn quốc
              </p>
            </div>

            {/* Promotion Box */}
            <div className="bg-white rounded-2xl border-2 border-primary/10 overflow-hidden">
              <div className="px-4 py-3 bg-primary/5 border-b border-primary/10 flex items-center gap-2 text-primary">
                <Tag size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">Khuyến mãi đặc biệt</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  'Giảm thêm 5% tối đa 200.000đ khi thanh toán qua Kredivo',
                  'Thu cũ đổi mới - Trợ giá lên đến 2.000.000đ',
                  'Giảm 50% khi mua kèm phụ kiện chính hãng'
                ].map((promo, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-gray-600">
                    <div className="mt-1 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    </div>
                    <p className="font-medium">{promo}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl font-bold flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                <CheckCircle2 size={18} />
                {successMessage}
              </div>
            )}
            {error && !isLoading && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-bold flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-100 rounded-xl bg-white overflow-hidden p-1">
                  <button 
                    onClick={() => handleQuantityChange('dec')}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 text-gray-500 disabled:opacity-30 transition-colors rounded-lg"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm font-black">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange('inc')}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-50 text-gray-500 disabled:opacity-30 transition-colors rounded-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex-1 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tình trạng</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAddingToCart}
                  className="flex-1 flex flex-col items-center justify-center gap-1 px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                  <span className="text-[11px] font-black uppercase tracking-widest">Mua ngay</span>
                  <span className="text-[9px] font-medium opacity-80 uppercase tracking-widest">Giao hàng tận nơi hoặc nhận tại cửa hàng</span>
                </button>
                <button className="p-5 border-2 border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 rounded-2xl transition-all active:scale-95">
                  <Heart size={24} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
              {[
                { icon: ShieldCheck, label: 'Bảo hành chính hãng' },
                { icon: Truck, label: 'Giao hàng 24h' },
                { icon: RotateCcw, label: 'Đổi trả 30 ngày' }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                    <badge.icon size={20} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tight text-gray-400 leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Description */}
          <section className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              Đặc điểm nổi bật
            </h2>
            <div className="prose prose-indigo max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base">
                {product.description || 'Thông tin đang được cập nhật.'}
              </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Specifications */}
          <section>
            <ProductSpecifications specifications={specifications} />
          </section>

          {/* Reviews Placeholder */}
          <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Đánh giá khách hàng</h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-6 bg-gray-50 rounded-full mb-4">
                <Star size={40} className="text-gray-200" />
              </div>
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Chưa có đánh giá nào</p>
              <button className="mt-6 px-6 py-3 border-2 border-gray-100 text-[10px] font-black uppercase tracking-widest text-primary rounded-xl hover:border-primary/20 hover:bg-primary/5 transition-all">
                Viết đánh giá đầu tiên
              </button>
            </div>
          </section>
        </div>
      </div>
      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Giá bán</span>
            <span className="text-xl font-black text-primary tracking-tighter">{formatPrice(product.price)}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAddingToCart}
            className="flex-[2] px-6 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
          >
            {isAddingToCart ? 'Đang xử lý...' : 'Mua ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
    <div className="h-4 w-48 bg-gray-100 rounded mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
      <div className="lg:col-span-7">
        <div className="aspect-square bg-gray-100 rounded-2xl"></div>
      </div>
      <div className="lg:col-span-5 space-y-6">
        <div className="flex gap-4">
          <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
        </div>
        <div className="h-12 w-full bg-gray-100 rounded"></div>
        <div className="h-12 w-3/4 bg-gray-100 rounded"></div>
        <div className="h-6 w-32 bg-gray-100 rounded"></div>
        <div className="h-12 w-48 bg-gray-100 rounded"></div>
        <div className="h-24 w-full bg-gray-100 rounded-xl"></div>
        <div className="flex gap-4">
          <div className="h-14 flex-1 bg-gray-100 rounded-full"></div>
          <div className="h-14 w-14 bg-gray-100 rounded-full"></div>
          <div className="h-14 w-14 bg-gray-100 rounded-full"></div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7 space-y-8">
        <div className="h-8 w-48 bg-gray-100 rounded"></div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
        </div>
        <div className="h-64 w-full bg-gray-100 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export default ProductDetail;
