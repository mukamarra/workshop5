import { Link, createFileRoute } from '@tanstack/react-router';
import { useProducts, useDeleteProduct } from '../../features/products/api';

export const Route = createFileRoute('/products/')({
  component: ProductsListPage,
});

function ProductsListPage() {
  const { data: products, isLoading, isError, error } = useProducts();
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = (id: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей продукт?')) {
      deleteProductMutation.mutate(String(id));
    }
  };

  if (isLoading) return <div className="p-4 text-center font-bold">Завантаження даних із сервера...</div>;
  if (isError) return <div className="p-4 text-red-500">Помилка завантаження: {error.message}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Керування Продуктами</h1>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Назва</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ціна</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категорія (JOIN)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Дії</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {product.categoryName || 'Без категорії'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <Link to="/products/$productId" params={{ productId: String(product.id) }} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Редагувати
                  </Link>
                  <button onClick={() => handleDelete(product.id)} disabled={deleteProductMutation.isPending} className="text-red-600 hover:text-red-900 disabled:opacity-50">
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}