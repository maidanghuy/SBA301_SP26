import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFilterSchema, ProductFilterValues } from '../../schemas/product/filter.schema';
import { Search, Filter, X } from 'lucide-react';
import { Category, Brand } from '../../types/product.types';

interface ProductFilterProps {
  categories: Category[];
  brands: Brand[];
  isLoading: boolean;
  onFilter: (values: ProductFilterValues) => void;
  onReset: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ 
  categories, 
  brands, 
  isLoading, 
  onFilter, 
  onReset 
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFilterValues>({
    resolver: zodResolver(productFilterSchema) as any,
    defaultValues: {
      keyword: '',
      brandId: undefined,
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isNew: true,
      isFeatured: true,
      minRating: undefined,
      page: 0,
      size: 10,
      sortBy: 'id',
      sortDir: 'desc',
    },
  });

  const onSubmit = (data: ProductFilterValues) => {
    // Build query params - only send params that exist and are valid
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      // Skip undefined, null, empty strings, and NaN
      if (value === undefined || value === null || value === '') return acc;
      if (typeof value === 'number' && isNaN(value)) return acc;
      
      acc[key] = value;
      return acc;
    }, {} as any);
    
    onFilter(cleanData);
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[4px] p-6 mb-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
        <Filter size={18} className="text-indigo-600" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">Filter Products</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Keyword</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                {...register('keyword')}
                type="text"
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Brand Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Brand</label>
            <select
              {...register('brandId', { valueAsNumber: true })}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Category</label>
            <select
              {...register('categoryId', { valueAsNumber: true })}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Rating Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Min Rating</label>
            <select
              {...register('minRating', { valueAsNumber: true })}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Price Range */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Min Price</label>
            <input
              {...register('minPrice', { valueAsNumber: true })}
              type="number"
              placeholder="$ Min"
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Max Price</label>
            <input
              {...register('maxPrice', { valueAsNumber: true })}
              type="number"
              placeholder="$ Max"
              className={`w-full px-4 py-2 text-sm border rounded-[4px] focus:outline-none focus:ring-1 transition-all ${
                errors.maxPrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
              }`}
            />
            {errors.maxPrice && (
              <span className="text-[10px] text-red-500 font-medium">{errors.maxPrice.message as string}</span>
            )}
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6 lg:col-span-2 pt-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                {...register('isNew')}
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded-[2px] focus:ring-indigo-500"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">New Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                {...register('isFeatured')}
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded-[2px] focus:ring-indigo-500"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">Featured Only</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <X size={14} />
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Filter size={14} />
            )}
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFilter;
