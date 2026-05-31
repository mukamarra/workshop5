import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service'; 
import { ProductResponseDTO } from '../dto/ProductResponseDTO'; // Імпортуємо DTO

const productService = new ProductService();

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await productService.getAll();
    // Перетворюємо масу сирих продуктів у масив чистих DTO
    const productDTOs = products.map(product => new ProductResponseDTO(product));
    
    res.status(200).json({ message: 'List of products.', data: productDTOs });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await productService.getById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }
    // Повертаємо поодиноке DTO
    res.status(200).json({ message: 'Product details.', data: new ProductResponseDTO(product) });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newProduct = await productService.create(req.body);
    res.status(201).json({ message: 'Product successfully created.', data: new ProductResponseDTO(newProduct) });
  } catch (err) {
    next(err);
  }
};


export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const updatedProduct = await productService.update(id, req.body);
    res.status(200).json({ message: 'Product successfully updated.', data: updatedProduct });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await productService.delete(id);
    res.status(200).json({ message: 'Product successfully deleted.' });
  } catch (err) {
    next(err);
  }
};