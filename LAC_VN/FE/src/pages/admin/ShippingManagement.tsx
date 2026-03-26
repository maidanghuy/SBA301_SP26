import React, { useState, useEffect } from 'react';
import shippingService from '../../api/shippingService';
import { ShippingMethod } from '../../types/product.types';
import { Plus, Edit2, Trash2, Loader2, Search, X, Truck, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ShippingManagement: React.FC = () => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<ShippingMethod | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Omit<ShippingMethod, 'id'>>({
    name: '',
    price: 0,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    setIsLoading(true);
    try {
      const data = await shippingService.getShippingMethods();
      setShippingMethods(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch shipping methods');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (method: ShippingMethod | null = null) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        name: method.name || '',
        price: method.price || 0,
        description: method.description || ''
      });
    } else {
      setEditingMethod(null);
      setFormData({
        name: '',
        price: 0,
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingMethod) {
        await shippingService.updateShippingMethod(editingMethod.id, { ...formData, id: editingMethod.id });
      } else {
        await shippingService.createShippingMethod(formData);
      }
      setIsModalOpen(false);
      fetchShippingMethods();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save shipping method');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!methodToDelete) return;
    setIsSubmitting(true);
    try {
      await shippingService.deleteShippingMethod(methodToDelete.id);
      setIsDeleting(false);
      setMethodToDelete(null);
      fetchShippingMethods();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete shipping method');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const filteredMethods = shippingMethods.filter(method => 
    method.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Quản lý vận chuyển</h1>
          <p className="text-sm text-gray-500 font-medium">Thêm, sửa, xóa các phương thức vận chuyển trong hệ thống</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
        >
          <Plus size={16} />
          Thêm phương thức
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-2xl">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm phương thức vận chuyển..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900/5 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phương thức</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mô tả</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-gray-300 mb-2" size={32} />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang tải dữ liệu...</span>
                  </td>
                </tr>
              ) : filteredMethods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Không tìm thấy phương thức nào</span>
                  </td>
                </tr>
              ) : (
                filteredMethods.map((method) => (
                  <tr key={method.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-gray-400">#{method.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <Truck size={16} />
                        </div>
                        <span className="text-sm font-bold text-gray-900">{method.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-black ${method.price === 0 ? 'text-emerald-600' : 'text-primary'}`}>
                        {method.price === 0 ? 'Miễn phí' : formatPrice(method.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 font-medium line-clamp-1">{method.description}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(method)}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setMethodToDelete(method);
                            setIsDeleting(true);
                          }}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                  {editingMethod ? 'Cập nhật phương thức' : 'Thêm phương thức mới'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên phương thức</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá vận chuyển (VND)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input
                        required
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mô tả</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900/5 transition-all resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 hover:text-gray-900 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : (editingMethod ? 'Cập nhật' : 'Thêm mới')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Xóa */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsDeleting(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Xác nhận xóa?</h2>
              <p className="text-sm text-gray-500 font-medium mb-8">
                Bạn có chắc chắn muốn xóa phương thức <span className="font-bold text-gray-900">"{methodToDelete?.name}"</span>? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="flex-1 py-4 bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-rose-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/10 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Xóa ngay'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShippingManagement;
