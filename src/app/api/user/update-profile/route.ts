import { connectDatabase } from '@/config/databse'
import UserModel from '@/models/UserModel'
import { JWT, getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// Connect to database
connectDatabase()

// [PUT]: /user/update-profile
export async function PUT(req: NextRequest) {
  console.log('- Update Profile -')

  // get user and update date to update profile
  const { firstname, lastname, birthday, job, address } = await req.json()
  const token: JWT | null = await getToken({ req, secret: process.env.JWT_SECRET })
  const userId = token?._id

  try {
    // update user profile
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstname,
          lastname,
          birthday: new Date(birthday),
          job,
          address,
        },
      },
      { new: true }
    )

    // check if user exists
    if (!updatedUser) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 })
    }

    // return response
    return NextResponse.json({ updatedUser, message: 'Cập nhật thông tin thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
