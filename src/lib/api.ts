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

export const productsApi = {
  getProducts: (params: GetProductsParams = {}) => 
    api.get<{ count: number; next: string | null; previous: string | null; results: Product[] }>('/products/', { params }),
  
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
  updateProduct: (slug: string, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.patch(`/products/${slug}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProduct: (slug: string) => api.delete(`/products/${slug}/`),
  getCategories: () => api.get('/products/categories/'),
};

export const blogApi = {
  getPosts: (params?: any) => api.get('/blog/posts/', { params }),
  getPost: (slug: string) => api.get(`/blog/posts/${slug}/`),
  getCategories: () => api.get('/blog/categories/'),
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