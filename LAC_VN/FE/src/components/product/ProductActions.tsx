import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { Product } from '../../types/product.types';

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    onEdit(product);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete(product);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded-[4px] transition-colors text-gray-400 hover:text-gray-600"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-[4px] shadow-lg z-50 overflow-hidden">
          <Link
            to={`/products/${product.id}`}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left font-bold uppercase tracking-widest"
          >
            <Eye size={12} className="text-indigo-600" />
            View Details
          </Link>
          <button
            onClick={handleEdit}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left font-bold uppercase tracking-widest"
          >
            <Edit2 size={12} className="text-indigo-600" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left font-bold uppercase tracking-widest"
          >
            <Trash2 size={12} className="text-red-500" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductActions;
