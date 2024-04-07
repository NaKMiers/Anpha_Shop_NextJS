import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'
import { formatPrice } from '@/utils/number'
import { NextRequest, NextResponse } from 'next/server'

// [PATCH]: /admin/user/:id/set-collaborator
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Remove Collaborator - ')

  // connect to database
  await connectDatabase()

  try {
    // remove collaborator
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          role: 'user',
        },
        $unset: {
          commission: 1,
        },
      },
      { new: true }
    )

    // stay in current page
    return NextResponse.json({
      message: `Collaborator "${updatedUser.email}" has been demoted`,
      user: updatedUser,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
