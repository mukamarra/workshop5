import { createFileRoute, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProduct, useUpdateProduct } from '../../features/products/api';
import { useEffect } from 'react';

// Схема клієнтської валідації Zod
const productSchema = z.object({
  productName: z.string().min(3, 'Назва має бути не коротшою за 3 символи'),
  price: z.number({ invalid_type_error: 'Обов’язкове числове поле' }).positive('Ціна має бути більшою за 0'),
});

type ProductFormData = z.infer<typeof productSchema>;

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' });
  const { data: product, isLoading, isError } = useProduct(productId);
  const updateProductMutation = useUpdateProduct();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({ productName: product.productName, price: product.price });
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormData) => {
    updateProductMutation.mutate({ id: productId, data });
  };

  if (isLoading) return <div className="p-4 text-center">Завантаження деталей продукту...</div>;
  if (isError || !product) return <div className="p-4 text-red-500">Продукт не знайдено в базі даних.</div>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Редагування: {product.productName}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Назва продукту</label>
          <input {...register('productName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ціна ($)</label>
          <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div className="flex justify-end space-x-2">
          <button type="submit" disabled={updateProductMutation.isPending} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:bg-gray-400">
            {updateProductMutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </form>
    </div>
  );
}