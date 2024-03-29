import { connectDatabase } from '@/config/databse'
import CartItemModel from '@/models/CartItemModel'
import OrderModel, { IOrder } from '@/models/OrderModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { FullyCartItem } from '../../cart/route'
import { notifyDeliveryOrder, notifyNewOrderToAdmin, notifyShortageAccount } from '@/utils/sendMail'
import AccountModel, { IAccount } from '@/models/AccountModel'
import { calcExpireTime } from '@/utils'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import UserModel, { IUser } from '@/models/UserModel'
import ProductModel from '@/models/ProductModel'

// Connect to database
connectDatabase()

async function handleDeliverOrder(id: string) {
  console.log('handleDeliverOrder')

  // get order from database to deliver
  const order: IOrder | null = await OrderModel.findById(id).lean()

  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 })
  }

  // get items and applied voucher
  const { items, voucherApplied, email, paymentMethod, total } = order

  let orderError = {
    error: false,
    message: '',
  }

  // ACCOUNT
  const getAccounts = async (productId: string, quantity: number) => {
    const currentDate = new Date()

    return await AccountModel.find({
      type: productId, // corresponding product
      renew: { $gte: currentDate }, // still in time of use
      $and: [
        {
          $or: [
            { active: true }, // active: true
            { active: null }, // active: true
            { active: { $exists: false } }, // active does not exist
          ],
        },
        {
          $or: [
            { usingUser: null }, // using user does not exist
            { usingUser: { $exists: false } }, // using user does not exist
          ],
        },
        {
          $or: [
            { expire: { $lt: currentDate } }, // expired
            { expire: { $exists: false } }, // expire does not exist
            { expire: null }, // expire does not exist
          ],
        },
      ],
    })
      .limit(quantity)
      .lean()
  }

  // get accountsList
  const handleItemsToAccounts = async () => {
    const results = []

    for (const { product, quantity } of items) {
      const accounts = await getAccounts(product._id, +quantity)

      if (accounts.length !== +quantity) {
        orderError = {
          error: true,
          message: `Thiếu sản phẩm: ${product.title}`,
        }
        break
      } else {
        results.push({
          productId: product._id,
          quantity,
          accounts,
        })
      }
    }

    return results
  }
  const accountDataList = await handleItemsToAccounts()

  if (orderError.error) {
    notifyShortageAccount(orderError.message)

    return { order, isError: orderError.error }
  }

  // prepare a list of step to update accounts
  let accounts: any[] = accountDataList.map(accData => accData.accounts)
  accounts = accounts.reduce((result, item) => result.concat(item), [])
  const bulkOpsAccounts = accounts.map(account => {
    const { days, hours, minutes, seconds } = account.times

    return {
      updateOne: {
        filter: { _id: account._id },
        update: {
          $set: {
            begin: new Date(),
            expire: calcExpireTime(days, hours, minutes, seconds),
            usingUser: email,
          },
        },
      },
    }
  })

  // PRODUCT
  // prepared a list of steps to update product
  const bulkOpsProducts = accountDataList.map(accData => {
    const { productId, quantity } = accData

    return {
      updateOne: {
        filter: { _id: productId },
        update: {
          $inc: {
            sold: +quantity,
            stock: -1 * +quantity,
          },
        },
      },
    }
  })

  // VOUCHER
  // get voucher form database
  let voucherDescription
  if (voucherApplied) {
    const voucher: IVoucher | null = await VoucherModel.findOne({
      code: voucherApplied,
    }).lean()
    voucherDescription = voucher && voucher.desc

    // update voucher
    if (voucher) {
      // get voucher owner to get commission
      const voucherOwner: IUser | null = await UserModel.findById(voucher.owner).lean()
      if (!voucherOwner) {
        return NextResponse.json({ message: 'Voucher owner not found' }, { status: 404 })
      }

      const commission: any = voucherOwner.commission
      let extraAccumulated = 0

      switch (commission.type) {
        case 'fixed': {
          extraAccumulated = commission.value
          break
        }
        case 'percentage': {
          extraAccumulated = (order.total * parseFloat(commission.value)) / 100
          break
        }
      }

      await VoucherModel.findByIdAndUpdate(voucher._id, {
        $addToSet: { usedUsers: email },
        $inc: {
          accumulated: extraAccumulated,
          timesLeft: -1,
        },
      })
    }
  }

  // USER
  // check balance payment method
  if (paymentMethod === 'balance') {
    await UserModel.findByIdAndUpdate(order.userId, {
      $inc: { balance: -1 * total },
    })
  }

  // data transfering to email
  const orderData = {
    ...order,
    accounts: accountDataList,
    discount: voucherDescription,
  }

  // EMAIL
  // update order items with accounts
  const updatedItems = items.map(item => {
    let accounts = accountDataList.find(acc => acc.productId.toString() === item.product._id.toString())
    if (!accounts) {
      return item
    }
    return { ...item, accounts: accounts.accounts }
  })

  // do all the list of step preparation for accounts
  await AccountModel.bulkWrite(bulkOpsAccounts)
  // do all the list of step preparation for products
  await ProductModel.bulkWrite(bulkOpsProducts)
  // set order status
  await OrderModel.findByIdAndUpdate(order._id, {
    $set: { status: 'done' },
  })
  await OrderModel.findByIdAndUpdate(order._id, {
    $set: { items: updatedItems },
  })

  return { order, isError: orderError.error }
}

// [POST]: /order/create
export async function POST(req: NextRequest) {
  console.log('- Create Order -')

  // get data to create order
  const { code, email, total, voucherApplied, items, paymentMethod } = await req.json()

  // get user id
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  const userId = token?._id

  try {
    // create new order
    const newOrder = new OrderModel({
      code,
      userId,
      email,
      total,
      voucherApplied,
      items,
      paymentMethod,
    })

    // save new order
    await newOrder.save()

    // notify new order to admin
    notifyNewOrderToAdmin(newOrder)

    // auto deliver order
    if (process.env.IS_AUTO_DELIVER === 'YES') {
      const response: any = await handleDeliverOrder(newOrder._id)

      if (response.isError) {
        console.log('AUTO DELIVERED FAILURE!!!')

        return NextResponse.json({ message: 'Auto Deliver Failure' }, { status: 500 })
      } else {
        console.log('Auto Deliver For Balance Payment Method Successfully')
      }
    }

    // if user logined => cart is database cart => Delete cart items
    if (userId) {
      // delete cart items from database
      const cartItemIds = items.map((item: FullyCartItem) => item._id)
      await CartItemModel.deleteMany({
        _id: { $in: cartItemIds },
      })
    }

    // return new order
    return NextResponse.json({ order: newOrder }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
