import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import ProductModel from '@/models/ProductModel'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  console.log('- Get Products By Categories -')

  // connect to database
  await connectDatabase()

  // get query params
  const searchParams = req.nextUrl.searchParams
  const searchParamsObj: { [key: string]: string[] } = {}
  for (let key of Array.from(searchParams.keys())) {
    searchParamsObj[key] = searchParams.getAll(key)
  }

  const categorySlugs = searchParamsObj.ctg ?? []

  try {
    // find products by category base on search params
    const categories = await CategoryModel.find({ slug: { $in: categorySlugs } })
      .select('_id title')
      .lean()
    const categoryIds = categories.map(ctg => ctg._id)

    // find products by category ids
    const products = await ProductModel.find({ category: { $in: categoryIds } })
      .populate('tags')
      .populate('flashsale')
      .lean()

    return NextResponse.json({ categories, products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.nessage }, { status: 500 })
  }
}
