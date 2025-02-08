import { connectDatabase } from '@/config/database'
import { NextRequest, NextResponse } from 'next/server'
import ProductModel, { IProduct } from '@/models/ProductModel'

// Models: Product
import '@/models/ProductModel'

export const dynamic = 'force-dynamic'

// [GET]: /product/suggest
export async function GET(req: NextRequest) {
  console.log('- Get Suggestions -')

  try {
    // connect to database
    await connectDatabase()

    // get exclude products from req.nextUrl.searchParams
    const excludeProducts: string[] = req.nextUrl.searchParams.getAll('exclude')

    // get suggested(booted) products
    const products: IProduct[] = await ProductModel.find({
      _id: { $nin: excludeProducts },
      booted: true,
      active: true,
    })
      .populate('flashSale')
      .limit(6)
      .sort({ sold: -1 })
      .lean()

    excludeProducts.push(...products.map(product => product._id))

    // suggestion must be at least 6 products
    if (products.length < 6) {
      const additionalProducts = await ProductModel.find({
        _id: { $nin: excludeProducts },
        active: true,
      })
        .limit(6 - products.length)
        .sort({ sold: -1 })

      products.push(...additionalProducts)
    }

    // shuffle products
    products.sort(() => Math.random() - 0.5)

    // return response
    return NextResponse.json({ products, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
