import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET] /admin/user/all
export async function GET(req: NextRequest) {
  console.log('- Get All Users -')

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
          const searchFields = [
            'username',
            'email',
            'role',
            'String',
            'firstname',
            'lastname',
            'phone',
            'address',
            'job',
            'authType',
            'commission',
          ]

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

        if (key === 'accumulated' || key === 'balance') {
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
    const amount = await UserModel.countDocuments(filter)

    // get all users from database
    const users = await UserModel.find(filter).sort(sort).skip(skip).limit(itemPerPage).lean()

    // get all users without filter
    const urs = await UserModel.find().select('balance accumulated').lean()

    // return response
    return NextResponse.json({ users, amount, urs }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
