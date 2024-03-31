import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'
import { connection } from 'mongoose'
import { NextResponse } from 'next/server'

// [GET] /admin/user/all
export async function GET() {
  console.log('- Get All Users -')

  // connect to database
  await connectDatabase()

  try {
    // get all users from database
    const users = await UserModel.find({}).sort({ createdAt: -1 }).lean()

    // return response
    return NextResponse.json({ users }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  } finally {
    // close connection
    connection.close()
  }
}
