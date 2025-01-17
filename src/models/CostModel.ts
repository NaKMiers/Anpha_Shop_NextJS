import mongoose from 'mongoose'
import { ICostGroup } from './CostGroupModel'
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
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

const CostModel = mongoose.models.cost || mongoose.model('cost', CostSchema)
export default CostModel

export interface ICost {
  _id: string
  costGroup: ICostGroup
  amount: number
  desc: string
  date: string
  createdAt: string
  updatedAt: string
}
