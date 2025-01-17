import { connectDatabase } from '@/config/database'
import CostModel from '@/models/CostModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Cost
import '@/models/CostModel'
import { toUTC } from '@/utils/time'

// [PUT]: /admin/cost/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Cost - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to create cost
    const { costGroup, amount, desc, status, date } = await req.json()

    console.log('id', id)
    console.log('costGroup', costGroup)
    console.log('amount', amount)
    console.log('desc', desc)
    console.log('status', status)
    console.log('date', date)

    // create cost
    const updatedCost = await CostModel.findByIdAndUpdate(
      id,
      {
        $set: {
          costGroup,
          amount,
          desc,
          status,
          date: date ? toUTC(date) : null,
        },
      },
      { new: true }
    ).lean()

    // return response
    return NextResponse.json({ updatedCost, message: 'Cost has been updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
