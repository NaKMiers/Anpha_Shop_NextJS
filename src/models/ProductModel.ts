import { generateSlug } from '@/utils'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value >= 0
        },
        message: 'Invalid price',
      },
      min: 0,
    },
    description: {
      type: String,
    },
    flashsale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'flashsale',
    },
    tags: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tag',
          minlength: 1,
        },
      ],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    images: {
      type: [
        {
          type: String,
        },
      ],
      minlength: 1,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// pre-save hook to generate slug from title
ProductSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
  }

  next()
})

// create model from schema
const ProductModel = mongoose.models.product || mongoose.model('product', ProductSchema)
export default ProductModel

export interface IProduct {
  _id: string
  title: string
  oldPrice?: number
  price: number
  description: string
  flashsale?: string
  tags: string[]
  category: string
  images: string[]
  sold: number
  stock: number
  slug: string
  active: boolean
  createdAt: string
  updatedAt: string
}
