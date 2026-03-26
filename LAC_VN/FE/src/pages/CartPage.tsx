import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  ChevronLeft, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../store/cart/CartContext';
import cartService from '../api/cartService';
import productService from '../api/productService';
import checkoutService, { ShippingMethod } from '../api/checkoutService';
import { MergedCartItem } from '../types/cart.types';
import CartItem from '../components/cart/CartItem';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateCart } = useCart();
  const [items, setItems] = useState<MergedCartItem[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pre-fetch shipping methods to avoid delay in checkout
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await checkoutService.getShippingMethods();
        setShippingMethods(res);
      } catch (err) {
        console.error('Pre-fetching shipping methods failed:', err);
      }
    };
    fetchMethods();
  }, []);

  // Fetch cart and merge with product details
  useEffect(() => {
    const fetchCartData = async () => {
      if (!user?.email) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const cartRes = await cartService.getCartByEmail(user.email);
        const cartItems = cartRes.items || [];
        
        if (cartItems.length === 0) {
          setItems([]);
          setIsLoading(false);
          return;
        }

        const productCache: Record<string, any> = {};
        
        const mergedItems = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const productId = String(item.productId);
              let productData;
              
              if (productCache[productId]) {
                productData = productCache[productId];
              } else {
                const prodRes = await productService.getProductById(productId);
                productData = prodRes.product;
                productCache[productId] = productData;
              }

              return {
                ...item,
                price: productData.price,
                image: productData.image,
                stock: productData.stock,
              } as MergedCartItem;
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
              return {
                ...item,
                price: 0,
                image: '',
                stock: 0,
              } as MergedCartItem;
            }
          })
        );

        setItems(mergedItems);
        updateCart(cartRes);
      } catch (err: any) {
        console.error('Error loading cart:', err);
        setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [user?.email]);

  const handleUpdateQuantity = (productId: string | number, newQuantity: number) => {
    setItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (productId: string | number) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleToggleSelect = (productId: string | number) => {
    setItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleCheckout = () => {
    const selectedItems = items.filter(item => item.selected);
    if (selectedItems.length === 0) return;

    navigate('/checkout', { 
      state: { 
        selectedItems,
        shippingMethods
      } 
    });
  };

  const totals = useMemo(() => {
    const selectedItems = items.filter(item => item.selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000000 || subtotal === 0 ? 0 : 30000;
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      count: selectedItems.length
    };
  }, [items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-3xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-100 animate-pulse rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-8">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Oops! Có lỗi xảy ra</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all shadow-lg"
        >
          Thử lại ngay
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-50 rounded-full mb-10">
          <ShoppingBag size={64} className="text-gray-200" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter uppercase">Giỏ hàng trống</h2>
        <p className="text-gray-400 mb-12 max-w-sm mx-auto font-medium text-lg">
          Có vẻ như bạn chưa thêm sản phẩm nào. Hãy khám phá bộ sưu tập công nghệ mới nhất của chúng tôi.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-3 px-12 py-5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20"
        >
          <ChevronLeft size={18} />
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Giỏ hàng của bạn</h1>
          <p className="text-sm text-gray-400 font-black uppercase tracking-widest">
            Bạn đang có <span className="text-primary">{items.length}</span> sản phẩm trong giỏ
          </p>
        </div>
        <Link to="/" className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Tiếp tục mua sắm
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItem 
                key={item.productId}
                item={item}
                onUpdate={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                onToggleSelect={handleToggleSelect}
                formatPrice={formatPrice}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm sticky top-24">
            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase mb-8 pb-4 border-b border-gray-50 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Tổng đơn hàng
            </h2>
            
            <div className="space-y-5 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-black uppercase tracking-widest">Tạm tính ({totals.count} món)</span>
                <span className="text-gray-900 font-black">{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-black uppercase tracking-widest">Phí vận chuyển</span>
                <span className="text-emerald-600 font-black uppercase tracking-widest">
                  {totals.shipping === 0 ? 'Miễn phí' : formatPrice(totals.shipping)}
                </span>
              </div>
              {totals.shipping > 0 && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-tight leading-tight">
                    Mua thêm {formatPrice(5000000 - totals.subtotal)} để được miễn phí vận chuyển!
                  </p>
                </div>
              )}
            </div>

            {/* Promo Code Section */}
            <div className="mb-8">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Mã giảm giá</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Nhập mã..." 
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold focus:border-primary/20 focus:ring-0 transition-all"
                />
                <button className="px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all">
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-widest text-gray-900">Tổng cộng</span>
                <span className="text-3xl font-black text-primary tracking-tighter">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={totals.count === 0}
              className={`w-full flex flex-col items-center justify-center gap-1 py-5 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-[0.98] ${totals.count === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            >
              <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                <CreditCard size={18} />
                Tiến hành thanh toán
              </span>
              <span className="text-[9px] font-medium opacity-80 uppercase tracking-widest">An toàn & Bảo mật</span>
            </button>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-2xl text-center">
                <ShieldCheck size={20} className="text-gray-400" />
                <span className="text-[9px] font-black uppercase tracking-tight text-gray-400 leading-tight">Thanh toán bảo mật</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-2xl text-center">
                <Truck size={20} className="text-gray-400" />
                <span className="text-[9px] font-black uppercase tracking-tight text-gray-400 leading-tight">Giao hàng nhanh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
