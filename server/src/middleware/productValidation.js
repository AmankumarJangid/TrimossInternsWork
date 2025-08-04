import { body, param, query } from 'express-validator';
import Product from '../models/Product.js';

// Common regex
const slugRegex = /^[a-z0-9-]+$/;
const skuRegex = /^[A-Z0-9-]+$/;
const hexRegex = /^#[0-9A-F]{6}$/i;

// Validation for creating a new producta
export const validateCreateProduct = [
  // Basic fields
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Product name must be between 2 and 200 characters'),

  body('sku')
    .notEmpty().withMessage('SKU is required')
    .matches(skuRegex).withMessage('SKU must contain only uppercase letters, numbers, and hyphens')
    .custom(async (value) => {
      const existing = await Product.findOne({ sku: value });
      if (existing) throw new Error('SKU already exists');
    }),

  // Description
  body('description.short')
    .notEmpty().withMessage('Short description is required')
    .isLength({ max: 500 }).withMessage('Short description cannot exceed 500 characters'),
  body('description.detailed')
    .optional()
    .isLength({ max: 2000 }).withMessage('Detailed description cannot exceed 2000 characters'),

  // Categories (non-empty array)
  body('categories')
    .isArray({ min: 1 }).withMessage('At least one category is required'),
  body('categories.*')
    .isString().withMessage('Category must be a string'),

  // Dimensions
  body('dimensions.length')
    .notEmpty().withMessage('Length is required')
    .toFloat()
    .isFloat({ min: 0 }).withMessage('Length must be a non-negative number'),
  body('dimensions.width')
    .notEmpty().withMessage('Width is required')
    .toFloat()
    .isFloat({ min: 0 }).withMessage('Width must be a non-negative number'),
  body('dimensions.thickness')
    .optional()
    .toFloat()
    .isFloat({ min: 0 }).withMessage('Thickness must be a non-negative number'),
  body('dimensions.unit')
    .optional()
    .isIn(['mm', 'cm', 'inch']).withMessage('Dimensions unit must be mm, cm, or inch'),

  // Color variants
  body('colorVariants')
    .optional()
    .isArray().withMessage('colorVariants must be an array'),
  body('colorVariants.*.name')
    .optional()
    .isString().withMessage('Color variant name must be a string'),
  body('colorVariants.*.hexCode')
    .optional()
    .matches(hexRegex).withMessage('Hex code must be in format #RRGGBB'),

  // Pricing
  body('pricing.basePrice')
    .notEmpty().withMessage('Base price is required')
    .toFloat()
    .isFloat({ min: 0 }).withMessage('Base price must be non-negative'),
  body('pricing.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'INR']).withMessage('Invalid currency'),
  body('pricing.minimumOrderQuantity')
    .optional()
    .toInt()
    .isInt({ min: 1 }).withMessage('Minimum order quantity must be at least 1'),

  // Inventory
  body('inventory.quantity')
    .notEmpty().withMessage('Inventory quantity is required')
    .toInt()
    .isInt({ min: 0 }).withMessage('Inventory quantity must be a non-negative integer'),
  body('inventory.lowStockThreshold')
    .optional()
    .toInt()
    .isInt({ min: 0 }).withMessage('Low stock threshold must be a non-negative integer'),

  // Dynamic attributes
  body('dynamicAttributes')
    .optional()
    .isArray().withMessage('dynamicAttributes must be an array'),
  body('dynamicAttributes.*.key')
    .optional()
    .matches(/^[a-z0-9_]+$/).withMessage('Attribute key must be lowercase alphanumeric or underscore'),
  body('dynamicAttributes.*.dataType')
    .optional()
    .isIn(['string', 'number', 'boolean', 'date']).withMessage('Invalid attribute dataType'),

  // Supplier
  body('supplier.name')
    .notEmpty().withMessage('Supplier name is required')
    .isString(),
  body('supplier.leadTime')
    .optional()
    .toInt()
    .isInt({ min: 0 }).withMessage('Lead time must be non-negative'),

  // SEO
  body('seo.slug')
    .optional()
    .matches(slugRegex).withMessage('Slug must be lowercase alphanumeric and hyphens')
    .custom(async (value) => {
      const existing = await Product.findOne({ 'seo.slug': value });
      if (existing) throw new Error('Slug already exists');
    }),

  // Flags
  body('isActive')
  .optional()
  .toBoolean() // 👈 this converts 'true'/'false' to boolean
  .isBoolean().withMessage('isActive must be boolean'),

body('isFeatured')
  .optional()
  .toBoolean()
  .isBoolean().withMessage('isFeatured must be boolean'),

];

// Validation for updating a product
export const validateUpdateProduct = [
  param('id')
    .isMongoId().withMessage('Invalid product ID'),

  body('name')
    .optional()
    .isLength({ min: 2, max: 200 }).withMessage('Product name must be between 2 and 200 characters'),

  body('sku')
    .optional()
    .matches(skuRegex).withMessage('SKU must contain only uppercase letters, numbers, and hyphens')
    .custom(async (value, { req }) => {
      const existing = await Product.findOne({ sku: value, _id: { $ne: req.params.id } });
      if (existing) throw new Error('SKU already exists');
    }),

  // All create validations apply but optional
  ...validateCreateProduct.map(rule => rule.optional())
];

// Validation for getting products with filters
export const validateGetProducts = [
  query('categories')
    .optional()
    .isString().withMessage('categories must be comma-separated strings'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum price must be non-negative'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum price must be non-negative'),

  query('inStock')
    .optional()
    .isBoolean().withMessage('inStock must be boolean'),

  query('featured')
    .optional()
    .isBoolean().withMessage('featured must be boolean'),

  query('tags')
    .optional()
    .isString().withMessage('tags must be comma-separated'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be at least 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .isIn(['price', 'salesData.totalSold', 'createdAt', 'name']).withMessage('Invalid sort field'),

  query('order')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Order must be asc or desc')
];

// Validation for product ID parameter
export const validateProductId = [
  param('id')
    .isMongoId().withMessage('Invalid product ID')
];

// Validation for updating inventory
export const validateUpdateInventory = [
  param('id')
    .isMongoId().withMessage('Invalid product ID'),

  body('quantity')
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),

  body('operation')
    .isIn(['set', 'add', 'subtract']).withMessage('Operation must be set, add, or subtract')
];
