import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Modal, message } from 'antd';
import { MergedCartItem } from '../../types/cart.types';
import cartService from '../../api/cartService';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../store/cart/CartContext';

interface CartItemProps {
  item: MergedCartItem;
  onUpdate: (productId: string | number, newQuantity: number) => void;
  onRemove: (productId: string | number) => void;
  onToggleSelect: (productId: string | number) => void;
  formatPrice: (price: number) => string;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onUpdate, 
  onRemove, 
  onToggleSelect, 
  formatPrice 
}) => {
  const { user } = useAuth();
  const { updateItemQuantity, removeItem: removeGlobalItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Ref to store the timeout for debouncing
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  // Ref to store the original quantity for rollback
  const originalQuantity = useRef<number>(item.quantity);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const syncQuantityWithBackend = async (newQuantity: number) => {
    if (!user?.email) return;
    
    setIsSyncing(true);
    try {
      await cartService.addToCart({
        email: user.email,
        productId: item.productId,
        quantity: newQuantity
      });
      // Update original quantity on success
      originalQuantity.current = newQuantity;
    } catch (error: any) {
      console.error('Failed to sync quantity:', error);
      // Rollback on error
      onUpdate(item.productId, originalQuantity.current);
      updateItemQuantity(item.productId, originalQuantity.current);
      message.error(error.response?.data?.message || 'Failed to sync cart with server');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!user?.email || isSyncing || isDeleting) return;
    
    // Prevent quantity < 1
    if (newQuantity < 1) {
      handleDelete();
      return;
    }

    // Check stock
    if (newQuantity > item.stock) {
      message.warning(`Only ${item.stock} units available in stock`);
      return;
    }

    // 1. Optimistic UI Update (Immediate)
    onUpdate(item.productId, newQuantity);
    // 2. Global State Update (for Header Count)
    updateItemQuantity(item.productId, newQuantity);

    // 3. Debounced API Call
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      syncQuantityWithBackend(newQuantity);
    }, 500); // 500ms debounce
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Remove Item',
      content: `Are you sure you want to remove ${item.productName} from your cart?`,
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        if (!user?.email) return;
        
        setIsDeleting(true);
        try {
          await cartService.deleteCartItem({
            email: user.email,
            cartItemId: item.id
          });
          onRemove(item.productId);
          removeGlobalItem(item.productId);
          message.success('Item removed from cart');
        } catch (error: any) {
          console.error('Failed to remove item:', error);
          message.error(error.response?.data?.message || 'Failed to remove item');
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border rounded-3xl transition-all duration-300 ${item.selected ? 'border-primary/20 shadow-md ring-1 ring-primary/10' : 'border-gray-100'}`}
    >
      {/* Deleting Overlay */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-3xl">
          <Loader2 className="text-primary animate-spin" size={24} />
        </div>
      )}

      {/* Checkbox */}
      <button 
        onClick={() => onToggleSelect(item.productId)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.selected ? 'bg-primary border-primary text-white' : 'border-gray-200 hover:border-primary/30'}`}
      >
        {item.selected && <CheckCircle2 size={14} />}
      </button>

      {/* Product Image */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-50 p-2">
        <img 
          src={item.image || 'https://picsum.photos/seed/product/200/200'} 
          alt={item.productName}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-black text-gray-900 truncate pr-4 uppercase tracking-tight">
            {item.productName}
          </h3>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="text-lg font-black text-primary tracking-tighter">
            {formatPrice(item.price)}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
            Kho: {item.stock}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 border-gray-100 rounded-xl bg-white overflow-hidden p-1">
              <button 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isDeleting}
                className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 disabled:opacity-30 transition-all"
              >
                <Minus size={14} />
              </button>
              <input 
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-10 text-center text-sm font-black bg-transparent border-none focus:ring-0"
                disabled={isDeleting}
              />
              <button 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isDeleting || item.quantity >= item.stock}
                className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 disabled:opacity-30 transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
            
            {/* Sync Indicator */}
            {isSyncing && (
              <RefreshCw size={14} className="text-primary animate-spin" />
            )}
          </div>

          <div className="text-right">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Thành tiền</span>
            <span className="text-lg font-black text-gray-900 tracking-tighter">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
