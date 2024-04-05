import { connectDatabase } from '@/config/databse'
import AccountModel from '@/models/AccountModel'
import { NextRequest, NextResponse } from 'next/server'
import '@/models/ProductModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/account/all
export async function GET(req: NextRequest) {
  console.log('- Get All Accounts - ')

  // connect to database
  await connectDatabase()

  try {
    // get query params
    const searchParams = req.nextUrl.searchParams
    const searchParamsObj: { [key: string]: string[] } = {}
    for (let key of Array.from(searchParams.keys())) {
      searchParamsObj[key] = searchParams.getAll(key)
    }

    console.log('searchParams: ', searchParamsObj)

    let skip = 0
    let itemPerPage = 9
    const filter: { [key: string]: any } = {}

    for (const key in searchParamsObj) {
      if (searchParamsObj.hasOwnProperty(key)) {
        // handle page param
        if (key === 'page') {
          const page = +searchParamsObj[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (searchParamsObj[key].length === 1) {
          // 1 value
          filter[key] = searchParamsObj[key][0]
        } else {
          // array of values
          filter[key] = { $in: searchParamsObj[key] }
        }
      }
    }

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
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    // return response
    return NextResponse.json({ accounts, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
