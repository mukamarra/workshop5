import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import { Product } from './types';

// Функції безпосередніх HTTP-запитів до бекенду
const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products');
  return response.data.data; // Обгортка .data.data враховує структуру нашого Express-бекенду
};

const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data.data;
};

const updateProduct = async ({ id, data }: { id: string; data: Partial<Product> }): Promise<Product> => {
  const response = await apiClient.put(`/products/${id}`, data);
  return response.data.data;
};

const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

// --- Кастомні хуки TanStack Query для використання в UI компонентах ---

// Хук для отримання всього списку
export const useProducts = () => useQuery<Product[]>({ queryKey: ['products'], queryFn: getProducts });

// Хук для отримання одного продукту за ID
export const useProduct = (id: string) => useQuery<Product>({ queryKey: ['products', id], queryFn: () => getProductById(id) });

// Хук для оновлення (редагування) даних
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (updatedProduct) => {
      // Наказуємо TanStack Query скинути старий кеш списку продуктів
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Оновлюємо кеш конкретно цього зміненого продукту
      queryClient.setQueryData(['products', String(updatedProduct.id)], updatedProduct);
      // Автоматично повертаємо користувача на сторінку загального списку
      navigate({ to: '/products' });
    },
  });
};

// Хук для видалення продукту
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Оновлюємо список на екрані, щоб видалений продукт зник
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};