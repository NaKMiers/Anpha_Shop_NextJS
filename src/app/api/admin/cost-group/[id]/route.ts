import { connectDatabase } from '@/config/database'
import CostGroupModel from '@/models/CostGroupModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Cost Group
import '@/models/CostGroupModel'

// [PUT]: /admin/cost-group/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Cost Group - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to update cost group
    const { title } = await req.json()

    // update cost group
    const updatedCostGroup = await CostGroupModel.findByIdAndUpdate(
      id,
      { $set: { title } },
      { new: true }
    ).lean()

    // return response
    return NextResponse.json(
      { updatedCostGroup, message: 'Cost group has been updated' },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
