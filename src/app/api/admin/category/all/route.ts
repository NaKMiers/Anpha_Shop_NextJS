import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { max } from 'moment'
import { NextRequest, NextResponse } from 'next/server'

// [GET]: /admin/tag/all
export async function GET(req: NextRequest) {
  console.log('- Get All Categories -')

  // connect to database
  await connectDatabase()

  try {
    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)
    console.log('params: ', params)

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

        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        if (key === 'productQuantity') {
          filter[key] = { $lte: +params[key][0] }
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    console.log('filter: ', filter)
    console.log('sort: ', sort)

    // get amount of account
    const amount = await CategoryModel.countDocuments(filter)

    // get all categories from database
    const categories = await CategoryModel.find(filter).sort(sort).skip(skip).limit(itemPerPage).lean()

    // get all categories without filter
    const cates = await CategoryModel.find().select('title category productQuantity').lean()

    return NextResponse.json({ categories, amount, cates }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
