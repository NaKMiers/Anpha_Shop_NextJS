import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PATHC]: /auth/reset-password
export async function PATCH(req: NextRequest) {
  console.log('- Reset Password -')

  try {
    // connect to database
    await connectDatabase()

    // get email and token from query
    const searchParams = req.nextUrl.searchParams
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    // get new password from req body
    const { newPassword } = await req.json()

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
