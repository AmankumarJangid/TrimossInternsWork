import { z } from 'zod'

// Reusable
const hexRegex = /^#[0-9A-F]{6}$/i;
const skuRegex = /^[A-Z0-9-]+$/;

// Dynamic Attribute Schema
const dynamicAttributeSchema = z.object({
  key: z.string()
    .min(1, "Key is required")
    .max(50)
    .regex(/^[a-z0-9_]+$/, "Key must be lowercase, alphanumeric or underscore"),

  dataType: z.enum(['string', 'number', 'boolean', 'date']),
  value: z.any(), // Accept any, you’re manually controlling it via watch + DynamicInput
  displayName: z.string().optional(),
  unit: z.string().optional()
});

// Main Schema
export const productFormSchema = z.object({
  name: z.string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Max 200 characters"),

  sku: z.string()
    .regex(skuRegex, "SKU must contain only uppercase letters, numbers, and hyphens"),

  description: z.object({
    short: z.string()
      .min(1, "Short description is required")
      .max(500, "Max 500 characters"),

    detailed: z.string()
      .max(2000, "Max 2000 characters")
      .optional()
  }),

  categories: z.array(z.string())
    .min(1, "At least one category is required"),

  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    thickness: z.number().min(0).optional(),
    unit: z.enum(['mm', 'cm', 'inch'])
  }),

 pricing: z.object({
  basePrice: z.preprocess(
    (val) => (val !== '' ? Number(val) : undefined),
    z.number().min(0)
  ),
  currency: z.enum(['USD', 'EUR', 'GBP', 'INR']),
  minimumOrderQuantity: z.preprocess(
    (val) => (val !== '' ? Number(val) : undefined),
    z.number().min(1)
  )
}),

  inventory: z.object({
    quantity: z.number().min(0),
    lowStockThreshold: z.number().min(0),
    status: z.enum([
      'in-stock',
      'low-stock',
      'out-of-stock',
      'discontinued',
      'pre-order'
    ]).optional()
  }),

  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  supplier: z.object({
    name: z.string().min(1),
    contactInfo: z.object({
      phone: z.string().optional(),
      email: z.string().email().optional()
    }).optional(),
    leadTime: z.number().optional()
  }),

  colorVariants: z.array(
    z.object({
      name: z.string().min(1, "Color name is required"),
      hexCode: z.string().regex(hexRegex, "Invalid hex code")
    })
  ).optional(),

  dynamicAttributes: z.array(dynamicAttributeSchema).optional(),
  
  // You can add other optional fields later (seo, tags, etc.) if they’re added to the form
})
