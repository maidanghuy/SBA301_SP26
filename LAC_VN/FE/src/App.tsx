import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/auth/AuthProvider';
import { CartProvider } from './store/cart/CartContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Catalog from './pages/Catalog';
import OrdersPage from './pages/OrdersPage';
import CategoryProducts from './pages/CategoryProducts';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import BrandManagement from './pages/admin/BrandManagement';
import ShippingManagement from './pages/admin/ShippingManagement';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Main Routes */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/catelog" element={<Catalog />} />
              <Route path="/categories/:id" element={<CategoryProducts />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }>
            <Route index element={<div className="bg-white border border-neutral-200 p-8 rounded-[4px] min-h-[400px] flex items-center justify-center text-neutral-400 uppercase tracking-widest font-bold">Admin Dashboard Overview</div>} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="brands" element={<BrandManagement />} />
            <Route path="shipping" element={<ShippingManagement />} />
            <Route path="users" element={<div className="bg-white border border-neutral-200 p-8 rounded-[4px] min-h-[400px] flex items-center justify-center text-neutral-400 uppercase tracking-widest font-bold">User Management</div>} />
            <Route path="settings" element={<div className="bg-white border border-neutral-200 p-8 rounded-[4px] min-h-[400px] flex items-center justify-center text-neutral-400 uppercase tracking-widest font-bold">System Settings</div>} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CartProvider>
  </AuthProvider>
);
};

export default App;
