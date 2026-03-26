import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Star, Loader2 } from 'lucide-react';
import productService from '../../api/productService';
import { Product } from '../../types/product.types';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await productService.searchSuggestions({ 
          keyword: query.trim(),
          limit: 5 
        });
        setSuggestions(response);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (showSuggestions) {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, showSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catelog?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    navigate(`/catelog?q=${encodeURIComponent(product.name)}`);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate('/');
  };

  return (
    <div className="relative group w-full max-w-md" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <SearchIcon size={16} className="md:w-[18px] md:h-[18px]" />}
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2 md:py-3 bg-neutral-100 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-medium placeholder:text-neutral-400"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading && suggestions.length === 0 ? (
            <div className="p-4 text-center text-neutral-400 text-xs uppercase font-black tracking-widest">
              Đang tìm kiếm...
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              <div className="p-3 border-b border-neutral-50 bg-neutral-50/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Gợi ý sản phẩm</span>
              </div>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-neutral-50 transition-colors text-left border-b border-neutral-50 last:border-0"
                >
                  <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <SearchIcon size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-neutral-900 truncate tracking-tight">{product.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-black text-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-black">
                        <Star size={10} fill="currentColor" />
                        {product.rating}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSearch}
                className="w-full p-3 text-center text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors"
              >
                Xem tất cả kết quả cho "{query}"
              </button>
            </div>
          ) : !isLoading && (
            <div className="p-4 text-center text-neutral-400 text-xs uppercase font-black tracking-widest">
              Không tìm thấy gợi ý nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
