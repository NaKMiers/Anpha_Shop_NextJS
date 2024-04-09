import { connectDatabase } from '@/config/databse'
import '@/models/FlashsaleModel'
import ProductModel from '@/models/ProductModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /flashsale
export async function GET(req: NextRequest) {
  console.log('- Get Flash Sale Products -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 8
    const filter: { [key: string]: any } = {}
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        // Special Cases ---------------------
        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['title', 'description', 'slug']

          filter.$or = searchFields.map(field => ({
            [field]: { $regex: params[key][0], $options: 'i' },
          }))
          continue
        }

        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        if (key === 'ctg') {
          filter.slug = { $in: params[key] }
          continue
        }

        if (['price', 'stock'].includes(key)) {
          filter[key] = { $lte: +params[key][0] }
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    console.log('filter: ', filter)
    console.log('sort: ', sort)

    // get slug to filter categories
    const { slug } = filter
    delete filter.slug

    // get all products from database
    const products = await ProductModel.find({
      active: true,
      flashsale: { $exists: true, $ne: null },
      ...filter,
    })
      .populate('flashsale')
      .sort(sort)
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    // get amount of account
    const amount = await ProductModel.countDocuments({
      active: true,
      flashsale: { $exists: true, $ne: null },
      ...filter,
    })

    // get min - max values
    const chops = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          minStock: { $min: '$stock' },
          maxStock: { $max: '$stock' },
        },
      },
    ])

    // return flashsale products
    return NextResponse.json({ products, amount, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
