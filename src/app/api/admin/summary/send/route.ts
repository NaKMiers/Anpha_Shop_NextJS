import { connectDatabase } from '@/config/databse'
import UserModel, { IUser } from '@/models/UserModel'
import VoucherModel from '@/models/VoucherModel'
import { summaryNotification } from '@/utils/sendMail'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /admin/summary/send
export async function POST(req: NextRequest) {
  console.log('- Send Summaries')

  // connect to database
  await connectDatabase()

  // get product ids to delete
  const { ids } = await req.json()

  try {
    // get voucher of this collaborator
    const vouchers = await VoucherModel.find({
      owner: { $in: ids },
      $or: [{ active: true }, { active: { $exists: false } }],
    }).lean()

    // get collaborator
    const collaborators: IUser[] = await UserModel.find({ _id: { $in: ids } }).lean()

    // get summaries
    const summaries = collaborators.map(collaborator => {
      // calculate income from vouchers
      const income = vouchers.reduce((total, voucher) => total + voucher.accumulated, 0)

      return {
        collaborator,
        income,
        vouchers,
      }
    })

    // send EMAIL to collaborators
    summaries.forEach(async summary => {
      summaryNotification(summary.collaborator.email, summary)
    })

    // increase total income and reset income of collaborators
    await Promise.all(
      collaborators.map(collaborator => {
        const income =
          summaries.find(summary => summary.collaborator._id === collaborator._id)?.income || 0

        return UserModel.findByIdAndUpdate(collaborator._id, {
          $inc: { totalIncome: income },
          $set: { income: 0 },
        })
      })
    )

    // clear voucher accumulated
    const voucherIds = vouchers.map(voucher => voucher._id)
    await VoucherModel.updateMany({ _id: { $in: voucherIds } }, { $set: { accumulated: 0 } })

    // return response
    return NextResponse.json({ message: 'Summary has been sent' })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
