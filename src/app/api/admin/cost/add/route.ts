import { connectDatabase } from '@/config/database'
import CostModel from '@/models/CostModel'
import { NextRequest, NextResponse } from 'next/server'
import { toUTC } from '@/utils/time'

// Models: Cost
import '@/models/CostModel'
import '@/models/CostGroupModel'

// [POST]: /admin/cost/add
export async function POST(req: NextRequest) {
  console.log('- Add Cost - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to create cost
    const { costGroup, amount, desc, date } = await req.json()

    // create cost
    const cost = await CostModel.create({
      costGroup,
      amount,
      desc,
      date: toUTC(date),
    })

    // get just created cost to populate cost group
    const newCost = await CostModel.findById(cost._id).populate('costGroup').lean()

    // return response
    return NextResponse.json({ cost: newCost, message: 'Create cost successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
