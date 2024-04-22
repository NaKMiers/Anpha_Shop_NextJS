import NotifyCommentEmail from '@/components/emails/NotifyCommentEmail'
import NotifyExpiredEmail from '@/components/emails/NotifyExpiredEmail'
import NotifyOrderEmail from '@/components/emails/NotifyOrderEmail'
import OrderEmail from '@/components/emails/OrderEmail'
import ResetPasswordEmail from '@/components/emails/ResetPasswordEmail'
import ShortageAccountEmail from '@/components/emails/ShortageAccountEmail'
import { SummaryEmail } from '@/components/emails/SummaryEmail'
import UpdateInfoEmail from '@/components/emails/UpdateInfoEmail'
import VerifyEmailEmail from '@/components/emails/VerifyEmailEmail'
import VerifyPhoneEmail from '@/components/emails/VerifyPhoneEmail'
import { commentData, expiredData, order, summary, updateInfoData } from '@/constansts/emailDataSamples'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET() {
  let type = 'order'
  console.log(`- Cron: ${type}-`)

  const resend = new Resend(process.env.RESEND_SECRET)

  await Promise.all(
    ['diwas118151@gmail.com'].map(email => {
      switch (type) {
        case 'order': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>',
            to: ['anphashop92@gmail.com'],

            subject: 'Bạn có đơn hàng từ Anpha Shop',
            react: OrderEmail({ order }),
          })

          break
        }

        case 'update-info': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>', //
            to: email,
            subject: 'Cập nhật thông tin tài khoản',
            react: UpdateInfoEmail({ data: updateInfoData }),
          })

          break
        }

        case 'reset-password': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>', //
            to: email,
            subject: 'Khôi phục mật khẩu',
            react: ResetPasswordEmail({ name: 'Ohara', link: 'https://anpha.shop' }),
          })

          break
        }

        case 'veriy-email': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>', //
            to: email,
            subject: 'Xác minh email',
            react: VerifyEmailEmail({ name: 'Naruto', link: 'https://anpha.shop' }),
          })

          break
        }

        case 'veriy-phone': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>',
            to: email,
            subject: 'Xác minh số điện thoại',
            react: VerifyPhoneEmail({ name: 'Tanjiro', link: 'https://anpha.shop' }),
          })

          break
        }

        case 'notify-order': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>', //
            to: email,
            subject: 'Có đơn hàng mới',
            react: NotifyOrderEmail({ order }),
          })

          break
        }

        case 'summary': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>', //
            to: email,
            subject: 'Báo cáo thu nhập tháng ' + (new Date().getMonth() + 1),
            react: SummaryEmail({ summary }),
          })

          break
        }

        case 'notify-expired': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>',
            to: email,
            subject: 'Tài khoản của bạn sắp hết hạn',
            react: NotifyExpiredEmail({ data: expiredData }),
          })

          break
        }

        case 'shortage-account': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>',
            to: email,
            subject: 'Thiếu tài khoản Netflix 100 năm',
            react: ShortageAccountEmail({ message: 'Thiếu tài khoản Netflix 100 năm' }),
          })

          break
        }

        case 'notify-comment': {
          resend.emails.send({
            from: 'Anpha Shop <no-reply@anpha.shop>',
            to: email,
            subject: 'Có người vừa phản hồi bình luận của bạn',
            react: NotifyCommentEmail({ data: commentData }),
          })

          break
        }
      }
    })
  )

  return NextResponse.json({ message: 'Cron job executed successfully' })
}
