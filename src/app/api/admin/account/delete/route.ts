import { connectDatabase } from '@/config/databse'
import AccountModel, { IAccount } from '@/models/AccountModel'
import ProductModel from '@/models/ProductModel'
import { NextRequest, NextResponse } from 'next/server'

// [DELETE]: /admin/account/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Accounts - ')

  // connect to database
  connectDatabase()

  // get account ids to delete
  const { ids } = await req.json()

  try {
    // Find accounts by their IDs before deletion
    const accounts: IAccount[] = await AccountModel.find({
      _id: { $in: ids },
    }).lean()

    // delete account by ids
    await AccountModel.deleteMany({
      _id: { $in: ids },
    })

    // decrease stock of relative products
    await Promise.all(
      accounts.map(async account => {
        await ProductModel.updateOne(
          { _id: account.type },
          {
            $inc: {
              stock: -1,
            },
          }
        )
      })
    )

    console.log('deleted', accounts)

    // return response
    return NextResponse.json(
      {
        deletedAccounts: accounts,
        message: `${accounts.length} account${accounts.length > 1 ? 's' : ''} ${
          accounts.length > 1 ? 'have' : 'has'
        } been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
