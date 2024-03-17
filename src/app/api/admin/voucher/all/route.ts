import { connectDatabase } from '@/config/databse'
import VoucherModel from '@/models/VoucherModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [GET]: /admin/voucher/all
export async function GET(req: NextRequest) {
  console.log('- Get All Vouchers -')

  try {
    // get all vouchers from database
    const vouchers = await VoucherModel.find()
      .populate('owner', 'firstname lastname')
      .sort({ createdAt: -1 })
      .lean()

    // return vouchers
    return NextResponse.json({ vouchers, message: 'Get all vouchers successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
