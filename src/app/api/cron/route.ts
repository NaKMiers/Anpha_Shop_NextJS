import NotifyOrderEmail from '@/components/email/NotifyOrderEmail'
import OrderEmail from '@/components/email/OrderEmail'
import ResetPasswordEmail from '@/components/email/ResetPasswordEmail'
import ShortageAccountEmail from '@/components/email/ShortageAccountEmail'
import SummaryEmail from '@/components/email/SummaryEmail'
import UpdateInfoEmail from '@/components/email/UpdateInfoEmail'
import VerifyEmailEmail from '@/components/email/VerifyEmailEmail'
import { order, summary, updateInfoData } from '@/constansts/emailDataSamples'
import UserModel from '@/models/UserModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import nodeMailer from 'nodemailer'

export const dynamic = 'force-dynamic'

// SEND MAIL CORE
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_MAIL,
    pass: process.env.MAIL_APP_PASSWORD,
  },
})

async function sendMail(to: string | string[], subject: string, html: string) {
  console.log('- Send Mail -')
  const res = await transporter.sendMail({
    from: 'Anpha Shop <no-reply@anpha.shop>',
    to: to,
    subject: subject,
    html: html,
  })

  console.log('res:', res)
  return res
}

export async function GET(req: NextRequest) {
  console.log(`- Cron -`)

  // get query params
  const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)
  const type = params.type[0]

  console.log('type:', type)
  const email = 'diwas118151@gmail.com'

  switch (type) {
    case 'order': {
      console.log('- Notify Delivery Order -')

      try {
        const html = render(OrderEmail({ order }))
        console.log('html:', html)
        const res = await sendMail(email, 'Bạn có đơn hàng từ Anpha Shop', html)

        return NextResponse.json({ mailRes: res }, { status: 200 })
      } catch (err: any) {
        console.log(err)
      }

      break
    }

    case 'update-info': {
      console.log('- Notify Account Updated -')

      try {
        // render template with new data
        const html = render(UpdateInfoEmail({ data: updateInfoData }))
        const res = await sendMail(email, 'Cập nhật thông tin tài khoản', html)

        return NextResponse.json({ mailRes: res })
      } catch (err: any) {
        console.log(err)
      }

      break
    }

    case 'reset-password': {
      console.log('- Send Reset Password Email -')

      try {
        // Render template với dữ liệu
        const html = render(ResetPasswordEmail({ name: 'Ohaha', link: 'https://apha.shop' }))
        const res = await sendMail(email, 'Khôi phục mật khẩu', html)

        return NextResponse.json({ mailRes: res })
      } catch (err: any) {
        console.log(err)
      }

      break
    }

    case 'verify-email': {
      console.log('- Send Verify Email -')

      try {
        // Render template với dữ liệu
        const html = render(VerifyEmailEmail({ name: 'Anpha', link: 'https://anpha.shop' }))
        const res = await sendMail(email, 'Xác minh email', html)

        return NextResponse.json({ mailRes: res })
      } catch (err: any) {
        console.log(err)
      }

      break
    }

    case 'notify-order': {
      console.log('- Notify New Order To Admin -')

      try {
        // get admin and editor mails
        const admins: any[] = await UserModel.find({
          role: { $in: ['admin', 'editor'] },
        }).lean()
        let emails: string[] = [...admins.map(admin => admin.email), process.env.NEXT_PUBLIC_MAIL]

        const html = render(NotifyOrderEmail({ order }))
        const res = await sendMail(emails, 'New Order', html)

        return NextResponse.json({ mailRes: res })
      } catch (err: any) {
        console.log(err)
      }

      break
    }

    case 'summary': {
      console.log('- Summary Notification -')

      try {
        // Render template với dữ liệu
        const html = render(SummaryEmail({ summary }))
        const res = await sendMail(email, `Báo cáo thu nhập tháng ${new Date().getMonth() + 1}`, html)

        return NextResponse.json({ mailRes: res })
      } catch (err: any) {
        console.log(err)
      }

      break
    }

    case 'shortage-account': {
      console.log('- Notify Shortage Account -')

      try {
        // get admin and editor mails
        const admins: any[] = await UserModel.find({
          role: { $in: ['admin', 'editor'] },
        }).lean()
        let emails: string[] = [...admins.map(admin => admin.email), process.env.NEXT_PUBLIC_MAIL]

        // render template with new order data
        const message = 'Thiếu sản phẩm netflix 100 năm'
        const html = render(ShortageAccountEmail({ message }))
        const res = await sendMail(emails, message, html)

        return NextResponse.json({ mailRes: res })
      } catch (err: any) {
        console.log(err)
      }

      break
    }
  }

  return NextResponse.json({ message: 'Cron job executed successfully' })
}
