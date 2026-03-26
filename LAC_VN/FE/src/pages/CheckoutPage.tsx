import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck,
  Package,
  AlertCircle,
  Loader2,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../store/cart/CartContext';
import checkoutService, { ShippingMethod, CreateOrderResponse } from '../api/checkoutService';
import productService from '../api/productService';
import { MergedCartItem } from '../types/cart.types';

type CheckoutStep = 'info' | 'shipping' | 'payment' | 'success';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  
  // Get data passed from CartPage
  const state = location.state as { 
    selectedItems?: MergedCartItem[]; 
    shippingMethods?: ShippingMethod[];
  } | null;

  const [step, setStep] = useState<CheckoutStep>('info');
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(state?.shippingMethods || []);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<CreateOrderResponse | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [mergedItems, setMergedItems] = useState<MergedCartItem[]>(state?.selectedItems || []);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.email?.split('@')[0] || '',
    phone: '',
    address: '',
    city: '',
    email: user?.email || '',
    note: '',
    shippingMethodId: 0,
    paymentMethod: 'bank'
  });

  useEffect(() => {
    const fetchMethods = async () => {
      // Only fetch if not passed from state
      if (shippingMethods.length > 0) {
        if (formData.shippingMethodId === 0) {
          setFormData(prev => ({ ...prev, shippingMethodId: shippingMethods[0].id }));
        }
        return;
      }

      setIsLoadingMethods(true);
      try {
        const response = await checkoutService.getShippingMethods();
        setShippingMethods(response);
        if (response.length > 0) {
          setFormData(prev => ({ ...prev, shippingMethodId: response[0].id }));
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error);
      } finally {
        setIsLoadingMethods(false);
      }
    };

    const fetchProductDetails = async () => {
      // Only fetch if not passed from state
      if (mergedItems.length > 0) return;

      // Only get items that are selected in the cart
      const selected = cart?.items?.filter(item => item.selected) || [];
      if (selected.length === 0) {
        setMergedItems([]);
        return;
      }
      
      setIsLoadingItems(true);
      try {
        const merged = await Promise.all(
          selected.map(async (item) => {
            try {
              const product = await productService.getProductById(item.productId.toString());
              return {
                ...item,
                price: product.product.price,
                image: product.product.image || '',
                stock: product.product.stock
              } as MergedCartItem;
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
              return { ...item, price: 0, image: '', stock: 0 } as MergedCartItem;
            }
          })
        );
        setMergedItems(merged);
      } catch (error) {
        console.error('Error merging cart items:', error);
      } finally {
        setIsLoadingItems(false);
      }
    };

    fetchMethods();
    fetchProductDetails();
  }, [cart?.items, shippingMethods.length, mergedItems.length]);

  const selectedItems = useMemo(() => {
    return mergedItems;
  }, [mergedItems]);

  const totals = useMemo(() => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedMethod = shippingMethods.find(m => m.id === formData.shippingMethodId);
    const shipping = selectedMethod ? selectedMethod.price : 0;
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      count: selectedItems.length
    };
  }, [selectedItems, formData.shippingMethodId, shippingMethods]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = async () => {
    if (step === 'info') setStep('shipping');
    else if (step === 'shipping') {
      setIsProcessingOrder(true);
      try {
        const orderItems = selectedItems.map(item => ({
          product_id: item.productId,
          quantity: item.quantity
        }));

        const response = await checkoutService.createOrder({
          order_items: orderItems,
          shipping_info: {
            full_name: formData.fullName,
            address: `${formData.address}, ${formData.city}`,
            phone: formData.phone,
            email: formData.email
          },
          note: formData.note,
          shipping_method_id: formData.shippingMethodId
        });

        setQrCode(response.qrCode);
        setPaymentDetails(response);
        setStep('payment');
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
      } finally {
        setIsProcessingOrder(false);
      }
    }
    else if (step === 'payment') {
      if (paymentDetails?.orderCode) {
        setIsCheckingStatus(true);
        try {
          const response = await checkoutService.getPaymentStatus(paymentDetails.orderCode);
          if (response.status === 'PAID') {
            setStep('success');
            clearCart();
            // Automatically redirect to orders after 3 seconds
            setTimeout(() => {
              navigate('/orders');
            }, 3000);
          } else {
            alert('Thanh toán chưa được xác nhận. Vui lòng kiểm tra lại sau khi đã chuyển khoản.');
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          alert('Có lỗi xảy ra khi kiểm tra trạng thái thanh toán. Vui lòng thử lại.');
        } finally {
          setIsCheckingStatus(false);
        }
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 'shipping') setStep('info');
    else if (step === 'payment') setStep('shipping');
  };

  if (selectedItems.length === 0 && step !== 'success') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-8">
          <Package size={40} className="text-gray-200" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Không có sản phẩm để thanh toán</h2>
        <p className="text-gray-400 mb-10 max-w-sm mx-auto font-medium">Vui lòng chọn sản phẩm trong giỏ hàng trước khi tiến hành thanh toán.</p>
        <Link to="/cart" className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all shadow-lg">
          <ChevronLeft size={16} /> Quay lại giỏ hàng
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full mb-8">
          <CheckCircle2 size={64} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Đặt hàng thành công!</h1>
        <p className="text-gray-500 mb-10 text-lg">Cảm ơn bạn đã tin tưởng LAC VN. Mã đơn hàng của bạn là <span className="font-black text-primary">#LAC-{Math.floor(Math.random() * 1000000)}</span>. Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link to="/" className="px-8 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20">Quay về trang chủ</Link>
          <Link to="/orders" className="px-8 py-4 border-2 border-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-400 rounded-2xl hover:border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">Xem đơn hàng của tôi</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      {/* Checkout Steps */}
      <div className="flex items-center justify-center mb-16 overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide">
        {[
          { id: 'info', label: 'Thông tin', icon: MapPin },
          { id: 'shipping', label: 'Vận chuyển', icon: Truck },
          { id: 'payment', label: 'Thanh toán', icon: CreditCard }
        ].map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-3 ${step === s.id ? 'text-primary' : i < ['info', 'shipping', 'payment'].indexOf(step) ? 'text-emerald-600' : 'text-gray-300'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${step === s.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : i < ['info', 'shipping', 'payment'].indexOf(step) ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
                {i < ['info', 'shipping', 'payment'].indexOf(step) ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest">{s.label}</span>
            </div>
            {i < 2 && (
              <div className={`w-12 h-0.5 mx-4 rounded-full ${i < ['info', 'shipping', 'payment'].indexOf(step) ? 'bg-emerald-600' : 'bg-gray-100'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {step === 'info' && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-8"
              >
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-4">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Thông tin nhận hàng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Họ và tên</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A" 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold focus:border-primary/20 focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Số điện thoại</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0901 234 567" 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold focus:border-primary/20 focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com" 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold focus:border-primary/20 focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Địa chỉ nhận hàng</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Số nhà, tên đường, phường/xã..." 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold focus:border-primary/20 focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tỉnh / Thành phố</label>
                    <select 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold focus:border-primary/20 focus:ring-0 transition-all appearance-none"
                    >
                      <option value="">Chọn tỉnh thành</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="hn">Hà Nội</option>
                      <option value="dn">Đà Nẵng</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ghi chú (tùy chọn)</label>
                    <textarea 
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Ghi chú thêm về đơn hàng..." 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold focus:border-primary/20 focus:ring-0 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'shipping' && (
              <motion.div 
                key="shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-8"
              >
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-4">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Phương thức vận chuyển
                </h2>
                <div className="space-y-4">
                  {isLoadingMethods ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <Loader2 className="animate-spin text-primary" size={32} />
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Đang tải phương thức vận chuyển...</p>
                    </div>
                  ) : (
                    shippingMethods.map((method) => (
                      <label 
                        key={method.id}
                        className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.shippingMethodId === method.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="shippingMethodId" 
                            checked={formData.shippingMethodId === method.id}
                            onChange={() => setFormData(prev => ({ ...prev, shippingMethodId: method.id }))}
                            className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                          />
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">{method.name}</h3>
                            <p className="text-xs text-gray-400 font-medium">{method.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-primary">{method.price === 0 ? 'Miễn phí' : formatPrice(method.price)}</span>
                      </label>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-8"
              >
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-4">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Thanh toán đơn hàng
                </h2>
                
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="text-center mb-8">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Quét mã QR để thanh toán</p>
                    <h3 className="text-2xl font-black text-primary tracking-tighter">{formatPrice(paymentDetails?.amount || totals.total)}</h3>
                  </div>
                  
                  {qrCode ? (
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-gray-100">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`} 
                          alt="Payment QR Code" 
                          className="w-64 h-64"
                        />
                      </div>
                      
                      {paymentDetails && (
                        <div className="space-y-4 text-left">
                          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Chủ tài khoản</p>
                            <p className="text-sm font-black text-gray-900 uppercase">{paymentDetails.accountName}</p>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Số tài khoản</p>
                            <p className="text-sm font-black text-primary">{paymentDetails.accountNumber}</p>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nội dung chuyển khoản</p>
                            <p className="text-sm font-black text-gray-900">{paymentDetails.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-64 h-64 bg-gray-100 rounded-3xl flex items-center justify-center">
                      <QrCode size={48} className="text-gray-300 animate-pulse" />
                    </div>
                  )}
                  
                  <div className="mt-8 space-y-4 text-center max-w-sm">
                    <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full justify-center">
                      <ShieldCheck size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Giao dịch an toàn & bảo mật</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      Vui lòng sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR phía trên. Sau khi thanh toán thành công, nhấn nút kiểm tra trạng thái bên dưới.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-8">
            {step !== 'info' ? (
              <button 
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all"
              >
                <ChevronLeft size={16} /> Quay lại
              </button>
            ) : (
              <Link 
                to="/cart"
                className="flex items-center gap-2 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all"
              >
                <ChevronLeft size={16} /> Quay lại giỏ hàng
              </Link>
            )}
            <button 
              onClick={handleNextStep}
              disabled={isProcessingOrder || isCheckingStatus || (step === 'shipping' && shippingMethods.length === 0)}
              className="px-12 py-5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingOrder || isCheckingStatus ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Đang xử lý...
                </>
              ) : (
                <>
                  {step === 'payment' ? 'Kiểm tra trạng thái thanh toán' : 'Tiếp tục'}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar: Order Summary */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm sticky top-24">
            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase mb-8 pb-4 border-b border-gray-50 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Đơn hàng ({totals.count})
            </h2>

            <div className="max-h-[300px] overflow-y-auto pr-2 mb-8 space-y-4 scrollbar-hide">
              {selectedItems.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 p-1">
                    <img src={item.image || 'https://picsum.photos/seed/product/100/100'} alt={item.productName} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-gray-900 truncate uppercase tracking-tight">{item.productName}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] font-black text-gray-400">x{item.quantity}</span>
                      <span className="text-xs font-black text-primary">{formatPrice(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 mb-8 pt-8 border-t border-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-black uppercase tracking-widest">Tạm tính</span>
                <span className="text-gray-900 font-black">{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-black uppercase tracking-widest">Phí vận chuyển</span>
                <span className="text-emerald-600 font-black uppercase tracking-widest">
                  {totals.shipping === 0 ? 'Miễn phí' : formatPrice(totals.shipping)}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-widest text-gray-900">Tổng cộng</span>
                <span className="text-3xl font-black text-primary tracking-tighter">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
