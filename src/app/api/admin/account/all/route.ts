import { connectDatabase } from '@/config/databse'
import AccountModel from '@/models/AccountModel'
import { NextResponse } from 'next/server'
import '@/models/ProductModel'

// Connect to database
connectDatabase()

// [GET]: /admin/account/all
export async function GET() {
  console.log('- Get All Account - ')

  try {
    // get all account
    const accounts = await AccountModel.find()
      .populate('type', 'title images')
      .populate('type.category', 'title')
      .sort({ createdAt: -1 })
      .lean()

    // return response
    return NextResponse.json({ accounts }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
