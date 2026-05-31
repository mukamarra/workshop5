import { Router } from 'express';
import auth from './auth';
import users from './users';
import products from './products'; // 1. Додаємо імпорт

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/products', products); // 2. Реєструємо ендпоінт /products

export default router;