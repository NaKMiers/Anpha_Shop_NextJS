import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'product',
    },
    content: {
      type: String,
      required: true,
    },
    replied: [
      {
        type: Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    hide: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const CommentModel = mongoose.model('comment', CommentSchema)
export default CommentModel

export interface IComment {
  userId: string
  productId: string
  content: string
  replied: string[]
  likes: string[]
  hide: boolean
}
