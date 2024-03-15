import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'
import { NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [GET] /admin/user/all
export async function GET() {
  console.log('get all users')

  try {
    // get all users from database
    const users = await UserModel.find({})

    // return response
    return NextResponse.json({ users }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
