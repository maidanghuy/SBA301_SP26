import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, LayoutDashboard, Settings, Users, Shield, ArrowLeft, Layers, Tag, Truck } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Product Management', path: '/admin/products', icon: LayoutDashboard },
    { label: 'Category Management', path: '/admin/categories', icon: Layers },
    { label: 'Brand Management', path: '/admin/brands', icon: Tag },
    { label: 'Shipping Management', path: '/admin/shipping', icon: Truck },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Shield size={20} className="mr-2 text-neutral-400" />
          <span className="font-bold tracking-tighter text-lg uppercase">Admin Console</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-[4px] text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-[4px] text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all mb-2"
          >
            <ArrowLeft size={18} />
            Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[4px] text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-neutral-200 px-8 flex items-center justify-between">
          <h1 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
            {navItems.find(i => i.path === location.pathname)?.label || 'Admin'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded-[4px]">
              {user?.email}
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
