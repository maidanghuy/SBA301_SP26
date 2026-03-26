import React, { useState, useEffect, useCallback } from 'react';
import productService from '../../api/productService';
import { Product, ProductResponse, Category, Brand, ProductRequest } from '../../types/product.types';
import { ProductFilterValues } from '../../schemas/product/filter.schema';
import { ProductFormValues } from '../../schemas/product/product.schema';
import ProductTable from '../../components/product/ProductTable';
import ProductFilter from '../../components/product/ProductFilter';
import ProductFormModal from '../../components/product/ProductFormModal';
import ConfirmModal from '../../components/product/ConfirmModal';
import { ChevronLeft, ChevronRight, Package, Plus, Search } from 'lucide-react';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pagination, setPagination] = useState<Omit<ProductResponse, 'content'>>({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
  });
  const [filters, setFilters] = useState<ProductFilterValues | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch categories and brands on initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsInitialLoading(true);
      try {
        const [catRes, brandRes] = await Promise.all([
          productService.getCategories(),
          productService.getBrands()
        ]);
        setCategories(catRes);
        setBrands(brandRes);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load filter options');
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchProducts = useCallback(async (currentFilters: ProductFilterValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(currentFilters);
      const { content, ...paginationData } = response;
      setProducts(content);
      setPagination(paginationData);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch products when filters change (pagination)
  useEffect(() => {
    if (filters) {
      fetchProducts(filters);
    }
  }, [filters, fetchProducts]);

  const handleFilter = (newFilters: ProductFilterValues) => {
    setFilters({ ...newFilters, page: 0, size: 10 });
  };

  const handleReset = () => {
    setFilters(null);
    setProducts([]);
    setHasSearched(false);
    setError(null);
  };

  const handlePageChange = (newPage: number) => {
    if (filters) {
      setFilters({ ...filters, page: newPage });
    }
  };

  // CRUD Handlers
  const handleAddClick = () => {
    setSelectedProduct(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = async (product: Product) => {
    setIsActionLoading(true);
    setFormError(null);
    try {
      const response = await productService.getProductById(product.id);
      const detail = response;
      
      // Map specifications from backend format to form format
      const mappedProduct: Product = {
        ...detail.product,
        specifications: detail.specifications.map(s => ({
          key: s.specKey,
          value: s.specValue
        }))
      };
      
      setSelectedProduct(mappedProduct);
      setIsFormModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch product details');
      console.error('Error fetching product details:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsConfirmModalOpen(true);
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    setIsActionLoading(true);
    setFormError(null);
    try {
      const productRequest: ProductRequest = {
        ...values,
        image: values.image || null,
        description: values.description || '',
      };

      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, productRequest);
      } else {
        await productService.createProduct(productRequest);
      }

      setIsFormModalOpen(false);
      // Refresh current list if searched
      if (filters) {
        fetchProducts(filters);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Action failed';
      setFormError(message);
      console.error('Form action error:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    setIsActionLoading(true);
    try {
      await productService.deleteProduct(selectedProduct.id);
      setIsConfirmModalOpen(false);
      if (filters) {
        fetchProducts(filters);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-[4px]">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Product Management</h1>
            <p className="text-sm text-gray-400 font-medium">Manage your inventory and product listings</p>
          </div>
        </div>

        <button 
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={16} />
          Add New Product
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-[4px] font-medium">
          {error}
        </div>
      )}

      <ProductFilter 
        categories={categories}
        brands={brands}
        isLoading={isLoading || isInitialLoading}
        onFilter={handleFilter} 
        onReset={handleReset} 
      />

      <div className="space-y-6">
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-gray-200 rounded-[4px]">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Ready to search</h3>
            <p className="text-xs text-gray-400 mt-2">Please apply filters to search products</p>
          </div>
        ) : (
          <>
            <ProductTable 
              products={products} 
              isLoading={isLoading} 
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />

            {/* Pagination */}
            {!isLoading && products.length > 0 && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-4 bg-white border border-gray-100 rounded-[4px]">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Showing {pagination.page * pagination.size + 1} to{' '}
                  {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                  {pagination.totalElements} products
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="p-2 border border-gray-200 rounded-[4px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`w-8 h-8 text-xs font-bold rounded-[4px] transition-all ${
                          pagination.page === i
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="p-2 border border-gray-200 rounded-[4px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedProduct}
        categories={categories}
        brands={brands}
        isLoading={isActionLoading}
        error={formError}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default ProductManagement;
