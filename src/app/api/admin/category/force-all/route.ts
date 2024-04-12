import { connectDatabase } from '@/config/databse'
import CategoryModel from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// [GET]: /admin/category/force-all
export async function GET(req: NextRequest) {
  console.log('- Get Force All Categories -')

  try {
    // connect to database
    await connectDatabase()

    // get all categories from database
    const categories = await CategoryModel.find().select('title').sort({ createdAt: -1 }).lean()

    return NextResponse.json({ categories }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
