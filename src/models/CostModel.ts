import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CostSchema = new Schema(
  {
    costGroup: {
      type: Schema.Types.ObjectId,
      ref: 'costGroup',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
)

const CostModel = mongoose.models.cost || mongoose.model('cost', CostSchema)
export default CostModel

export interface ICost {
  _id: string
  costGroup: string
  amount: number
  desc: string
  status: string
  createdAt: string
  updatedAt: string
}
