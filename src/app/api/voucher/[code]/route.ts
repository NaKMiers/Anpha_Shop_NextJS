import { connectDatabase } from '@/config/databse'
import VoucherModel from '@/models/VoucherModel'
import { NextRequest, NextResponse } from 'next/server'
import '@/models/UserModel'

// Connect to database
connectDatabase()

// [GET]: /voucher/:id
export async function GET(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Get Voucher -')

  console.log('code:', code)

  try {
    // get voucher from database
    const voucher = await VoucherModel.findOne({ code }).populate('owner').lean()
    // check voucher
    if (!voucher) {
      return NextResponse.json({ message: 'Voucher not found' }, { status: 404 })
    }
    // return voucher
    return NextResponse.json({ voucher, message: 'Voucher found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
