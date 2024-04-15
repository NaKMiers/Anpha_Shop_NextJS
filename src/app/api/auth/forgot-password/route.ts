import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'
import { sendResetPasswordEmail } from '@/utils/sendMail'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /auth/forgot-password
export async function POST(req: NextRequest) {
  console.log('- Forgot Password -')

  try {
    // connect to database
    await connectDatabase()

    // get email to send link to reset password
    const { email } = await req.json()

    // get user by email
    const user: any = await UserModel.findOne({ email }).lean()

    // check if email exists
    if (!user) {
      return NextResponse.json({ message: 'Email không tồn tại' }, { status: 404 })
    }

    // check if user is not local
    if (user.authType !== 'local') {
      return NextResponse.json(
        {
          message: `Email này được xác thực bởi ${user.authType}, bạn không thể thực hiện tính năng này`,
        },
        { status: 500 }
      )
    }

    // ready for sending email
    const mailHashed = await bcrypt.hash(email, +process.env.BCRYPT_SALT_ROUND! || 10)
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?email=${email}&token=${mailHashed}`

    sendResetPasswordEmail(email, url)

    // // send email
    // sendMail(email, 'Khôi phục mật khẩu', `<a href="${url}"> Đặt lại mật khẩu </a>`)

    // return response
    return NextResponse.json({
      sending: true,
      email,
      message: 'Link khôi phục mật khẩu đã được gửi đến email của bạn',
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
