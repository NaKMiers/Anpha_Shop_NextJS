import { connectDatabase } from '@/config/databse'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import UserModel from '@/models/UserModel'

// Connect to database
connectDatabase()

// [PATHC]: /auth/reset-password
export async function PATCH(request: NextRequest) {
  console.log('reset password')

  // get email and token from query
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  // get new password from request body
  const { newPassword } = await request.json()

  try {
    // check if email and token are exist
    if (email && token) {
      // check if token is valid
      const isValidToResetPassword = await bcrypt.compare(email, token)

      // if token is not valid
      if (!isValidToResetPassword) {
        return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 401 })
      }

      // hash new password
      const hashedPassword = await bcrypt.hash(newPassword, +process.env.BCRYPT_SALT_ROUND!)
      await UserModel.findOneAndUpdate({ email }, { $set: { password: hashedPassword } })

      // return success message
      return NextResponse.json({ message: 'Mật khẩu đã được thay đổi' })
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
