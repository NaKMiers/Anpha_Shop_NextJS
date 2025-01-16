import { connectDatabase } from '@/config/database'
import CostGroupModel from '@/models/CostGroupModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Cost Group
import '@/models/CostGroupModel'

// [POST]: /admin/cost-group/add
export async function POST(req: NextRequest) {
  console.log('- Add Cost Group - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to create cost group
    const { title } = await req.json()

    // create cost group
    const costGroup = await CostGroupModel.create({ title })

    // return response
    return NextResponse.json({ costGroup, message: 'Create cost group successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
