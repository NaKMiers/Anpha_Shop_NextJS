import { connectDatabase } from '@/config/database'
import AccountModel from '@/models/AccountModel'
import ProductModel from '@/models/ProductModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'
import momentTZ from 'moment-timezone'

// Models: Account, Product, Category
import '@/models/AccountModel'
import '@/models/CategoryModel'
import '@/models/ProductModel'
import { toUTC } from '@/utils/time'

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
    const filter: { [key: string]: any } = { active: true, usingUser: { $exists: true, $ne: null } }
    let sort: { [key: string]: any } = { expire: 1 } // default sort

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        // Special Cases ---------------------
        if (key === 'limit') {
          if (params[key][0] === 'no-limit') {
            itemPerPage = Number.MAX_SAFE_INTEGER
            skip = 0
          } else {
            itemPerPage = +params[key][0]
          }
          continue
        }

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

        if (key === 'product') {
          filter.type = params[key].length === 1 ? params[key][0] : { $in: params[key] }

          continue
        }

        if (key === 'active') {
          if (params[key][0] === 'all') delete filter[key]
          else if (params[key][0] === 'true') filter[key] = true
          else if (params[key][0] === 'false') filter[key] = false
          continue
        }

        if (key === 'usingUser') {
          if (params[key][0] === 'all') delete filter[key]
          else if (params[key][0] === 'true') filter[key] = { $exists: true, $ne: null }
          else if (params[key][0] === 'false') filter[key] = { $exists: false, $eq: null }
          continue
        }

        if (['expire', 'renew'].includes(key)) {
          // expire = true: < now && exist
          // expire = false: > now or not exist

          if (params[key][0] === 'true') {
            filter[key] = {
              $lt: momentTZ.tz(new Date(), 'Asia/Ho_Chi_Minh').toDate(),
              $exists: true,
              $ne: null,
            }
          } else {
            filter.$or = [
              { [key]: { $gt: momentTZ.tz(new Date(), 'Asia/Ho_Chi_Minh').toDate() } },
              { [key]: { $exists: false } },
            ]
          }
          continue
        }

        if (key === 'from-to') {
          const dates = params[key][0].split('|')

          if (dates[0] && dates[1]) {
            filter.begin = {
              $gte: toUTC(dates[0]),
              $lt: toUTC(dates[1]),
            }
          } else if (dates[0]) {
            filter.begin = {
              $gte: toUTC(dates[0]),
            }
          } else if (dates[1]) {
            filter.begin = {
              $lt: toUTC(dates[1]),
            }
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

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
      .sort({ sold: -1 })
      .lean()

    // return response
    return NextResponse.json({ accounts, amount, types }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
