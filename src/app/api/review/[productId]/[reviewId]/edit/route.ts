import { connectDatabase } from '@/config/database'
import ReviewModel from '@/models/ReviewModel'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Models: Review
import '@/models/ReviewModel'

// [PUT]: /review/:productId/:reviewId/edit
export async function PUT(
  req: NextRequest,
  { params: { productId, reviewId } }: { params: { productId: string; reviewId: string } }
) {
  console.log('- Edit Review -')

  try {
    // connect to database
    await connectDatabase()

    // get current user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // check if userId is not found
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // check role (only admin can delete reviews)
    if (token?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // get data to edit review
    const { rating, content } = await req.json()

    // update review
    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      {
        $set: {
          rating,
          content,
        },
      },
      { new: true }
    )
      .populate({
        path: 'userId',
        select: 'firstname lastname username avatar',
      })
      .lean()

    // return response
    return NextResponse.json({ updatedReview, message: 'Update Review Successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
