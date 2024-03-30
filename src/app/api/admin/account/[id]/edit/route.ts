import { connectDatabase } from '@/config/databse'
import VoucherModel from '@/models/VoucherModel'
import { NextRequest, NextResponse } from 'next/server'
import '@/models/UserModel'
import { notifyAccountUpdated } from '@/utils/sendMail'
import OrderModel, { IOrder } from '@/models/OrderModel'
import { getTimes } from '@/utils'
import AccountModel, { IAccount } from '@/models/AccountModel'
import mongoose from 'mongoose'

// Connect to database
connectDatabase()

// [GET]: /account/:id/edit
export async function POST(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Account -')

  // get data to edit account
  const { type, info, renew, active, days, hours, minutes, seconds, notify } = await req.json()
  const times = getTimes(+days, +hours, +minutes, +seconds)

  try {
    // update account
    const updatedAccount: IAccount | null = await AccountModel.findByIdAndUpdate(
      id,
      {
        $set: {
          type,
          info,
          renew,
          times,
          active: active === 'on',
        },
      },
      { new: true }
    )

    // notify to user about the change of account infomation
    if (notify && updatedAccount && new Date(updatedAccount.expire || '') > new Date()) {
      // get order from database to update account
      const order: IOrder | null = await OrderModel.findOne({
        'items.accounts._id': new mongoose.Types.ObjectId(id),
      }).lean()

      // order exists
      if (order) {
        // get account infomation
        let accountInfo: any = null
        let itemIndex: any = undefined
        let accountIndex: any = undefined

        // use for loop to allow breaking when account is found
        for (let i = 0; i < order.items.length; i++) {
          const item = order.items[i]
          for (let accIdx = 0; accIdx < item.accounts.length; accIdx++) {
            const acc = item.accounts[accIdx]
            if (acc._id.toString() === id) {
              accountInfo = acc
              itemIndex = i
              accountIndex = accIdx
              break
            }
          }

          // if account info is found, break the outer loop as well
          if (accountInfo) {
            break
          }
        }

        // get product
        let product = order.items.find(
          item => item.product._id.toString() === accountInfo.type.toString()
        ).product

        // update order
        await OrderModel.findByIdAndUpdate(
          order._id,
          {
            $set: {
              [`items.${itemIndex}.accounts.${accountIndex}`]: {
                ...accountInfo,
                type,
                info,
                renew,
                times,
                active: active === 'on',
              },
            },
          },
          { new: true }
        )

        // create data to notify by email
        const data = {
          ...order,
          product,
          oldInfo: accountInfo,
          newInfo: { info },
        }

        notifyAccountUpdated(order.email, data)
      }
    }

    // return updated account
    return NextResponse.json({ updatedAccount, message: 'Account has been updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
