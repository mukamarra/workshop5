import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../utils/response/custom-error/CustomError';

export const validatorCreateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, price } = req.body;

  // Перевірка на порожнє ім'я продукту
  if (!title || title.trim() === '') {
    const error = new CustomError(400, 'Validation', 'Product name (title) is required');
    return next(error);
  }

  // Перевірка ціни (має бути числом і більшим за 0)
  if (!price || isNaN(Number(price)) || Number(price) <= 0) {
    const error = new CustomError(400, 'Validation', 'Price must be a number greater than 0');
    return next(error);
  }

  // Якщо все добре — передаємо хід контролеру
  return next();
};