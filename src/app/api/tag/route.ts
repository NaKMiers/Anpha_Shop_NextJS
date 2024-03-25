import { connectDatabase } from '@/config/databse'
import ProductModel from '@/models/ProductModel'
import TagModel from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

export async function GET(req: NextRequest) {
  console.log('- Get Products By Tags -')

  // get query params
  const searchParams = req.nextUrl.searchParams
  const searchParamsObj: { [key: string]: string[] } = {}
  for (let key of Array.from(searchParams.keys())) {
    searchParamsObj[key] = searchParams.getAll(key)
  }

  const tagSlugs = searchParamsObj.tag ?? []

  try {
    // find products by tag base on search params
    const tags = await TagModel.find({ slug: { $in: tagSlugs } })
      .select('_id title')
      .lean()
    const tagIds = tags.map(tag => tag._id)

    // find products by tag ids
    const products = await ProductModel.find({ tags: { $in: tagIds } })
      .populate('tags')
      .populate('flashsale')
      .lean()

    return NextResponse.json({ tags, products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.nessage }, { status: 500 })
  }
}
