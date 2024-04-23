import NotifyExpiredEmail from '@/components/emails/NotifyExpiredEmail'
import NotifyOrderEmail from '@/components/emails/NotifyOrderEmail'
import OrderEmail from '@/components/emails/OrderEmail'
import ResetPasswordEmail from '@/components/emails/ResetPasswordEmail'
import ShortageAccountEmail from '@/components/emails/ShortageAccountEmail'
import SummaryEmail from '@/components/emails/SummaryEmail'
import UpdateInfoEmail from '@/components/emails/UpdateInfoEmail'
import VerifyEmailEmail from '@/components/emails/VerifyEmailEmail'
import UserModel from '@/models/UserModel'
import { render } from '@react-email/render'
import nodeMailer from 'nodemailer'

// SEND MAIL CORE
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_MAIL,
    pass: process.env.MAIL_APP_PASSWORD,
  },
})

export async function sendMail(to: string | string[], subject: string, html: string) {
  console.log('- Send Mail -')
  const response = await transporter.sendMail({
    from: 'Anpha Shop <no-reply@anpha.shop>',
    to: to,
    subject: subject,
    html: html,
  })

  return response
}

// send order notification to admin
export async function notifyNewOrderToAdmin(newOrder: any) {
  console.log('- Notify New Order To Admin -')

  // get admin and editor mails
  const admins: any[] = await UserModel.find({
    role: { $in: ['admin', 'editor'] },
  }).lean()
  let emails: string[] = [...admins.map(admin => admin.email), process.env.NEXT_PUBLIC_MAIL]

  const html = render(NotifyOrderEmail({ order: newOrder }))
  const res = await sendMail(emails, 'New Order', html)

  return res
}

// notify shortage account to admin
export async function notifyShortageAccount(message: any) {
  console.log('- Notify Shortage Account -')

  // get admin and editor mails
  const admins: any[] = await UserModel.find({
    role: { $in: ['admin', 'editor'] },
  }).lean()
  let emails: string[] = [...admins.map(admin => admin.email), process.env.NEXT_PUBLIC_MAIL]

  // render template with new order data
  const html = render(ShortageAccountEmail({ message }))
  const res = await sendMail(emails, message, html)
  return res
}

// deliver notification
export async function notifyDeliveryOrder(email: string, orderData: any) {
  console.log('- Notify Delivery Order -')

  console.log('orderData:', orderData)

  const html = render(OrderEmail({ order: orderData }))
  const res = await sendMail(email, 'Bạn có đơn hàng từ Anpha Shop', html)
  return res
}

// notify account updated
export async function notifyAccountUpdated(email: string, data: any) {
  console.log('- Notify Account Updated -')

  console.log('Data:', data)

  // render template with new data
  const html = render(UpdateInfoEmail({ data }))
  const res = await sendMail(email, 'Cập nhật thông tin tài khoản', html)
  return res
}

// summary notification
export async function summaryNotification(email: string, summary: any) {
  console.log('- Summary Notification -')

  // Render template với dữ liệu
  const html = render(SummaryEmail({ summary }))
  const res = await sendMail(email, 'Monthly Summary', html)
  return res
}

// reset password email
export async function sendResetPasswordEmail(email: string, name: string, link: string) {
  console.log('- Send Reset Password Email -')

  // Render template với dữ liệu
  const html = render(ResetPasswordEmail({ name, link }))
  const res = await sendMail(email, 'Khôi phục mật khẩu', html)
  return res
}

// notify expired account
export async function notifyExpiredAccount(email: string, data: any) {
  console.log('- Notify Expired Account -')

  // render template with new data
  const html = render(NotifyExpiredEmail({ data }))
  const res = await sendMail(email, 'Tài khoản sắp hết hạn', html)
  return res
}

// verify email
export async function sendVerifyEmail(email: string, name: string, link: string) {
  console.log('- Send Verify Email -')

  // Render template với dữ liệu
  const html = render(VerifyEmailEmail({ name, link }))
  const res = await sendMail(email, 'Xác minh email', html)
  return res
}

// verify phone
export async function sendVerifyPhone(phone: string, name: string, code: string) {
  console.log('- Send Verify Phone -')
}

// notify that your introduce code has been used
export async function notifyUsedIntroduceCode(email: string, data: any) {
  console.log('- Notify Used Introduce Code -')
}
