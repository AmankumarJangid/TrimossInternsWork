// schemas/productValidation.js
import { z } from 'zod';

const dimensionSchema = z.object({
  length: z.number().min(0),
  width: z.number().min(0),
  thickness: z.number().min(0).optional(),
  unit: z.enum(['mm', 'cm', 'inch']).default('mm')
});

const colorVariantSchema = z.object({
  name: z.string().min(1),
  hexCode: z.string().regex(/^#[0-9A-F]{6}$/i)
});

const priceSchema = z.object({
  basePrice: z.number().min(0),
  currency: z.enum(['USD', 'EUR', 'GBP', 'INR']).default('USD'),
  minimumOrderQuantity: z.number().min(1).default(1)
});

const dynamicAttributeSchema = z.object({
  key: z.string().min(1).max(50).regex(/^[a-z0-9_]+$/),
  value: z.union([z.string(), z.number(), z.boolean(), z.date()]),
  dataType: z.enum(['string', 'number', 'boolean', 'date']),
  displayName: z.string().optional(),
  unit: z.string().optional()
});

export const productFormSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().regex(/^[A-Z0-9-]+$/),
  description: z.object({
    short: z.string().min(1).max(500),
    detailed: z.string().max(2000).optional()
  }),
  categories: z.array(z.string()).min(1),
  dimensions: dimensionSchema,
  colorVariants: z.array(colorVariantSchema).optional(),
  pricing: priceSchema,
  inventory: z.object({
    quantity: z.number().min(0).default(0),
    lowStockThreshold: z.number().min(0).default(10)
  }),
  dynamicAttributes: z.array(dynamicAttributeSchema).optional(),
  certifications: z.array(
    z.object({
      name: z.string(),
      authority: z.string(),
      certificateNumber: z.string(),
      validUntil: z.date().optional()
    })
  ).optional(),
  supplier: z.object({
    name: z.string().min(1),
    contactInfo: z.object({
      email: z.string().email().optional(),
      phone: z.string().optional()
    }),
    leadTime: z.number().default(14)
  }),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  relatedProducts: z.array(z.string()).optional()
});