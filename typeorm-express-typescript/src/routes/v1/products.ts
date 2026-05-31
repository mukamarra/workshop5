import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../../controllers/product.controller';
import { validatorCreateProduct } from '../../middleware/validation/product/validatorCreateProduct'; // Імпорт валідатора

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// Вставляємо валідатор ПЕРЕД контролером createProduct
router.post('/', validatorCreateProduct, createProduct); 

router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;