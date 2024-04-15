import { FullyOrder } from '@/app/api/user/order-history/route'
import AccountModel from '@/models/AccountModel'
import OrderModel from '@/models/OrderModel'
import ProductModel from '@/models/ProductModel'
import UserModel from '@/models/UserModel'
import VoucherModel from '@/models/VoucherModel'
import { notifyDeliveryOrder, notifyShortageAccount } from '@/utils/sendMail'
import { NextResponse } from 'next/server'
import { calcExpireTime } from '.'

export default async function handleDeliverOrder(id: string) {
  // get order from database to deliver
  const order: FullyOrder | null = await OrderModel.findById(id)
    .populate({
      path: 'voucherApplied',
      select: 'code',
      populate: 'owner',
    })
    .lean()

  // check order exist
  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 })
  }

  // only deliver order with status is 'pending' | 'cancel'
  if (order.status === 'done') {
    return NextResponse.json({ message: 'Order is not ready to deliver' }, { status: 400 })
  }

  // get items and applied voucher
  const { items, voucherApplied, email, paymentMethod, total } = order

  // error state
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

  // check if shortage accounts
  if (orderError.error) {
    notifyShortageAccount(orderError.message)

    return { order, isError: orderError.error, message: orderError.message }
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
  const voucher = order.voucherApplied

  if (voucher) {
    const commission: any = voucher.owner.commission
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

    // update voucher
    await VoucherModel.findByIdAndUpdate(voucher._id, {
      $addToSet: { usedUsers: email },
      $inc: {
        accumulated: extraAccumulated,
        timesLeft: -1,
      },
    })

    console.log('voucher updated')
  }

  // USER
  // check balance payment method
  if (paymentMethod === 'balance') {
    await UserModel.findByIdAndUpdate(order.userId, {
      $inc: { balance: -total },
    })
  }

  // data transfering to email
  const orderData = {
    ...order,
    accounts: accountDataList,
    discount: order.discount || 0,
  }

  // EMAIL
  notifyDeliveryOrder(email, orderData)

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
