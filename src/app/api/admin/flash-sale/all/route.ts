import { connectDatabase } from '@/config/databse'
import FlashsaleModel from '@/models/FlashsaleModel'
import ProductModel from '@/models/ProductModel'
import { NextResponse } from 'next/server'

// [GET]: /admin/flash-sale/all
export async function GET() {
  console.log(' - Get All Flash Sales -')

  // connect to database
  await connectDatabase()

  try {
    // Get all flash sales from database
    const flashSales = await FlashsaleModel.find().sort({ createdAt: -1 }).lean()

    // get products associated with each flash sale
    const flashSalesWithProducts = await Promise.all(
      flashSales.map(async flashSale => {
        const products = await ProductModel.find({ flashsale: flashSale._id })
          .select('title images')
          .lean()
        return { ...flashSale, products }
      })
    )

    console.log('flashSalesWithProducts:', flashSalesWithProducts)

    // Return response
    return NextResponse.json({ flashSales: flashSalesWithProducts }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
