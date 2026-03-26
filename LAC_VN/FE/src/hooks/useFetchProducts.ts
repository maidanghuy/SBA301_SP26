import { useState, useEffect } from 'react';
import productService from '../api/productService';
import { Product } from '../types/product.types';

export const useFetchProducts = (categoryId: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProductsByCategory(categoryId);
        setProducts(response);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không tải được sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
};
