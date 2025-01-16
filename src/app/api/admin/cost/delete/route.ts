import { connectDatabase } from '@/config/database'
import CostModel from '@/models/CostModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Cost
import '@/models/CostModel'

// [DELETE]: /admin/cost/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Costs - ')

  try {
    // connect to database
    await connectDatabase()

    // get cost ids to delete
    const { ids } = await req.json()

    // get delete cost
    const deletedCosts = await CostModel.find({ _id: { $in: ids } }).lean()

    // delete costs from database
    await CostModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedCosts,
        message: `Cost ${deletedCosts
          .map(cg => `"${cg.title}"`)
          .reverse()
          .join(', ')} ${deletedCosts.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
