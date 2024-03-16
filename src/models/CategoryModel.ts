import mongoose from 'mongoose'
import { generateSlug } from '@/utils'
const Schema = mongoose.Schema

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    productQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
)

// pre-save hook to generate slug from title
CategorySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title, this._id)
  }
  next()
})

const CategoryModel = mongoose.models.category || mongoose.model('category', CategorySchema)
export default CategoryModel

export interface ICategory {
  _id: string
  title: string
  slug: string
  productQuantity: number
}
