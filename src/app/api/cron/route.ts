import UserModel from '@/models/UserModel'
import { sendMail } from '@/utils/sendMail'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  // }

  sendMail('diwas118151@gmail.com', 'Cron Job', '<p>Cron Job</p>')

  return NextResponse.json({ message: 'Cron job executed successfully' })
}
