import { connectDatabase } from '@/config/databse'
import OrderModel from '@/models/OrderModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [GET]: /admin/order/all
export async function GET() {
  console.log('- Get All Orders -')

  try {
    // get all order from database
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean()

    // retunr all orders
    return NextResponse.json({ orders }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
