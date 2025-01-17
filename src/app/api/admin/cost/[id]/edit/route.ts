import { connectDatabase } from '@/config/database'
import CostModel from '@/models/CostModel'
import { toUTC } from '@/utils/time'
import { NextRequest, NextResponse } from 'next/server'

// Models: Cost, Cost Group
import '@/models/CostGroupModel'
import '@/models/CostModel'

// [PUT]: /admin/cost/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Cost - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to create cost
    const { costGroup, amount, desc, date } = await req.json()

    // create cost
    const updatedCost = await CostModel.findByIdAndUpdate(
      id,
      {
        $set: {
          costGroup,
          amount,
          desc,
          date: toUTC(date),
        },
      },
      { new: true }
    )
      .populate('costGroup')
      .lean()

    // return response
    return NextResponse.json({ updatedCost, message: 'Cost has been updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
