import { connectDatabase } from '@/config/databse'
import AccountModel from '@/models/AccountModel'
import ProductModel from '@/models/ProductModel'
import { getTimes } from '@/utils'
import { connection } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /admin/account/add
export async function POST(req: NextRequest) {
  console.log('- Add Account - ')

  // connect to database
  await connectDatabase()

  // get data to add account
  const asd = await req.json()
  const { type, info, renew, active, days, hours, minutes, seconds } = asd
  const times = getTimes(+days, +hours, +minutes, +seconds)

  console.log('asd', asd)
  console.log('times-----', times)

  try {
    // create new account
    const newAccount = new AccountModel({
      type,
      info,
      renew: new Date(renew),
      times,
      active,
    })

    // save new account to database
    await newAccount.save()

    // increase product stock after add account
    await ProductModel.findByIdAndUpdate(type, {
      $inc: { stock: 1 },
    })

    // return response
    return NextResponse.json({ message: 'Add account successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  } finally {
    // close connection
    connection.close()
  }
}
