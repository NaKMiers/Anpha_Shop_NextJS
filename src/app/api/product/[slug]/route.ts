import { connectDatabase } from '@/config/database'
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
      active: true,
      category: product.category,
    })
      .populate('flashsale')
      .lean()

    // get comment of the current product
    let comments = await CommentModel.find({
      productId: product._id,
    })
      .populate('userId')
      .populate({
        path: 'replied',
        populate: {
          path: 'userId',
        },
        options: { sort: { likes: -1, createdAt: -1 }, limit: 6 },
      })
      .sort({ likes: -1, createdAt: -1 })
      .limit(12)
      .lean()

    comments = comments.map(comment => ({
      ...comment,
      userId: comment.userId._id,
      user: comment.userId,
      replied: comment.replied.map((reply: any) => ({
        ...reply,
        userId: reply.userId._id,
        user: reply.userId,
      })),
    }))

    return NextResponse.json({ product, relatedProducts, comments }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
