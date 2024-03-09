import { user } from './../../../../libs/reducers/userReducer'
import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'
import brcypt from 'bcrypt'
import { NextResponse } from 'next/server'

// connect to database
connectDatabase()

// [POST]: /auth/login
export async function POST(request: Request) {
  console.log('register')
  let { username, email, password } = await request.json()
  email = email.toLowerCase()

  try {
    // check if user is already exist in database
    const existingUser: any = await UserModel.findOne({ $or: [{ email }, { username }] }).lean()

    if (existingUser) {
      return NextResponse.json(
        { message: 'Tài khoản đã tồn tại, vui lòng nhập email hoặc username khác' },
        { status: 401 }
      )
    }
    // create new user
    const newUser = new UserModel({ username, email, password })
    await newUser.save()

    // get the user has just registed from database
    const userRegistered: any = await UserModel.findOne({
      $or: [{ email: newUser.email }, { username: newUser.username }],
    }).lean()

    // exclude password from userRegistered
    const { password: hiddenPassword, ...otherDetails } = userRegistered

    // return home page
    return NextResponse.json({ user: otherDetails }, { status: 200 })
  } catch (err) {
    return NextResponse.json(err, { status: 500 })
  }
}
