import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  // }

  return NextResponse.json({ message: 'Cron job executed successfully' })
}
