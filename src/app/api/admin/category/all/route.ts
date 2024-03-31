import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import { connection } from 'mongoose'
import { NextResponse } from 'next/server'

// [GET]: /admin/tag/all
export async function GET() {
  console.log('- Get All Categories -')

  // connect to database
  await connectDatabase()

  try {
    // get all categories from database
    const categories = await CategoryModel.find().sort({ createdAt: -1 }).lean()

    return NextResponse.json({ categories }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  } finally {
    // close connection
    connection.close()
  }
}
