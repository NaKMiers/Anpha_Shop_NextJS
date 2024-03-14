import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'
import brcypt from 'bcrypt'
import { NextResponse } from 'next/server'

// connect to database
connectDatabase()

// [POST]: /auth/login
export async function POST(request: Request) {
  console.log('login')
  try {
    // get data from request body
    const { usernameOrEmail, password } = await request.json()

    // find user from database
    const user: any = await UserModel.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    }).lean()

    // check user exists or not in database
    if (!user) {
      return NextResponse.json({ message: 'Tài khoản hoặc mật khẩu không đúng' }, { status: 401 })
    }

    // check if user is not local
    if (user.authType !== 'local') {
      return NextResponse.json(
        { message: 'Tài khoản này được xác thực bởi ' + user.authType },
        { status: 401 }
      )
    }

    // check password
    const isValidPassword = await brcypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Tài khoản hoặc mật khẩu không đúng' }, { status: 401 })
    }

    // exclude password from user who have just logined
    const { password: hiddenPassword, ...otherDetails } = user

    // return response
    return NextResponse.json({ user: otherDetails, message: 'Đăng nhập thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 })
  }
}
