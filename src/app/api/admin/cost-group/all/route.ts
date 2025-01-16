import { connectDatabase } from '@/config/database'
import CostGroupModel from '@/models/CostGroupModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { toUTC } from '@/utils/time'
import { NextRequest, NextResponse } from 'next/server'

// Models: Cost Group
import '@/models/CostGroupModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/cost-group/all
export async function GET(req: NextRequest) {
  console.log('- Get All Cost Groups -')

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
          const searchFields = ['title']

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

        if (key === 'from-to') {
          const dates = params[key][0].split('|')

          if (dates[0] && dates[1]) {
            filter.createdAt = {
              $gte: toUTC(dates[0]),
              $lt: toUTC(dates[1]),
            }
          } else if (dates[0]) {
            filter.createdAt = {
              $gte: toUTC(dates[0]),
            }
          } else if (dates[1]) {
            filter.createdAt = {
              $lt: toUTC(dates[1]),
            }
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of cost groups
    const amount = await CostGroupModel.countDocuments(filter)

    // get all cost groups from database
    const costGroups = await CostGroupModel.find(filter).sort(sort).skip(skip).limit(itemPerPage).lean()

    // return all cost groups
    return NextResponse.json({ costGroups, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
