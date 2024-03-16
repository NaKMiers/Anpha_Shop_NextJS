import { connectDatabase } from '@/config/databse'
import TagModel from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [GET]: /admin/tag/all
export async function GET() {
  console.log('- Get All Tags -')

  try {
    // get all tags from database
    const tags = await TagModel.find().sort({ createdAt: -1 }).lean()

    return NextResponse.json({ tags }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
