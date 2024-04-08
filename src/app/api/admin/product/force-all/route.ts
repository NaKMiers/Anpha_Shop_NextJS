import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import ProductModel from '@/models/ProductModel'
import TagModel from '@/models/TagModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { create } from 'domain'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /admin/product/force-all
export async function GET() {
  console.log('- Get FORCE All Products -')

  // connect to database
  await connectDatabase()

  try {
    // get all products from database
    const products = await ProductModel.find().populate('tags category').sort({ createdAt: -1 }).lean()

    // return all products
    return NextResponse.json({ products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
