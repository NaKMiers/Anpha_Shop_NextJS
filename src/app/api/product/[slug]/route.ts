import { connectDatabase } from '@/config/databse'
import { ICategory } from '@/models/CategoryModel'
import CommentModel from '@/models/CommentModel'
import { IFlashsale } from '@/models/FlashsaleModel'
import ProductModel, { IProduct } from '@/models/ProductModel'
import { ITag } from '@/models/TagModel'
import '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// products with category and tags and flashsale
export type FullyProduct = IProduct & {
  category: ICategory
  tags: ITag[]
  flashsale: IFlashsale
}

// [GET]: /product/:slug
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Product Page -')

  try {
    // connect to database
    await connectDatabase()

    // // get user id to check hidden comments
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // get product from database
    const product: FullyProduct | null = await ProductModel.findOne({
      slug: encodeURIComponent(slug),
      active: true,
    })
      .populate('tags')
      .populate('category')
      .populate('flashsale')
      .lean()

    // check if product is not found
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    // get relatedProducts from database
    const relatedProducts: IProduct[] = await ProductModel.find({
      _id: { $ne: product._id },
      category: product.category,
      active: true,
    })
      .populate('flashsale')
      .lean()

    // get comment of the current product
    let comments = await CommentModel.find({
      productId: product._id,
      // $or: [...orCondition.filter(c => c)],
      $or: [{ hide: false }, { userId }],
    })
      .populate('userId')
      .populate({
        path: 'replied',
        populate: {
          path: 'userId',
        },
      })
      .sort({ likes: -1, createdAt: -1 })
      .limit(6)
      .lean()

    comments = comments.map(comment => ({
      ...comment,
      user: comment.userId,
      replied: comment.replied.map((reply: any) => ({
        ...reply,
        user: reply.userId,
      })),
    }))

    console.log('comments', comments)

    return NextResponse.json({ product, relatedProducts, comments }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
