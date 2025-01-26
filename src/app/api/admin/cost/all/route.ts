import { connectDatabase } from '@/config/database'
import CostModel from '@/models/CostModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { toUTC } from '@/utils/time'
import { NextRequest, NextResponse } from 'next/server'

// Models: Cost, Cost Group
import '@/models/CostGroupModel'
import '@/models/CostModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/cost/all
export async function GET(req: NextRequest) {
  console.log('- Get All Costs -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 100
    const filter: { [key: string]: any } = {}
    let sort: { [key: string]: any } = { date: -1 } // default sort

    console.log('params:', params)

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
            console.log('itemPerPage:', itemPerPage)
          }
          continue
        }

        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['desc', 'status']

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

        if (key === 'amount') {
          filter[key] = { $lte: +params[key][0] }
          continue
        }

        if (key === 'from-to') {
          const dates = params[key][0].split('|')

          if (dates[0] && dates[1]) {
            filter.date = {
              $gte: toUTC(dates[0]),
              $lt: toUTC(dates[1]),
            }
          } else if (dates[0]) {
            filter.date = {
              $gte: toUTC(dates[0]),
            }
          } else if (dates[1]) {
            filter.date = {
              $lt: toUTC(dates[1]),
            }
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    console.log('filter:', filter)
    console.log('sort:', sort)
    console.log('skip:', skip)

    // get amount of costs
    const amount = await CostModel.countDocuments(filter)

    // get all costs from database
    const costs = await CostModel.find(filter)
      .populate({
        path: 'costGroup',
        select: 'title',
      })
      .sort(sort)
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    // return all costs
    return NextResponse.json({ costs, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
