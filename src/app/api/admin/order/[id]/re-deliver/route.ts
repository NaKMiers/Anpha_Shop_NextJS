import { connectDatabase } from '@/config/databse'
import AccountModel from '@/models/AccountModel'
import OrderModel, { IOrder } from '@/models/OrderModel'
import ProductModel from '@/models/ProductModel'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import handleDeliverOrder from '@/utils/handleDeliverOrder'
import { notifyDeliveryOrder } from '@/utils/sendMail'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [PATCH]: /admin/order/:id/re-deliver
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Re-Deliver Order -')

  try {
    // get order to re-deliver
    let order: IOrder | null = await OrderModel.findById(id).lean()

    // voucher does not exist
    if (!order) {
      return NextResponse.json({ message: 'Order does not exist!' }, { status: 404 })
    }

    if (order.status !== 'done') {
      return NextResponse.json({ message: 'Order has not done yet!' }, { status: 400 })
    }

    const { email, voucherApplied, items } = order

    // get voucher description to create mail
    let voucherDescription
    if (voucherApplied) {
      const voucher: IVoucher | null = await VoucherModel.findOne({
        code: voucherApplied,
      }).lean()
      voucherDescription = voucher && voucher.desc
    }

    // create account data list to create mail
    const accountDataList = items.map(item => ({
      productId: item.product._id,
      quantity: item.quantity,
      accounts: item.accounts,
    }))

    // data transfering to email
    const orderData = {
      ...order,
      accounts: accountDataList,
      discount: voucherDescription,
    }

    // EMAIL
    notifyDeliveryOrder(email, orderData)

    // stay in current page
    return NextResponse.json({ message: 'Re-deliver Order Successfully!' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
