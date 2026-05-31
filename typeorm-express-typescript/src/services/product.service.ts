import { getRepository } from 'typeorm';
import { Product } from '../orm/entities/Product';

export class ProductService {
  // Динамічний метод для отримання репозиторію в момент запиту
  private getRepo() {
    return getRepository(Product);
  }

  async getAll() {
    return await this.getRepo().find({ relations: ['category'] });
  }

  async getById(id: number) {
    return await this.getRepo().findOne(id, { relations: ['category'] });
  }

  async create(data: Partial<Product>) {
    const newProduct = this.getRepo().create(data);
    return await this.getRepo().save(newProduct);
  }

  async update(id: number, data: Partial<Product>) {
    await this.getRepo().update(id, data);
    return this.getById(id);
  }

  async delete(id: number) {
    const product = await this.getById(id);
    if (product) {
      await this.getRepo().remove(product);
      return true;
    }
    return false;
  }
}