import { FullyComment } from '@/components/Comment'
import { connectDatabase } from '@/config/databse'
import CommentModel from '@/models/CommentModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// [PATCH]: /comment/:id/like
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Like Comment -')

  try {
    // connect to database
    await connectDatabase()

    // get current user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // get id and value to like to dislike
    const { value } = await req.json()

    // user does not exist
    if (!userId) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 401 })
    }

    // hide comment in database
    let comment: any = await CommentModel.findByIdAndUpdate(
      id,
      { $set: { hide: value === 'y' } },
      { new: true }
    )
      .populate('userId')
      .lean()

    if (!comment) {
      return NextResponse.json({ message: 'Bình luận không tồn tại' }, { status: 404 })
    }

    comment = {
      ...comment,
      userId: comment.userId._id,
      user: comment.userId,
    }

    // return response
    return NextResponse.json(
      { comment, message: `${value === 'y' ? 'Hide' : 'Show'} thành công` },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
