import { order } from '@/app/email/order/page'
import { updateInfoData } from '@/app/email/update-info/page'
import OrderEmail from '@/components/emails/OrderEmail'
import ResetPasswordEmail from '@/components/emails/ResetPasswordMail'
import UpdateInfoEmail from '@/components/emails/UpdateInfoEmail'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET() {
  let type = 'reset-password'
  console.log(`- Cron: ${type}-`)

  const resend = new Resend('re_B1WYLHr1_8Rd4DtgeoqgjRtBLxwfEw3Fh')

  switch (type) {
    case 'order': {
      // order email
      resend.emails.send({
        from: 'Anpha Shop <onboarding@resend.dev>',
        to: 'diwas118151@gmail.com',
        subject: 'Bạn có đơn hàng từ Anpha Shop',
        react: OrderEmail({ order }),
      })
      break
    }

    case 'update-info': {
      resend.emails.send({
        from: 'Anpha Shop <onboarding@resend.dev>',
        to: 'diwas118151@gmail.com',
        subject: 'Cập nhật thông tin tài khoản',
        react: UpdateInfoEmail({ data: updateInfoData }),
      })
      break
    }

    case 'reset-password': {
      resend.emails.send({
        from: 'Anpha Shop <onboarding@resend.dev>',
        to: 'diwas118151@gmail.com',
        subject: 'Khôi phục mật khẩu',
        react: ResetPasswordEmail({ name: 'Ohara', link: 'https://anpha.shop' }),
      })
      break
    }

    default:
      break
  }

  // update info email

  return NextResponse.json({ message: 'Cron job executed successfully' })
}
