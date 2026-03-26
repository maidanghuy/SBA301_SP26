import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Star, ChevronDown, Filter } from 'lucide-react';
import productService from '../../api/productService';
import { Category, Brand } from '../../types/product.types';

interface FilterSidebarProps {
  onClose?: () => void;
  maxPriceFound?: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onClose, maxPriceFound = 100000000 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Local state for filters
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '0');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || maxPriceFound.toString());
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [isNew, setIsNew] = useState(searchParams.get('isNew') === 'true');
  const [isFeatured, setIsFeatured] = useState(searchParams.get('isFeatured') === 'true');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brandId') || '');

  // Update maxPrice if maxPriceFound changes and user hasn't set a custom one
  useEffect(() => {
    if (!searchParams.get('maxPrice') && maxPriceFound > 0) {
      setMaxPrice(maxPriceFound.toString());
    }
  }, [maxPriceFound, searchParams]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          productService.getCategories(),
          productService.getBrands()
        ]);
        setCategories(catRes);
        setBrands(brandRes);
      } catch (error) {
        console.error('Error fetching filter metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    if (minPrice && minPrice !== '0') newParams.set('minPrice', minPrice); else newParams.delete('minPrice');
    if (maxPrice && maxPrice !== maxPriceFound.toString()) newParams.set('maxPrice', maxPrice); else newParams.delete('maxPrice');
    if (minRating) newParams.set('minRating', minRating); else newParams.delete('minRating');
    if (isNew) newParams.set('isNew', 'true'); else newParams.delete('isNew');
    if (isFeatured) newParams.set('isFeatured', 'true'); else newParams.delete('isFeatured');
    if (selectedCategory) newParams.set('categoryId', selectedCategory); else newParams.delete('categoryId');
    if (selectedBrand) newParams.set('brandId', selectedBrand); else newParams.delete('brandId');

    setSearchParams(newParams);
    if (onClose) onClose();
  };

  const resetFilters = () => {
    const q = searchParams.get('q');
    const newParams = new URLSearchParams();
    if (q) newParams.set('q', q);
    setSearchParams(newParams);
    
    setMinPrice('0');
    setMaxPrice(maxPriceFound.toString());
    setMinRating('');
    setIsNew(false);
    setIsFeatured(false);
    setSelectedCategory('');
    setSelectedBrand('');
    
    if (onClose) onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200 w-full md:w-80">
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-900">Bộ lọc nâng cao</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-xl transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Danh mục</h3>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nameVn}</option>
            ))}
          </select>
        </div>

        {/* Brands */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Thương hiệu</h3>
          <select 
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Khoảng giá</h3>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              {formatCurrency(Number(minPrice))} - {formatCurrency(Number(maxPrice))}
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Dual Range Slider */}
            <div className="relative h-6 flex items-center px-2">
              <div className="absolute left-2 right-2 h-1.5 bg-neutral-100 rounded-lg" />
              <div 
                className="absolute h-1.5 bg-primary rounded-lg"
                style={{
                  left: `${(Number(minPrice) / (maxPriceFound || 100000000)) * 100}%`,
                  right: `${100 - (Number(maxPrice) / (maxPriceFound || 100000000)) * 100}%`
                }}
              />
              <input 
                type="range" 
                min="0" 
                max={maxPriceFound || 100000000} 
                step="100000"
                value={minPrice}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), Number(maxPrice));
                  setMinPrice(val.toString());
                }}
                className="absolute left-0 w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-primary pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
              />
              <input 
                type="range" 
                min="0" 
                max={maxPriceFound || 100000000} 
                step="100000"
                value={maxPrice}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), Number(minPrice));
                  setMaxPrice(val.toString());
                }}
                className="absolute left-0 w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-primary pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
              />
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Tối thiểu</span>
                <input 
                  type="number" 
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={(e) => {
                    let val = Number(e.target.value);
                    if (val < 0) val = 0;
                    if (val > Number(maxPrice)) val = Number(maxPrice);
                    setMinPrice(val.toString());
                  }}
                  className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase">Tối đa</span>
                <input 
                  type="number" 
                  placeholder={maxPriceFound.toString()}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={(e) => {
                    let val = Number(e.target.value);
                    if (val > maxPriceFound) val = maxPriceFound;
                    if (val < Number(minPrice)) val = Number(minPrice);
                    setMaxPrice(val.toString());
                  }}
                  className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Đánh giá tối thiểu</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setMinRating(star.toString())}
                className={`flex-1 py-2 rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  minRating === star.toString() 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white border-neutral-200 text-neutral-400 hover:border-primary hover:text-primary'
                }`}
              >
                <span className="text-xs font-black">{star}</span>
                <Star size={12} fill={minRating === star.toString() ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Tùy chọn khác</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isNew ? 'bg-primary border-primary' : 'border-neutral-200 group-hover:border-primary'}`}>
                {isNew && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isNew}
                onChange={() => setIsNew(!isNew)}
              />
              <span className="text-sm font-bold text-neutral-600">Sản phẩm mới</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isFeatured ? 'bg-primary border-primary' : 'border-neutral-200 group-hover:border-primary'}`}>
                {isFeatured && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isFeatured}
                onChange={() => setIsFeatured(!isFeatured)}
              />
              <span className="text-sm font-bold text-neutral-600">Nổi bật</span>
            </label>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-neutral-100 grid grid-cols-2 gap-4">
        <button 
          onClick={resetFilters}
          className="py-4 text-[11px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          Xóa tất cả
        </button>
        <button 
          onClick={applyFilters}
          className="py-4 bg-neutral-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-all shadow-xl shadow-neutral-900/10"
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
