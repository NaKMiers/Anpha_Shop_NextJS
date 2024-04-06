import { connectDatabase } from '@/config/databse'
import AccountModel from '@/models/AccountModel'
import { NextRequest, NextResponse } from 'next/server'
import '@/models/ProductModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import ProductModel from '@/models/ProductModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/account/all
export async function GET(req: NextRequest) {
  console.log('- Get All Accounts - ')

  // connect to database
  await connectDatabase()

  try {
    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)
    console.log('params: ', params)

    // options
    let skip = 0
    let itemPerPage = 9
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
          filter.$or = [
            { info: { $regex: params[key][0], $options: 'i' } },
            { usingUser: { $regex: params[key][0], $options: 'i' } },
          ]
          continue
        }

        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        if (key === 'usingUser') {
          filter[key] =
            params[key][0] === 'true' ? { $exists: true, $ne: null } : { $exists: false, $eq: null }
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    console.log('filter: ', filter)
    console.log('sort: ', sort)

    // get amount of account
    const amount = await AccountModel.countDocuments(filter)

    // get all account
    const accounts = await AccountModel.find(filter)
      .populate({
        path: 'type',
        select: 'title images category',
        populate: {
          path: 'category',
          select: 'title',
        },
      })
      .sort(sort)
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    // get all types
    const types = await ProductModel.find().select('title').lean()

    // return response
    return NextResponse.json({ accounts, amount, types }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
