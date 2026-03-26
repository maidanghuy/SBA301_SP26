import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product.types';
import ProductActions from './ProductActions';
import { Star } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, isLoading, onEdit, onDelete }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const placeholderImage = 'https://via.placeholder.com/40x40?text=No+Image';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[4px]">
        <p className="text-gray-400 text-sm font-medium">No products found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-100 rounded-[4px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Image</th>
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Name</th>
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Price</th>
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Stock</th>
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Brand</th>
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Category</th>
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Rating</th>
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <img
                  src={product.image || placeholderImage}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-[2px] border border-gray-100"
                  referrerPolicy="no-referrer"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <Link 
                    to={`/products/${product.id}`}
                    className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">ID: #{product.id}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-[2px] ${product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {product.stock} in stock
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-gray-600">{product.brandName}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-gray-600">{product.categoryName}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-semibold text-gray-600">{product.rating}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
