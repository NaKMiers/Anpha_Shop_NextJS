import { connectDatabase } from '@/config/database'
import CostGroupModel from '@/models/CostGroupModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Cost Group
import '@/models/CostGroupModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/cost-group/all
export async function GET(req: NextRequest) {
  console.log('- Get All Cost Groups -')

  try {
    // connect to database
    await connectDatabase()

    // get all cost groups from database
    const costGroups = await CostGroupModel.find().sort({ createdAt: -1 }).lean()

    // return all cost groups
    return NextResponse.json({ costGroups }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
