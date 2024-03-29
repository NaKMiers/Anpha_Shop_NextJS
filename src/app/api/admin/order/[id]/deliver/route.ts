import { connectDatabase } from '@/config/databse'
import AccountModel from '@/models/AccountModel'
import ProductModel from '@/models/ProductModel'
import VoucherModel from '@/models/VoucherModel'
import handleDeliverOrder from '@/utils/handleDeliverOrder'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [PATCH]: /admin/order/:id/deliver
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('deliverOrder')

  try {
    // --------- Reset -- only for DEVELOPER
    const reset = false // false is default
    if (reset) {
      await VoucherModel.updateMany(
        {},
        {
          $set: {
            usedUsers: [],
            accumulated: 0,
            timesLeft: 5,
          },
        }
      )
      await ProductModel.updateMany({}, { $set: { sold: 0, stock: 0 } })
      await AccountModel.updateMany(
        {},
        {
          $unset: { begin: 1, expire: 1 },
          $set: { usingUser: null },
        }
      )

      return NextResponse.json({ message: 'Reset Successfully!' }, { status: 200 })
    }
    // --------- Reset -- only for DEVELOPER

    // handle deliver order
    const response: any = await handleDeliverOrder(id)

    if (response.isError) {
      return NextResponse.json({ message: 'Deliver Order Failure!' }, { status: 500 })
    }

    // notify delivery order
    return NextResponse.json({ message: 'Deliver Order Successfully!' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
