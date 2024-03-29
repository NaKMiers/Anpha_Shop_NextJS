import { connectDatabase } from '@/config/databse'
import { generateOrderCode } from '@/utils'
import { NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [GET]: /api/checkout/get-order-code
export async function GET() {
  console.log('- Get Order Code -')

  try {
    // generate order code to create order
    const orderCode = await generateOrderCode(5)

    // return order code
    return NextResponse.json({ orderCode }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
