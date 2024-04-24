import { connectDatabase } from '@/config/database'
import { ICategory } from '@/models/CategoryModel'
import OrderModel from '@/models/OrderModel'
import { ITag } from '@/models/TagModel'
import UserModel, { IUser } from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'
import { newUsedVoucherStatCalc } from './../../../utils/stat'

// Models: User, Account, Voucher, Category, Tag, Order, Product
import '@/models/AccountModel'
import '@/models/CategoryModel'
import '@/models/OrderModel'
import '@/models/ProductModel'
import ProductModel from '@/models/ProductModel'
import '@/models/TagModel'
import '@/models/UserModel'
import '@/models/VoucherModel'
import { newAccountSoldStatCalc, newOrderStatCalc, newUserStatCalc, revenueStatCalc } from '@/utils/stat'
import { FullyProduct } from '../product/[slug]/route'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  console.log('- Get Full Data - ')

  try {
    // connect to database
    await connectDatabase()

    // get all products to show in home page
    const products: FullyProduct[] = await ProductModel.find({ active: true })
      .populate('tags')
      .populate('category')
      .lean()

    // Category Sold Rank
    const categorySoldMap: { [key: string]: ICategory & { sold: number } } = {}
    products.forEach(product => {
      const { category, sold }: { category: ICategory; sold: number } = product
      if (!categorySoldMap[category.slug]) {
        categorySoldMap[category.slug] = { ...category, sold: 0 }
      }
      categorySoldMap[category.slug].sold = (categorySoldMap[category.slug].sold || 0) + sold
    })
    const sortedCategoriesArray = Object.entries(categorySoldMap)
      .map(([_, category]) => category)
      .sort((a, b) => b.sold - a.sold)

    // Tag Sold Rank
    const tagSoldMap: { [key: string]: ITag & { sold: number } } = {}
    products.forEach(product => {
      product.tags.forEach((tag: ITag) => {
        if (!tagSoldMap[tag.slug]) {
          tagSoldMap[tag.slug] = { ...tag, sold: 0 }
        }
        tagSoldMap[tag.slug].sold += product.sold || 0
      })
    })
    const sortedTagsArray = Object.values(tagSoldMap).sort((a, b) => b.sold - a.sold)

    // User Spending Rank
    const users: IUser[] = await UserModel.find().lean()
    const getTotalAmountForUser = async (user: IUser) => {
      const orders = await OrderModel.find({ userId: user._id, status: 'done' })
      return orders.reduce((acc, order) => acc + order.total, 0)
    }
    const userTotalAmountPromises = users.map(user => getTotalAmountForUser(user))
    const userTotalAmounts = await Promise.all(userTotalAmountPromises)
    const sortedUsers = users.map((user, index) => ({
      ...user,
      totalSpent: userTotalAmounts[index],
    }))
    sortedUsers.sort((a, b) => b.totalSpent - a.totalSpent)

    // Lấy tất cả đơn hàng đã hoàn thành  (status: done)
    const orders = await OrderModel.find({ status: 'done' }).sort({ createdAt: -1 }).lean()

    const revenueStat = revenueStatCalc(orders)
    const newOrderStat = newOrderStatCalc(orders)
    const newAccountSoldStat = newAccountSoldStatCalc(orders)
    const newUserStat = newUserStatCalc(users)
    const newUsedVoucherStat = newUsedVoucherStatCalc(orders)

    console.log('Revenue: ', revenueStat)
    console.log('New Orders: ', newOrderStat)
    console.log('Sale Accounts: ', newAccountSoldStat)
    console.log('New Users: ', newUserStat)
    console.log('New Used Vouchers: ', newUsedVoucherStat)

    return NextResponse.json(
      {
        revenueStat,
        newOrderStat,
        newAccountSoldStat,
        newUserStat,
        newUsedVoucherStat,
        categories: sortedCategoriesArray,
        tags: sortedTagsArray,
        spentUsers: sortedUsers,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
