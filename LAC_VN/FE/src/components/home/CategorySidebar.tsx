import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Smartphone, Laptop, Watch, Headphones, MousePointer2, Home, Package } from 'lucide-react';
import productService from '../../api/productService';
import { Category } from '../../types/product.types';

const CategorySidebar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        // Filter out empty name categories if any
        setCategories(response.filter(cat => cat.nameVn));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getIcon = (name: string) => {
    switch (name.toUpperCase()) {
      case 'PHONE':
      case 'ĐIỆN THOẠI':
        return <Smartphone size={18} />;
      case 'LAPTOP':
        return <Laptop size={18} />;
      case 'WATCH':
      case 'ĐỒNG HỒ':
        return <Watch size={18} />;
      case 'AUDIO':
      case 'ÂM THANH':
        return <Headphones size={18} />;
      case 'ACCESSORY':
      case 'PHỤ KIỆN':
        return <MousePointer2 size={18} />;
      case 'HOME_APPLIANCE':
      case 'GIA DỤNG':
        return <Home size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-100">
          <div className="h-4 w-24 bg-neutral-100 animate-pulse rounded"></div>
        </div>
        <div className="p-2 space-y-1">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-10 w-full bg-neutral-50 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm sticky top-24">
      <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-neutral-400">Danh mục sản phẩm</h3>
      </div>
      <nav className="p-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-neutral-400 group-hover:text-primary transition-colors">
                {getIcon(category.nameEnglish || category.nameVn)}
              </span>
              <span className="text-sm font-bold tracking-tight">{category.nameVn}</span>
            </div>
            <ChevronRight size={14} className="text-neutral-300 group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default CategorySidebar;
