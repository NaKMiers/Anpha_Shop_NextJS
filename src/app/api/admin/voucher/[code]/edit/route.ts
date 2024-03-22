import { useParams } from 'next/navigation'
import { connectDatabase } from '@/config/databse'
import TagModel from '@/models/TagModel'
import VoucherModel from '@/models/VoucherModel'
import { generateSlug } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

// Connect to database
connectDatabase()

// [PUT]: /api/admin/tag/:code/edit
export async function PUT(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Edit Voucher -')

  // get data to edit
  const {
    code: newCode,
    desc,
    begin,
    expire,
    minTotal,
    maxReduce,
    type,
    value,
    timesLeft,
    owner,
    isActive,
  } = await req.json()

  try {
    // update voucher
    await VoucherModel.findOneAndUpdate(
      { code },
      {
        $set: {
          code: newCode,
          desc,
          begin,
          expire,
          minTotal,
          maxReduce,
          type,
          value,
          timesLeft,
          owner: owner || null,
          active: isActive,
        },
      }
    )

    return NextResponse.json({ message: 'Voucher has been updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
