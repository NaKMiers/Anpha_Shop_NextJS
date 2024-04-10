import { connectDatabase } from '@/config/databse'
import AccountModel from '@/models/AccountModel'
import '@/models/CategoryModel'
import '@/models/ProductModel'
import ProductModel from '@/models/ProductModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /admin/account/all
export async function GET(req: NextRequest) {
  console.log('- Get All Accounts - ')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

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
          const searchFields = ['info', 'usingUser']

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

        if (key === 'usingUser') {
          filter[key] =
            params[key][0] === 'true' ? { $exists: true, $ne: null } : { $exists: false, $eq: null }
          continue
        }

        if (['expire', 'renew'].includes(key)) {
          // expire = true: < now && exist
          // expire = false: > now or not exist

          if (params[key][0] === 'true') {
            filter[key] = { $lt: new Date(), $exists: true, $ne: null }
          } else {
            filter.$or = [{ [key]: { $gt: new Date() } }, { [key]: { $exists: false } }]
          }
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
        select: 'title images category slug',
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
    const types = await ProductModel.find()
      .select('title category')
      .populate({
        path: 'category',
        select: 'title',
      })
      .lean()

    console.log(accounts)

    // return response
    return NextResponse.json({ accounts, amount, types }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
