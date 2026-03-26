import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormValues } from '../../schemas/product/product.schema';
import { Product, Category, Brand, SpecificationDefinition } from '../../types/product.types';
import productService from '../../api/productService';
import { X, Save, Package, DollarSign, Image as ImageIcon, Layers, Tag, Info, AlertCircle, Plus, Trash2, Settings } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  initialData?: Product | null;
  categories: Category[];
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  brands,
  isLoading,
  error,
}) => {
  const [availableSpecs, setAvailableSpecs] = useState<SpecificationDefinition[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError: setFormFieldError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      image: '',
      stock: 0,
      isNew: false,
      isFeatured: false,
      brandId: undefined,
      categoryId: undefined,
      specifications: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications',
  });

  // Fetch specifications
  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const res = await productService.getSpecifications();
        setAvailableSpecs(res);
      } catch (err) {
        console.error('Error fetching specs:', err);
      }
    };
    if (isOpen) {
      fetchSpecs();
    }
  }, [isOpen]);

  // Parse backend validation errors like "{name=..., price=...}"
  useEffect(() => {
    if (error && error.startsWith('{') && error.endsWith('}')) {
      const errorContent = error.slice(1, -1);
      const errorPairs = errorContent.split(', ');
      
      errorPairs.forEach(pair => {
        const [field, message] = pair.split('=');
        if (field && message) {
          setFormFieldError(field.trim() as keyof ProductFormValues, {
            type: 'manual',
            message: message.trim(),
          });
        }
      });
    }
  }, [error, setFormFieldError]);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        price: initialData.price,
        description: initialData.description || '',
        image: initialData.image || '',
        stock: initialData.stock,
        isNew: initialData.isNew,
        isFeatured: initialData.isFeatured,
        brandId: initialData.brandId || brands.find(b => b.name === initialData.brandName)?.id,
        categoryId: initialData.categoryId || categories.find(c => c.name === initialData.categoryName)?.id,
        specifications: initialData.specifications || [],
      });
    } else {
      reset({
        name: '',
        price: 0,
        description: '',
        image: '',
        stock: 0,
        isNew: false,
        isFeatured: false,
        brandId: undefined,
        categoryId: undefined,
        specifications: [],
      });
    }
  }, [initialData, reset, brands, categories, isOpen]);

  const onFormSubmit = async (values: ProductFormValues) => {
    setIsLocalLoading(true);
    try {
      // 1. Check for new specifications and create them if needed
      const updatedSpecs = await Promise.all(
        values.specifications.map(async (spec) => {
          const existingSpec = availableSpecs.find(
            (s) => s.specKey.toLowerCase() === spec.key.toLowerCase()
          );
          if (!existingSpec) {
            // Create new spec definition
            const res = await productService.createSpecification({
              specKey: spec.key,
              nameVi: spec.key, // Using key as nameVi for new specs
            });
            return { key: res.specKey, value: spec.value };
          }
          return spec;
        })
      );

      // 2. Call the original onSubmit with updated data
      await onSubmit({ ...values, specifications: updatedSpecs });
    } catch (err: any) {
      // Errors are handled by the parent component via the 'error' prop
      console.error('Submit error in modal:', err);
    } finally {
      setIsLocalLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[4px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-indigo-600">
            <Package size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest">
              {initialData ? 'Edit Product' : 'Add New Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {error && !error.startsWith('{') && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-[4px] font-medium flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <Tag size={12} /> Product Name
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="Enter product name"
                className={`w-full px-4 py-2 text-sm border rounded-[4px] focus:outline-none focus:ring-1 transition-all ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
                }`}
              />
              {errors.name && (
                <span className="text-[10px] text-red-500 font-medium">{errors.name.message}</span>
              )}
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <DollarSign size={12} /> Price
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`w-full px-4 py-2 text-sm border rounded-[4px] focus:outline-none focus:ring-1 transition-all ${
                  errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
                }`}
              />
              {errors.price && (
                <span className="text-[10px] text-red-500 font-medium">{errors.price.message}</span>
              )}
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <Layers size={12} /> Brand
              </label>
              <select
                {...register('brandId', { valueAsNumber: true })}
                className={`w-full px-4 py-2 text-sm border rounded-[4px] focus:outline-none focus:ring-1 transition-all appearance-none bg-white ${
                  errors.brandId ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
                }`}
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              {errors.brandId && (
                <span className="text-[10px] text-red-500 font-medium">{errors.brandId.message}</span>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <Layers size={12} /> Category
              </label>
              <select
                {...register('categoryId', { valueAsNumber: true })}
                className={`w-full px-4 py-2 text-sm border rounded-[4px] focus:outline-none focus:ring-1 transition-all appearance-none bg-white ${
                  errors.categoryId ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.nameVn}</option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="text-[10px] text-red-500 font-medium">{errors.categoryId.message}</span>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <Package size={12} /> Stock Quantity
              </label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className={`w-full px-4 py-2 text-sm border rounded-[4px] focus:outline-none focus:ring-1 transition-all ${
                  errors.stock ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
                }`}
              />
              {errors.stock && (
                <span className="text-[10px] text-red-500 font-medium">{errors.stock.message}</span>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <ImageIcon size={12} /> Image URL
              </label>
              <input
                {...register('image')}
                type="text"
                placeholder="https://example.com/image.jpg"
                className={`w-full px-4 py-2 text-sm border rounded-[4px] focus:outline-none focus:ring-1 transition-all ${
                  errors.image ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
                }`}
              />
              {errors.image && (
                <span className="text-[10px] text-red-500 font-medium">{errors.image.message}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <Info size={12} /> Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Enter product description..."
              className={`w-full px-4 py-2 text-sm border rounded-[4px] focus:outline-none focus:ring-1 transition-all resize-none ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
              }`}
            />
            {errors.description && (
              <span className="text-[10px] text-red-500 font-medium">{errors.description.message}</span>
            )}
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-8 pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                {...register('isNew')}
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded-[2px] focus:ring-indigo-500"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">New Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                {...register('isFeatured')}
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded-[2px] focus:ring-indigo-500"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">Featured Product</span>
            </label>
          </div>

          {/* Specifications Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <Settings size={12} /> Specifications
              </label>
              <button
                type="button"
                onClick={() => append({ key: '', value: '' })}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-[4px] transition-colors"
              >
                <Plus size={12} /> Add Row
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                  <div className="flex-1 space-y-1">
                    <input
                      {...register(`specifications.${index}.key`)}
                      list="spec-keys"
                      placeholder="Key (e.g. CPU, RAM)"
                      className={`w-full px-3 py-1.5 text-xs border rounded-[4px] focus:outline-none focus:ring-1 transition-all ${
                        errors.specifications?.[index]?.key ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.specifications?.[index]?.key && (
                      <span className="text-[9px] text-red-500 font-medium">{errors.specifications[index]?.key?.message}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      {...register(`specifications.${index}.value`)}
                      placeholder="Value (e.g. Intel i7, 16GB)"
                      className={`w-full px-3 py-1.5 text-xs border rounded-[4px] focus:outline-none focus:ring-1 transition-all ${
                        errors.specifications?.[index]?.value ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.specifications?.[index]?.value && (
                      <span className="text-[9px] text-red-500 font-medium">{errors.specifications[index]?.value?.message}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[4px] transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-4 border border-dashed border-gray-100 rounded-[4px]">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">No specifications added</p>
                </div>
              )}
            </div>

            <datalist id="spec-keys">
              {availableSpecs.map((spec) => (
                <option key={spec.id} value={spec.specKey}>
                  {spec.nameVi}
                </option>
              ))}
            </datalist>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || isLocalLoading}
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isLocalLoading}
              className="flex items-center gap-2 px-8 py-2 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || isLocalLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {initialData ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
