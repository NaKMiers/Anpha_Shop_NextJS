import { connectDatabase } from '@/config/database'
import { NextRequest, NextResponse } from 'next/server'
import CostModel from '@/models/CostModel'

// Models: Cost
import '@/models/CostModel'

// [POST]: /admin/cost/add
export async function POST(req: NextRequest) {
  console.log('- Add Cost - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to create cost
    const { costGroup, amount, desc, status, date } = await req.json()

    // create cost
    const cost = await CostModel.create({
      costGroup,
      amount,
      desc,
      status,
      date: date || null,
    })

    // return response
    return NextResponse.json({ cost, message: 'Create cost successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
