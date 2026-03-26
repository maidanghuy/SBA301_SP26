export interface ProductSpecification {
  key: string;
  value: string;
}

export interface SpecificationDefinition {
  id: number;
  specKey: string;
  nameVi: string;
}

export interface ProductDetail {
  product: Product & { brandId: number; categoryId: number };
  specifications: {
    id: number;
    specKey: string;
    specNameVi: string;
    specValue: string;
  }[];
  reviews: any[];
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  description: string;
  image: string | null;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  brandName: string;
  categoryName: string;
  brandId?: number;
  categoryId?: number;
  specifications?: ProductSpecification[];
}

export interface ProductResponse {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
  path: string;
}

export interface Category {
  id: number;
  name: string | null;
  key: string | null;
  nameVn: string;
  nameEnglish: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface ShippingMethod {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface ProductRequest {
  name: string;
  price: number;
  description: string;
  image: string | null;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  brandId: number;
  categoryId: number;
  specifications: ProductSpecification[];
}

export interface ProductQueryParams {
  keyword?: string;
  brandId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  minRating?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
