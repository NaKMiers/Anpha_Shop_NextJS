import { connectDatabase } from '@/config/database'
import CostGroupModel from '@/models/CostGroupModel'
import CostModel from '@/models/CostModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Cost Group, Cost
import '@/models/CostGroupModel'
import '@/models/CostModel'

// [DELETE]: /admin/cost-group/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Cost Groups - ')

  try {
    // connect to database
    await connectDatabase()

    // get cost group ids to delete
    const { ids } = await req.json()

    // only allow to delete cost groups that have no costs
    const hasCosts = await CostModel.exists({ costGroup: { $in: ids } })

    // check if cost groups have costs
    if (hasCosts) {
      return NextResponse.json(
        { message: 'Cannot delete this group, delete the costs first' },
        { status: 400 }
      )
    }

    // get delete cost groups
    const deletedCostGroups = await CostGroupModel.find({ _id: { $in: ids } }).lean()

    // delete cost groups from database
    await CostGroupModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedCostGroups,
        message: `Cost group ${deletedCostGroups
          .map(cg => `"${cg.title}"`)
          .reverse()
          .join(', ')} ${deletedCostGroups.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
