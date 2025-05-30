import mongoose from 'mongoose'
import { IUser } from './UserModel'
import { IVoucher } from './VoucherModel'
const Schema = mongoose.Schema

const OrderSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    email: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    voucherApplied: {
      type: Schema.Types.ObjectId,
      ref: 'voucher',
    },
    discount: {
      type: Number,
      default: 0,
    },
    items: {
      type: [
        {
          type: {},
        },
      ],
      minlength: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'done', 'cancel'],
      default: 'pending',
    },
    paymentMethod: {
      enum: ['momo', 'banking', 'balance'],
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const OrderModel = mongoose.models.order || mongoose.model('order', OrderSchema)

export default OrderModel

export interface IOrder {
  _id: string
  code: string
  userId: string | IUser
  email: string
  total: number
  voucherApplied?: string | IVoucher
  discount: number
  items: any[]
  status: TOrderStatus
  paymentMethod: TPaymentMethod
  createdAt: string
  updatedAt: string
}

export type TOrderStatus = 'pending' | 'done' | 'cancel'
export type TPaymentMethod = 'momo' | 'banking' | 'balance'
