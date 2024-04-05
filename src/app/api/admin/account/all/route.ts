import { connectDatabase } from '@/config/databse'
import AccountModel from '@/models/AccountModel'
import { NextResponse } from 'next/server'
import '@/models/ProductModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/account/all
export async function GET() {
  console.log('- Get All Accounts - ')

  // connect to database
  await connectDatabase()

  try {
    // get all account
    const accounts = await AccountModel.find()
      .populate({
        path: 'type',
        select: 'title images category',
        populate: {
          path: 'category',
          select: 'title',
        },
      })
      .sort({ createdAt: -1 })
      .lean()

    // return response
    return NextResponse.json({ accounts }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
