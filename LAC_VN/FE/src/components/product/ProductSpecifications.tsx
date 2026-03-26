import React from 'react';
import { Settings, ChevronRight } from 'lucide-react';

interface SpecificationItem {
  id: number;
  specKey: string;
  specNameVi: string;
  specValue: string;
}

interface ProductSpecificationsProps {
  specifications: SpecificationItem[];
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto mb-4">
          <Settings size={32} className="text-gray-200" />
        </div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          Thông số kỹ thuật đang được cập nhật
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-900">
          <Settings size={20} className="text-primary" />
          <h3 className="text-sm font-black uppercase tracking-widest">Thông số kỹ thuật</h3>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
          Xem chi tiết <ChevronRight size={12} />
        </button>
      </div>
      
      <div className="divide-y divide-gray-50">
        {specifications.map((spec, index) => (
          <div 
            key={spec.id} 
            className={`flex items-center px-6 py-4 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}
          >
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 w-1/3">
              {spec.specNameVi || spec.specKey}
            </span>
            <span className="text-sm font-bold text-gray-700 w-2/3">
              {spec.specValue}
            </span>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
        <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-600 hover:border-primary hover:text-primary transition-all">
          Xem cấu hình chi tiết
        </button>
      </div>
    </div>
  );
};

export default ProductSpecifications;
