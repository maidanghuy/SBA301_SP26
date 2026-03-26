import axiosClient from './axiosClient';
import { ApiResponse, ProductQueryParams, ProductResponse, Category, Brand, ProductRequest, Product, SpecificationDefinition, ProductDetail } from '../types/product.types';

const productService = {
  getProducts: async (params: ProductQueryParams): Promise<ProductResponse> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse>>('/products', { params });
    return response.data.data;
  },

  getProductById: async (id: string | number): Promise<ProductDetail> => {
    const response = await axiosClient.get<ApiResponse<ProductDetail>>(`/products/${id}`);
    return response.data.data;
  },

  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await axiosClient.get<ApiResponse<Product[]>>(`/categories/${categoryId}/products`);
    return response.data.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },

  getBrands: async (): Promise<Brand[]> => {
    const response = await axiosClient.get<ApiResponse<Brand[]>>('/brands');
    return response.data.data;
  },

  getSpecifications: async (): Promise<SpecificationDefinition[]> => {
    const response = await axiosClient.get<ApiResponse<SpecificationDefinition[]>>('/product-specifications');
    return response.data.data;
  },

  searchSuggestions: async (params: ProductQueryParams & { limit?: number }): Promise<Product[]> => {
    const response = await axiosClient.get<ApiResponse<Product[]>>('/products/search/suggestions', { params });
    return response.data.data;
  },

  createSpecification: async (data: { specKey: string; nameVi: string }): Promise<SpecificationDefinition> => {
    const response = await axiosClient.post<ApiResponse<SpecificationDefinition>>('/admin/product-specifications', data);
    return response.data.data;
  },

  createProduct: async (data: ProductRequest): Promise<Product> => {
    const response = await axiosClient.post<ApiResponse<Product>>('/admin/products', data);
    return response.data.data;
  },

  updateProduct: async (id: number, data: ProductRequest): Promise<Product> => {
    const response = await axiosClient.put<ApiResponse<Product>>(`/admin/products/${id}`, data);
    return response.data.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axiosClient.delete<ApiResponse<void>>(`/admin/products/${id}`);
  },

  createCategory: async (data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await axiosClient.post<ApiResponse<Category>>('/admin/categories', data);
    return response.data.data;
  },

  updateCategory: async (id: number, data: Category): Promise<Category> => {
    const response = await axiosClient.put<ApiResponse<Category>>(`/admin/categories/${id}`, data);
    return response.data.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axiosClient.delete<ApiResponse<void>>(`/admin/categories/${id}`);
  },

  createBrand: async (data: Omit<Brand, 'id'>): Promise<Brand> => {
    const response = await axiosClient.post<ApiResponse<Brand>>('/admin/brands', data);
    return response.data.data;
  },

  updateBrand: async (id: number, data: Brand): Promise<Brand> => {
    const response = await axiosClient.put<ApiResponse<Brand>>(`/admin/brands/${id}`, data);
    return response.data.data;
  },

  deleteBrand: async (id: number): Promise<void> => {
    await axiosClient.delete<ApiResponse<void>>(`/admin/brands/${id}`);
  },
};

export default productService;
