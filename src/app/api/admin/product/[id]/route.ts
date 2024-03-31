import { connectDatabase } from '@/config/databse'
import ProductModel from '@/models/ProductModel'
import { connection } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

// [GET]: /product/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get Product -')

  // connect to database
  await connectDatabase()

  try {
    // get product from database
    const product = await ProductModel.findById(id).lean()

    // return product
    return NextResponse.json({ product, message: 'Product found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  } finally {
    // close connection
    connection.close()
  }
}
