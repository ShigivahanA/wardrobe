import mongoose from 'mongoose'

const wardrobeItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    /* ======================
       Image
    ====================== */
    imageUrl: {
      type: String,
      required: true
    },

    imagePublicId: {
      type: String,
      required: true
    },

    /* ======================
       Core metadata
    ====================== */
    category: {
  type: String,
  required: true,
  enum: [
    'tshirt',
    'shirt',
    'top',
    'blouse',
    'tank_top',
    'sweater',
    'hoodie',
    'jacket',
    'coat',
    'blazer',
    'jeans',
    'pants',
    'shorts',
    'skirt',
    'leggings',
    'joggers',
    'dress',
    'jumpsuit',
    'romper',
    'overalls',
    'kurta',
    'saree',
    'lehenga',
    'salwar',
    'dhoti',
    'shoes',
    'sneakers',
    'sandals',
    'heels',
    'flats',
    'boots',
    'school_uniform',
    'sleepwear',
    'onesie',
    'innerwear',
    'nightwear',
    'loungewear',
    'cap',
    'hat',
    'scarf',
    'belt',
    'socks',
    'other',
  ],
  index: true,
},

    size: {
      type: String, // S, M, L, XL, 32, 34, etc.
      trim: true
    },

    colors: {
      type: [String], // hex codes or color names
      index: true
    },

    brand: {
      type: String,
      trim: true
    },

    occasion: {
  type: [String],
  enum: [
  'beach',
  'casual',
  'ethnic',
  'festival',
  'formal',
  'party',
  'sports',
  'travel',
  'work',
  'other',
],
  default: [],
  index: true
},

season: {
  type: [String],
  enum: [
  'autumn',
  'monsoon',
  'spring',
  'summer',
  'winter',
  'all',
],
  default: [],
  index: true
},
    /* ======================
       UX helpers
    ====================== */
    isFavorite: {
      type: Boolean,
      default: false,
      index: true
    },

    tags: {
      type: [String]
    },

    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
)

// Indexes for fast filtering
wardrobeItemSchema.index({ userId: 1, category: 1 })
wardrobeItemSchema.index({ userId: 1, colors: 1 })
wardrobeItemSchema.index({ userId: 1, isFavorite: 1 })

const WardrobeItem = mongoose.model('WardrobeItem', wardrobeItemSchema)

export default WardrobeItem
