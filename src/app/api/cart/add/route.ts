import { connectDatabase } from '@/config/databse'
import CartItemModel, { ICartItem } from '@/models/CartItemModel'
import ProductModel, { IProduct } from '@/models/ProductModel'
import { IUser } from '@/models/UserModel'
import { connection } from 'mongoose'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export type UserWithCart = IUser & { cart: ICartItem[]; cartLength: number }
export type CartItemWithProduct = ICartItem & { product: IProduct }

// [POST]: /cart/add
export async function POST(req: NextRequest) {
  console.log(' - Add Product To Cart - ')

  // connect to database
  await connectDatabase()

  // get product data to add to cart
  const { productId, quantity } = await req.json()
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const userId: any = token?._id

  try {
    // check if user logged in
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    // get product to check stock
    const product: IProduct | null = await ProductModel.findById(productId).lean()

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    // get user with cart
    // let userWithCart: UserWithCart[] = await UserModel.aggregate([
    //   { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    //   {
    //     $lookup: {
    //       from: 'cartitems',
    //       localField: '_id',
    //       foreignField: 'userId',
    //       as: 'cart',
    //     },
    //   },
    //   { $addFields: { cartLength: { $sum: '$cart.quantity' } } },
    // ])
    // const user: UserWithCart = userWithCart[0]

    // get user's cart
    let cart: ICartItem[] = await CartItemModel.find({ userId }).lean()

    // check if user exist
    // check if product already in cart
    const existingCartItem = cart.find((item: ICartItem) => item.productId.toString() === productId)

    // product has already existed in cart
    if (existingCartItem) {
      // if not enough products in stock
      if (existingCartItem.quantity + quantity > product.stock) {
        return NextResponse.json(
          {
            message: 'Hiện không đủ sản phẩm để thêm vào giỏ hàng của bạn. Xin lỗi vì sự bất tiện này',
          },
          { status: 400 }
        )
      }

      // still have enough products in stock
      let cartItem: any = await CartItemModel.findByIdAndUpdate(
        existingCartItem._id,
        {
          $inc: { quantity },
        },
        { new: true }
      )
        .populate('productId')
        .lean()

      // add product field to cart item
      cartItem = {
        ...cartItem,
        productId: cartItem.productId._id,
        product: cartItem.productId,
      }

      // calculate user cart length
      const cartLength = cart.reduce((total, cartItem) => total + cartItem.quantity, 0) + quantity

      // return data
      return NextResponse.json(
        {
          cartItem,
          cartLength,
          message: `Đã thêm ${quantity} gói "${product.title}" vào giỏ hàng`,
        },
        { status: 201 }
      )
    }

    // product has not existed in user cart
    // if not enough products in stock
    if (quantity > product.stock) {
      return NextResponse.json(
        {
          message: 'Hiện không đủ sản phẩm để thêm vào giỏ hàng của bạn. Xin lỗi vì sự bất tiện này',
        },
        { status: 400 }
      )
    }

    // still have enough products in stock
    // create new cart item
    const newCartItem = new CartItemModel({
      userId,
      productId: product._id,
      quantity,
    })
    // save cart item to database
    await newCartItem.save()

    const copiedCartItem = newCartItem.toObject()
    copiedCartItem.product = product

    // calculate user cart length
    const cartLength = cart.reduce((total, cartItem) => total + cartItem.quantity, 0) + quantity

    // return data
    return NextResponse.json(
      {
        cartItem: copiedCartItem,
        cartLength,
        message: `Đã thêm ${quantity} gói ${product.title} vào giỏ hàng`,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  } finally {
    // close connection
    connection.close()
  }
}
