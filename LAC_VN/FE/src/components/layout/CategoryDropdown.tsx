import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, ChevronDown, Smartphone, Laptop, Watch, Headphones, MousePointer2, Home, Package, Search as SearchIcon } from 'lucide-react';
import productService from '../../api/productService';
import { Category } from '../../types/product.types';

const CategoryDropdown: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response.filter(cat => cat.nameVn));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (name: string) => {
    switch (name.toUpperCase()) {
      case 'PHONE':
      case 'ĐIỆN THOẠI':
        return <Smartphone size={16} />;
      case 'LAPTOP':
        return <Laptop size={16} />;
      case 'WATCH':
      case 'ĐỒNG HỒ':
        return <Watch size={16} />;
      case 'AUDIO':
      case 'ÂM THANH':
        return <Headphones size={16} />;
      case 'ACCESSORY':
      case 'PHỤ KIỆN':
        return <MousePointer2 size={16} />;
      case 'HOME_APPLIANCE':
      case 'GIA DỤNG':
        return <Home size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[11px] uppercase tracking-widest ${
          isOpen ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
        }`}
      >
        <LayoutGrid size={16} />
        Danh mục
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  navigate(`/categories/${category.id}`);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all group"
              >
                <span className="text-neutral-400 group-hover:text-primary transition-colors">
                  {getIcon(category.nameEnglish || category.nameVn)}
                </span>
                <span className="text-sm font-bold tracking-tight">{category.nameVn}</span>
              </button>
            ))}
          </div>
          <div className="bg-neutral-50 p-3 border-t border-neutral-100">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors block text-center"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
