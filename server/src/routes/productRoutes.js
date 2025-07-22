import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  permanentDeleteProduct,
  updateInventory,
  getFeaturedProducts,
  getProductsByCategory
} from '../controllers/productController.js';
import { auth, admin } from '../middleware/auth.js';
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateGetProducts,
  validateProductId,
  validateUpdateInventory
} from '../middleware/productValidation.js';
import upload from '../middleware/cloudinaryUploader.js';

const router = express.Router();

// Public routes
router.get('/', validateGetProducts, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category/:subcategory', getProductsByCategory);
router.get('/:id', getProduct);

// Protected routes (require authentication + admin role)
// Create product with image uploads
router.post(
  '/',
  auth,
  admin,
  upload.fields([
    { name: 'primary', maxCount: 1 },
    { name: 'gallery', maxCount: 4 },
    { name: 'technical', maxCount: 5 },
    { name: 'roomScenes', maxCount: 5 }
  ]),
  validateCreateProduct,
  createProduct
);

// Update product (image replacements optional)
router.put(
  '/:id',
  auth,
  admin,
  upload.fields([
    { name: 'primary', maxCount: 1 },
    { name: 'gallery', maxCount: 4 },
    { name: 'technical', maxCount: 5 },
    { name: 'roomScenes', maxCount: 5 }
  ]),
  validateUpdateProduct,
  updateProduct
);

// Soft delete (hide) product
router.delete('/:id', auth, admin, validateProductId, deleteProduct);

// Permanent delete (remove DB entry + Cloudinary assets)
router.delete('/permanent/:id', auth, admin, validateProductId, permanentDeleteProduct);

// Update inventory
router.patch('/:id/inventory', auth, admin, validateUpdateInventory, updateInventory);

export default router;
