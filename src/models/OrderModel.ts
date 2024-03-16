import mongoose from 'mongoose'
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
      type: String,
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
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// // generate order code before save
// OrderSchema.pre('save', async function (next) {
//    let orderCode = generateCode(5)

//    // check unique
//    while (await this.constructor.findOne({ code: orderCode })) {
//       orderCode = generateCode(5)
//    }
//    this.code = orderCode
//    next()
// })

const OrderModel = mongoose.models.order || mongoose.model('order', OrderSchema)
export default OrderModel

export interface IOrder {
  _id: string
  code: string
  userId: string
  email: string
  total: number
  voucherApplied?: string
  items: any[]
  status: 'pending' | 'done' | 'cancel'
  paymentMethod: string
}
