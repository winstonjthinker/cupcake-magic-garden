import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  is_featured?: boolean;
  is_available?: boolean;
  category?: number;
  created_at?: string;
  updated_at?: string;
}

interface GetProductsParams {
  limit?: number;
  is_featured?: boolean;
  is_available?: boolean;
  category?: string | number;
  search?: string;
  ordering?: string;
}

// Create a separate axios instance for public endpoints
const publicApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: false,
});

export const productsApi = {
  getProducts: (params: GetProductsParams = {}) => {
    // Use publicApi for featured/available products that don't require auth
    if (params.is_featured || params.is_available) {
      return publicApi.get<{ count: number; next: string | null; previous: string | null; results: Product[] }>('/products/', { 
        params: { 
          ...params,
          is_available: true // Ensure we only get available products
        } 
      });
    }
    // Use authenticated api for other product requests
    return api.get<{ count: number; next: string | null; previous: string | null; results: Product[] }>('/products/', { params });
  },
  
  getProduct: (slug: string) => api.get<Product>(`/products/${slug}/`),
  
  createProduct: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return api.post<Product>('/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateProduct: (slug: string, data: Partial<Product> & { image?: File | string | null }) => {
    const formData = new FormData();
    
    // Handle the image separately since it might be a File object or a string URL
    if (data.image && typeof data.image !== 'string') {
      formData.append('image', data.image);
    }
    
    // Handle all other fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image') return; // Skip image as it's already handled
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    return api.patch<Product>(`/products/${slug}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProduct: (id: number) => api.delete(`/products/${id}/`),
  getCategories: () => api.get<Category[]>('/products/categories/'),
};

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  image_url?: string;
  author?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  read_time?: number;
  category?: string;
  slug: string;
}

export interface BlogApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const blogApi = {
  getPosts: (params?: any) => api.get<BlogApiResponse<BlogPost>>('/blog/posts/', { params }),
  getPost: (slug: string) => api.get<BlogPost>(`/blog/posts/${slug}/`),
  getCategories: () => api.get<Array<{ id: number; name: string; slug: string }>>('/blog/categories/'),
};

export const contactApi = {
  sendMessage: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => api.post('/contact/', data),
};

export const authApi = {
  login: <T = any>(email: string, password: string) => 
    api.post<T>('/auth/login/', { email, password }),
  
  register: <T = any>(data: {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  }) => api.post<T>('/auth/register/', data),
  
  getProfile: <T = any>() => api.get<T>('/auth/profile/'),
  
  updateProfile: (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.patch('/auth/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  changePassword: (data: {
    old_password: string;
    new_password: string;
  }) => api.post('/auth/change-password/', data),
};

export default api;