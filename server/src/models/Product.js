// models/Product.js
import mongoose from 'mongoose';

const dimensionSchema = new mongoose.Schema({
  length: { type: Number, required: true, min: 0 },
  width: { type: Number, required: true, min: 0 },
  thickness: { type: Number, min: 0 },
  unit: {
    type: String,
    enum: ['mm', 'cm', 'inch'],
    default: 'mm'
  }
}, { _id: false });

const colorVariantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  hexCode: {
    type: String,
    required: true,
    match: /^#[0-9A-F]{6}$/i
  }
}, { _id: false });

const priceSchema = new mongoose.Schema({
  basePrice: { type: Number, required: true, min: 0 },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR']
  },
  minimumOrderQuantity: { type: Number, default: 1, min: 1 }
}, { _id: false });

const dynamicAttributeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    lowercase: true,
    match: /^[a-z0-9_]+$/
  },
  value: mongoose.Schema.Types.Mixed,
  dataType: {
    type: String,
    enum: ['string', 'number', 'boolean', 'date'],
    required: true
  },
  displayName: { type: String, trim: true },
  unit: { type: String, trim: true }
}, { _id: false, timestamps: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  
  sku: {
    type: String, 
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens']
  },
  
  description: {
    short: {
      type: String,
      required: true,
      maxlength: [500, 'Short description cannot exceed 500 characters']
    },
    detailed: {
      type: String,
      maxlength: [2000, 'Detailed description cannot exceed 2000 characters']
    }
  },
  
  categories: {
    type: [String],
    required: true,
    index: true,
    validate: {
      validator: v => v.length > 0,
      message: 'At least one category is required'
    }
  },
  
  dimensions: {
    type: dimensionSchema,
    required: true
  },
  
  colorVariants: [colorVariantSchema],
  
  images: { // works find with cloudinary 
  primary: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  gallery: [{
    url: String,
    public_id: String,
  }],
  technical: [{
    url: String,
    public_id: String,
  }],
  roomScenes: [{
    url: String,
    public_id: String,
  }]
},

  
  pricing: priceSchema,
  
  inventory: {
    quantity: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10, min: 0 },
    status: {
      type: String,
      enum: ['in-stock', 'low-stock', 'out-of-stock', 'discontinued', 'pre-order'],
      default: 'in-stock'
    }
  },
  
  dynamicAttributes: [dynamicAttributeSchema],
  
  certifications: [{
    name: String,
    authority: String,
    certificateNumber: String,
    validUntil: Date
  }],
  
  supplier: {
    name: { type: String, required: true },
    contactInfo: { email: String, phone: String },
    leadTime: { type: Number, default: 14 }
  },
  
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens']
    }
  },
  
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  reviews: {
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0, min: 0 }
  },
  
  salesData: {
    totalSold: { type: Number, default: 0, min: 0 },
    lastSoldDate: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ sku: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ 'pricing.basePrice': 1 });
productSchema.index({ 'inventory.status': 1 });
productSchema.index({ 'seo.slug': 1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'dynamicAttributes.key': 1, 'dynamicAttributes.value': 1 });

// Auto-generate tags from public dynamic attributes
productSchema.pre('save', function(next) {
  if (this.isModified('dynamicAttributes')) {
    this.tags = this.dynamicAttributes
      .filter(attr => !attr.unit) // Exclude technical specs
      .map(attr => `${attr.key}:${attr.value}`.toLowerCase());
  }
  next();
});

// Auto-update inventory status
productSchema.pre('save', function(next) {
  if (this.inventory.quantity === 0) {
    this.inventory.status = 'out-of-stock';
  } else if (this.inventory.quantity <= this.inventory.lowStockThreshold) {
    this.inventory.status = 'low-stock';
  } else {
    this.inventory.status = 'in-stock';
  }


  next();
});

// Improved slug generation
productSchema.pre('save', async function(next) {
  if (this.isModified('name') || !this.seo?.slug) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    let uniqueSlug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await mongoose.model('Product').findOne(
        { 'seo.slug': uniqueSlug, _id: { $ne: this._id } }
      );
      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter++}`;
    }
    
    this.seo = this.seo || {};
    this.seo.slug = uniqueSlug;
  }

  
  next();
});

// Query helper for attributes
productSchema.query.byAttribute = function(key, value) {
  return this.where({
    'dynamicAttributes': {
      $elemMatch: { key, value }
    }
  });
};

// Find by slug
productSchema.statics.findBySlug = function(slug) {
  return this.findOne({ 'seo.slug': slug });
};

export default mongoose.model('Product', productSchema);