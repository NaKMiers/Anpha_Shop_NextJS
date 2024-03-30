import { connectDatabase } from '@/config/databse'
import AccountModel from '@/models/AccountModel'
import { NextRequest, NextResponse } from 'next/server'
import '@/models/UserModel'

// Connect to database
connectDatabase()

// [GET]: /account/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get Account -')

  console.log('id:', id)

  try {
    // get account from database
    const account = await AccountModel.findById(id).lean()
    // check account
    if (!account) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 })
    }
    // return account
    return NextResponse.json({ account, message: 'Account found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
