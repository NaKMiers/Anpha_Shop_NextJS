import { expiredData } from '@/app/email/notify-expired/page'
import { order } from '@/app/email/order/page'
import { summary } from '@/app/email/summary/page'
import { updateInfoData } from '@/app/email/update-info/page'
import NotifyExpiredEmail from '@/components/emails/NotifyExpiredEmail'
import NotifyOrderEmail from '@/components/emails/NotifyOrderEmail'
import OrderEmail from '@/components/emails/OrderEmail'
import ResetPasswordEmail from '@/components/emails/ResetPasswordEmail'
import { SummaryEmail } from '@/components/emails/SummaryEmail'
import UpdateInfoEmail from '@/components/emails/UpdateInfoEmail'
import VerifyEmailEmail from '@/components/emails/VerifyEmailEmail'
import VerifyPhoneEmail from '@/components/emails/VerifyPhoneEmail'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET() {
  let type = 'notify-expired'
  console.log(`- Cron: ${type}-`)

  const resend = new Resend('re_B1WYLHr1_8Rd4DtgeoqgjRtBLxwfEw3Fh')

  switch (type) {
    case 'order': {
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

    case 'veriy-email': {
      resend.emails.send({
        from: 'Anpha Shop <onboarding@resend.dev>',
        to: 'diwas118151@gmail.com',
        subject: 'Xác minh email',
        react: VerifyEmailEmail({ name: 'Naruto', link: 'https://anpha.shop' }),
      })
      break
    }

    case 'veriy-phone': {
      resend.emails.send({
        from: 'Anpha Shop <onboarding@resend.dev>',
        to: 'diwas118151@gmail.com',
        subject: 'Xác minh số điện thoại',
        react: VerifyPhoneEmail({ name: 'Tanjiro', link: 'https://anpha.shop' }),
      })
      break
    }

    case 'notify-order': {
      resend.emails.send({
        from: 'Anpha Shop <onboarding@resend.dev>',
        to: 'diwas118151@gmail.com',
        subject: 'Có đơn hàng mới',
        react: NotifyOrderEmail({ order }),
      })
      break
    }

    case 'summary': {
      resend.emails.send({
        from: 'Anpha Shop <onboarding@resend.dev>',
        to: 'diwas118151@gmail.com',
        subject: 'Báo cáo thu nhập tháng ' + (new Date().getMonth() + 1),
        react: SummaryEmail({ summary }),
      })
      break
    }

    case 'notify-expired': {
      resend.emails.send({
        from: 'Anpha Shop <onboarding@resend.dev>',
        to: 'diwas118151@gmail.com',
        subject: 'Tài khoản của bạn sắp hết hạn',
        react: NotifyExpiredEmail({ data: expiredData }),
      })
      break
    }

    default:
      break
  }

  return NextResponse.json({ message: 'Cron job executed successfully' })
}
