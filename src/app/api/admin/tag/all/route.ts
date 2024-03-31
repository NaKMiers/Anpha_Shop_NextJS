import { connectDatabase } from '@/config/databse'
import TagModel from '@/models/TagModel'
import { connection } from 'mongoose'
import { NextResponse } from 'next/server'

// [GET]: /admin/tag/all
export async function GET() {
  console.log('- Get All Tags -')

  // connect to database
  await connectDatabase()

  try {
    // get all tags from database
    const tags = await TagModel.find().sort({ createdAt: -1 }).lean()

    return NextResponse.json({ tags }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  } finally {
    // close connection
    connection.close()
  }
}
