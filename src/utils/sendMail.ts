import UserModel from '@/models/UserModel'
import fs from 'fs'
import nodeMailer from 'nodemailer'
import path from 'path'
import pug from 'pug'

// SENDMAIL CORE
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_APP_PASSWORD,
  },
})

function sendMail(to: string, subject: string, html: string) {
  transporter.sendMail(
    {
      from: 'Anpha Shop',
      to: to,
      subject: subject,
      html: html,
    },
    err => {
      if (err) {
        console.log({
          message: 'Error',
          err,
        })
      }
    }
  )
}

// send order notification to admin
async function notifyNewOrderToAdmin(newOrder: any) {
  // get email interface path
  const templatePath = path.resolve(process.cwd(), 'src/utils/emailTemplates/NotifyOrderMail.pug')

  console.log('templatePath', templatePath)

  // get email interface file
  const templateContent = fs.readFileSync(templatePath, 'utf-8')

  // Compile template
  const compiledTemplate = pug.compile(templateContent, {
    filename: templatePath,
  })

  // get admin and editor mails
  const admins: any[] = await UserModel.find({
    role: { $in: ['admin', 'editor'] },
  }).lean()
  let emails: string = admins.map(admin => admin.email).join(' ') + ' ' + process.env.MAIL!

  // render template with new order data
  const html = compiledTemplate(newOrder)
  sendMail(emails, 'New Order', html)
}

// notify shortage account to admin
async function notifyShortageAccount(message: any) {
  // get email interface path
  const templatePath = path.resolve(process.cwd(), 'src/utils/emailTemplates/ShortageAccountMail.pug')

  // get email interface file
  const templateContent = fs.readFileSync(templatePath, 'utf-8')

  // Compile template
  const compiledTemplate = pug.compile(templateContent, {
    filename: templatePath,
  })

  // get admin and editor mails
  const admins: any[] = await UserModel.find({
    role: { $in: ['admin', 'editor'] },
  }).lean()
  let emails: string = admins.map(admin => admin.email).join(' ') + ' ' + process.env.MAIL!

  // render template with new order data
  const html = compiledTemplate({ message })
  sendMail(emails, message, html)
}

// re-deliver notification
async function notifyDeliveryOrder(email: string, orderData: any) {
  // get email interface path
  const templatePath = path.resolve(process.cwd(), 'src/utils/emailTemplates/OrderMail.pug')

  // get email interface file
  const templateContent = fs.readFileSync(templatePath, 'utf-8')

  // Compile template
  const compiledTemplate = pug.compile(templateContent, {
    filename: templatePath,
  })

  // render template with order data
  const html = compiledTemplate(orderData)
  sendMail(email, 'Bạn có đơn hàng từ Anpha Shop', html)
}

// notify account updated
async function notifyAccountUpdated(email: string, data: any) {
  // get email interface path
  const templatePath = path.resolve(process.cwd(), 'src/utils/emailTemplates/UpdateAccountMail.pug')

  // get email interface file
  const templateContent = fs.readFileSync(templatePath, 'utf-8')
  // Compile template
  const compiledTemplate = pug.compile(templateContent, {
    filename: templatePath,
  })

  // render template with new data
  const html = compiledTemplate(data)
  console.log(html)
  sendMail(email, 'Cập nhật thông tin tài khoản', html)
}

// summary notification
async function summaryNotification(email: string, summary: any) {
  // get email interface path
  const templatePath = path.resolve(
    process.cwd(),
    'src/resources/views/Pages/EmailTemplates/SummaryMail.pug'
  )

  // get email interface file
  const templateContent = fs.readFileSync(templatePath, 'utf-8')

  // Compile template
  const compiledTemplate = pug.compile(templateContent, {
    filename: templatePath,
  })

  // Render template với dữ liệu
  const html = compiledTemplate(summary)
  sendMail(email, 'Monthly Summary', html)
}

export {
  notifyAccountUpdated,
  notifyDeliveryOrder,
  notifyNewOrderToAdmin,
  notifyShortageAccount,
  sendMail,
  summaryNotification,
}
