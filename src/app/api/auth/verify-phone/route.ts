import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('- Verify Phone - ')

  try {
    // connect to database
    await connectDatabase()

    // get phone number
    const { phone } = await req.json()
    console.log('phone: ', phone)

    // check phone number
    const user = await UserModel.findOne({ phone }).lean()
    if (!user) {
      return NextResponse.json({ message: 'Số điện thoại không tồn tại' }, { status: 404 })
    }

    console.log('user: ', user)

    const accountSid = 'ACfc02f77be8b677b05ac82495e3351ce6'
    const authToken = '626acdaa75c6d153a87de5d1243b88f1'
    const client = require('twilio')(accountSid, authToken)

    const result = await client.messages.create({
      body: 'Iu Cham',
      from: 'Anpha Shop',
      to: '+84899320427',
    })

    console.log('result', result)

    return NextResponse.json(
      { message: `Mã xác minh đã được gửi tới số điện thoại ${phone}` },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
