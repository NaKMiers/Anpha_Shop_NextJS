import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CostGroupSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

const CostGroupModel = mongoose.models.costGroup || mongoose.model('costGroup', CostGroupSchema)
export default CostGroupModel

export interface ICostGroup {
  _id: string
  title: string
  createdAt: string
  updatedAt: string
}
