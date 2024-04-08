import { connectDatabase } from '@/config/databse'
import FlashsaleModel from '@/models/FlashsaleModel'
import ProductModel from '@/models/ProductModel'
import { NextRequest, NextResponse } from 'next/server'

// [DELETE]: /admin/flash-sale/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Flash Sales - ')

  // connect to database
  await connectDatabase()

  // get voucher ids to delete
  const { ids, productIds } = await req.json()

  try {
    // get delete flash sales
    const deletedFlashSales = await FlashsaleModel.find({ _id: { $in: ids } }).lean()

    // delete voucher from database
    await FlashsaleModel.deleteMany({ _id: { $in: ids } })

    // remove flashsale of all products which are applying the deleted flash sales
    await ProductModel.updateMany({ _id: { $in: productIds } }, { $set: { flashsale: null } })

    // return response
    return NextResponse.json(
      {
        deletedFlashSales,
        message: `Flash Sale ${deletedFlashSales
          .map(flashSale => `"${flashSale.value}"`)
          .reverse()
          .join(', ')} ${deletedFlashSales.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
