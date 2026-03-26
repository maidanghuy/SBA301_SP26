import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '../../types/cart.types';
import { useAuth } from '../../hooks/useAuth';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  updateCart: (newCart: Cart) => void;
  addItem: (item: CartItem) => void;
  updateItemQuantity: (productId: string | number, newQuantity: number) => void;
  removeItem: (productId: string | number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [itemCount, setItemCount] = useState(0);

  // Update item count whenever cart changes
  useEffect(() => {
    if (cart && cart.items) {
      const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(total);
    } else {
      setItemCount(0);
    }
  }, [cart]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      setCart(null);
      setItemCount(0);
    }
  }, [user]);

  const updateCart = (newCart: Cart) => {
    setCart(newCart);
  };

  const addItem = (newItem: CartItem) => {
    if (!cart) {
      setCart({ items: [newItem] });
      return;
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId === newItem.productId);
    let updatedItems;

    if (existingItemIndex > -1) {
      updatedItems = cart.items.map((item, index) => 
        index === existingItemIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item
      );
    } else {
      updatedItems = [...cart.items, newItem];
    }

    setCart({ ...cart, items: updatedItems });
  };

  const updateItemQuantity = (productId: string | number, newQuantity: number) => {
    if (!cart) return;
    const updatedItems = cart.items.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart({ ...cart, items: updatedItems });
  };

  const removeItem = (productId: string | number) => {
    if (!cart) return;
    const updatedItems = cart.items.filter(item => item.productId !== productId);
    setCart({ ...cart, items: updatedItems });
  };

  const clearCart = () => {
    setCart(null);
    setItemCount(0);
  };

  return (
    <CartContext.Provider value={{ cart, itemCount, updateCart, addItem, updateItemQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
