import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  MapPin, 
  Truck,
  X,
  ExternalLink,
  Loader2,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import orderService, { OrderListItem, OrderDetail } from '../api/orderService';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getOrders();
      setOrders(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    setIsDetailLoading(true);
    setShowModal(true);
    try {
      const response = await orderService.getOrderById(id);
      setSelectedOrder(response);
    } catch (error) {
      console.error('Error fetching order detail:', error);
      setShowModal(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"><Clock size={12} /> Chờ xử lý</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"><CheckCircle2 size={12} /> Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"><AlertCircle size={12} /> Đã hủy</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"><CreditCard size={12} /> Đã thanh toán</span>;
      case 'UNPAID':
        return <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"><CreditCard size={12} /> Chưa thanh toán</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Lịch sử giao dịch</h1>
          <p className="text-gray-400 font-medium">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <Package size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng đơn hàng</p>
              <p className="text-xl font-black text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Đang tải lịch sử giao dịch...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-24 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-8">
            <Package size={40} className="text-gray-200" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Bạn chưa có đơn hàng nào</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium">Hãy bắt đầu mua sắm để trải nghiệm các sản phẩm tuyệt vời của LAC VN.</p>
          <a href="/catelog" className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all shadow-lg">
            Mua sắm ngay
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer"
              onClick={() => handleViewDetail(order.id)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                    <Package size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase">Đơn hàng #{order.id.split('-')[0]}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDate(order.createdAt)}</span>
                      <span className="flex items-center gap-1.5"><CreditCard size={14} /> {order.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng cộng</p>
                    <p className="text-2xl font-black text-primary tracking-tighter">{formatPrice(order.total)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-gray-50 flex items-center justify-center text-gray-300 group-hover:border-primary/20 group-hover:text-primary transition-all">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                    <Package size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Chi tiết đơn hàng</h2>
                    {selectedOrder && <p className="text-xs font-black text-gray-400 uppercase tracking-widest">#{selectedOrder.id}</p>}
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                {isDetailLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Đang tải chi tiết đơn hàng...</p>
                  </div>
                ) : selectedOrder ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-7 space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          Sản phẩm ({selectedOrder.items.length})
                        </h3>
                        <div className="space-y-4">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                              <div className="w-20 h-20 bg-white rounded-2xl border border-gray-100 p-1 shrink-0">
                                <img src={item.productImage} alt={item.productName} className="w-full h-full object-contain" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight truncate mb-1">{item.productName}</h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black text-gray-400">x{item.quantity}</span>
                                  <span className="text-sm font-black text-primary">{formatPrice(item.price)}</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thành tiền</span>
                                  <span className="text-sm font-black text-gray-900">{formatPrice(item.totalPrice)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                        <h3 className="text-[11px] font-black text-primary uppercase tracking-widest mb-4">Ghi chú đơn hàng</h3>
                        <p className="text-sm text-gray-600 font-medium italic">"{selectedOrder.note || 'Không có ghi chú'}"</p>
                      </div>

                      {/* Payment QR Code for Unpaid Orders */}
                      {selectedOrder.paymentStatus.toUpperCase() === 'UNPAID' && (selectedOrder.qrCode || selectedOrder.checkoutUrl) && (
                        <div className="space-y-4">
                          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <QrCode size={14} /> Thanh toán đơn hàng
                          </h3>
                          <div className="p-8 bg-white border border-primary/20 rounded-[32px] shadow-xl shadow-primary/5 flex flex-col items-center text-center">
                            {selectedOrder.qrCode && (
                              <div className="p-4 bg-white border-4 border-neutral-50 rounded-3xl mb-6">
                                <QRCodeSVG 
                                  value={selectedOrder.qrCode} 
                                  size={200}
                                  level="H"
                                  includeMargin={false}
                                />
                              </div>
                            )}
                            <p className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-tight">Quét mã để thanh toán</p>
                            <p className="text-xs text-gray-400 font-medium mb-6 max-w-[200px]">Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR</p>
                            
                            {selectedOrder.checkoutUrl && (
                              <a 
                                href={selectedOrder.checkoutUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                              >
                                <ExternalLink size={14} /> Mở trang thanh toán
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Info */}
                    <div className="lg:col-span-5 space-y-8">
                      {/* Status Summary */}
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</h3>
                        <div className="flex flex-wrap gap-3">
                          {getStatusBadge(selectedOrder.status)}
                          {getPaymentBadge(selectedOrder.paymentStatus)}
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={14} /> Thông tin nhận hàng
                        </h3>
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-3">
                          <p className="text-sm font-black text-gray-900 uppercase">{selectedOrder.shippingInfo.full_name}</p>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">{selectedOrder.shippingInfo.address}</p>
                          <p className="text-xs text-gray-500 font-medium">SĐT: {selectedOrder.shippingInfo.phone}</p>
                          <p className="text-xs text-gray-500 font-medium">Email: {selectedOrder.shippingInfo.email}</p>
                        </div>
                      </div>

                      {/* Shipping Method */}
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Truck size={14} /> Vận chuyển
                        </h3>
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl flex items-center justify-between">
                          <div>
                            <p className="text-sm font-black text-gray-900 uppercase">{selectedOrder.shippingMethodName}</p>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Giao hàng tiêu chuẩn</p>
                          </div>
                          <span className="text-sm font-black text-gray-900">{selectedOrder.shippingFee === 0 ? 'Miễn phí' : formatPrice(selectedOrder.shippingFee)}</span>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tổng kết thanh toán</h3>
                        <div className="p-8 bg-gray-900 text-white rounded-[32px] space-y-4 shadow-xl shadow-gray-900/20">
                          <div className="flex justify-between items-center opacity-60">
                            <span className="text-[10px] font-black uppercase tracking-widest">Tạm tính</span>
                            <span className="text-sm font-black">{formatPrice(selectedOrder.total - selectedOrder.shippingFee)}</span>
                          </div>
                          <div className="flex justify-between items-center opacity-60">
                            <span className="text-[10px] font-black uppercase tracking-widest">Phí vận chuyển</span>
                            <span className="text-sm font-black">{selectedOrder.shippingFee === 0 ? 'Miễn phí' : formatPrice(selectedOrder.shippingFee)}</span>
                          </div>
                          <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                            <span className="text-[11px] font-black uppercase tracking-widest">Tổng cộng</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">{formatPrice(selectedOrder.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-4 shrink-0">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-8 py-4 bg-white border border-gray-200 text-[11px] font-black uppercase tracking-widest text-gray-400 rounded-2xl hover:border-gray-300 hover:text-gray-900 transition-all"
                >
                  Đóng
                </button>
                <button className="px-8 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                  <ExternalLink size={14} /> In hóa đơn
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
