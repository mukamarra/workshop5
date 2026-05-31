import { Product } from '../orm/entities/Product';

export class ProductResponseDTO {
  id: number;
  productName: string; // Перейменовуємо 'title' на більш зрозуміле поля для API
  price: number;
  categoryName: string | null; // Замість усього об'єкта категорії віддамо суто її назву

  constructor(product: Product) {
    this.id = product.id;
    this.productName = product.title;
    this.price = Number(product.price);
    // Якщо зв'язана категорія завантажена через JOIN — беремо її ім'я
    this.categoryName = product.category ? product.category.name : null;
  }
}