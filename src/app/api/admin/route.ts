import { connectDatabase } from '@/config/database'
import { EXTRACT_EMAIL_REGEX } from '@/constants'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import CostModel, { ICost } from '@/models/CostModel'
import OrderModel from '@/models/OrderModel'
import { IProduct } from '@/models/ProductModel'
import TagModel, { ITag } from '@/models/TagModel'
import UserModel from '@/models/UserModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { toUTC } from '@/utils/time'
import { NextRequest, NextResponse } from 'next/server'

// Models: Order, User, Category, Tag, Cost, Cost Group
import '@/models/CategoryModel'
import '@/models/CostGroupModel'
import '@/models/CostModel'
import '@/models/OrderModel'
import '@/models/TagModel'
import '@/models/UserModel'
import { ICostGroup } from '@/models/CostGroupModel'

export const dynamic = 'force-dynamic'

export type BlocksType = {
  revenue: number
  costs: number
  orders: number
  accounts: number
  customers: number
  users: number
  nonUsers: number
  potentialUsers: number
  vouchers: number
  voucherDiscount: number
}

export type ChartOrderType = {
  total: number
  createdAt: string
  quantity: number
  categories: ICategory[]
  tags: ITag[]
  products: (IProduct & { color: string })[]
  accounts: string[]
  isVoucher: boolean
}

export type ChartCostType = {
  amount: number
  date: string
  costGroup: ICostGroup
}

// [GET]: /admin
export async function GET(req: NextRequest) {
  console.log('- Get Dashboard - ')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    // let skip = 0
    // let itemPerPage = 9
    const filter: { [key: string]: any } = { status: 'done' }
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        if (key === 'from-to') {
          const dates = params[key][0].split('|')

          if (dates[0] && dates[1]) {
            filter.createdAt = {
              $gte: toUTC(dates[0]),
              $lt: toUTC(dates[1]),
            }
          } else if (dates[0]) {
            filter.createdAt = {
              $gte: toUTC(dates[0]),
            }
          } else if (dates[1]) {
            filter.createdAt = {
              $lt: toUTC(dates[1]),
            }
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get all orders from database
    const orders: any[] = await OrderModel.find(filter).sort(sort).lean()

    // get all costs from database
    const { createdAt, status, ...restFilter } = filter
    const costFilter = { ...restFilter, date: createdAt }
    const costs: ICost[] = await CostModel.find(costFilter).populate('costGroup').sort(sort).lean()

    // MARK: Blocks
    // get list of emails from users in database
    const emails = await UserModel.find({ createdAt: filter.createdAt }).distinct('email').lean()
    const orderEmails = orders.map(order => order.email)
    const uniqueEmails = Array.from(new Set([...emails, ...orderEmails]))
    const potentialEmails = emails.filter(email => !orderEmails.includes(email))

    const blocks: BlocksType = {
      revenue: orders.reduce((total, order) => total + order.total, 0),
      costs: costs.reduce((total, cost) => total + cost.amount, 0),
      orders: orders.length,
      accounts: orders.reduce(
        (total, order) =>
          total + order.items.reduce((total: number, item: any) => total + (+item.quantity || 0), 0),
        0
      ),
      customers: uniqueEmails.length,
      users: emails.length,
      nonUsers: uniqueEmails.length - emails.length,
      potentialUsers: potentialEmails.length,
      vouchers: orders.reduce((total, order) => total + (order.voucherApplied ? 1 : 0), 0),
      voucherDiscount: Math.abs(orders.reduce((total, order) => total + (order.discount || 0), 0)),
    }

    // get all categories and tags to reference in orders
    const categories = await CategoryModel.find().lean()
    const tags = await TagModel.find().lean()

    // MARK: Custom Orders
    const customOrders: ChartOrderType[] = orders.map(order => {
      let cates = order.items.map((item: any) => item.product.category)
      // some cate is ICategory, some is string, so if it is string, find it in categories
      cates = cates.map((cate: any) =>
        typeof cate === 'string'
          ? categories.find((category: any) => category._id.toString() === cate)
          : cate
      )

      let tgs = order.items.map((item: any) => item.product.tags).flat()
      // some tag is ITag, some is string, so if it is string, find it in tags
      tgs = tgs.map((tag: any) =>
        typeof tag === 'string' ? tags.find((tg: any) => tg._id.toString() === tag) : tag
      )

      const prods = order.items.map(({ product }: any) => ({
        _id: product._id,
        title: product.title,
        price: product.price,
        slug: product.slug,
        images: product.images,
        color:
          typeof product.category === 'string'
            ? categories.find((cate: any) => cate._id.toString() === product.category)?.color
            : product.category.color,
      }))

      const acts = order.items
        .map((item: any) =>
          item.accounts.map((account: any) => account.info.match(EXTRACT_EMAIL_REGEX)).flat()
        )
        .flat()

      return {
        total: order.total,
        createdAt: order.createdAt,
        quantity: order.items.reduce((total: number, item: any) => total + (+item.quantity || 0), 0),
        categories: cates,
        tags: tgs,
        products: prods,
        accounts: acts,
        isVoucher: !!order.voucherApplied,
      }
    })

    // MARK: Custom Costs
    const customCosts: ChartCostType[] = costs.map(cost => ({
      amount: cost.amount,
      date: cost.date,
      costGroup: cost.costGroup,
    }))

    // return response
    return NextResponse.json({ orders: customOrders, costs: customCosts, blocks }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
