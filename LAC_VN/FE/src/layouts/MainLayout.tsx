import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../store/cart/CartContext';
import { LogOut, Monitor, User as UserIcon, Shield, ShoppingBag, Package } from 'lucide-react';
import SearchBar from '../components/layout/SearchBar';
import CategoryDropdown from '../components/layout/CategoryDropdown';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
      {/* Header */}
      <header className="h-20 border-b border-neutral-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Monitor size={24} className="text-white" />
            </div>
            <span className="hidden md:block font-black tracking-tighter text-2xl uppercase text-neutral-900">CompTech</span>
          </Link>

          <div className="flex-1 max-w-md flex items-center gap-4">
            <div className="hidden lg:block">
              <CategoryDropdown />
            </div>
            <SearchBar />
          </div>
        </div>

        <nav className="flex items-center gap-3 md:gap-6 ml-4">
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100">
              <Shield size={16} />
              Admin Panel
            </Link>
          )}

          <Link to="/orders" className="p-3 bg-neutral-50 hover:bg-primary/10 rounded-xl transition-all text-neutral-500 hover:text-primary group border border-neutral-100" title="Order History">
            <Package size={20} />
          </Link>

          <Link to="/cart" className="relative p-3 bg-neutral-50 hover:bg-primary/10 rounded-xl transition-all text-neutral-500 hover:text-primary group border border-neutral-100" title="Shopping Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-lg">
                {itemCount}
              </span>
            )}
          </Link>
          
          <div className="h-8 w-[1px] bg-neutral-200 mx-2"></div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black tracking-tight leading-none">{user?.name}</span>
              <span className="text-[10px] text-neutral-400 uppercase font-black tracking-widest mt-1">{user?.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 md:p-3 bg-neutral-50 hover:bg-rose-50 rounded-xl transition-all text-neutral-400 hover:text-rose-500 border border-neutral-100"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-neutral-200 bg-white text-center">
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          &copy; 2026 CompTech Technology Management System
        </p>
      </footer>
    </div>
  );
};

export default MainLayout;
