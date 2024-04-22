import AccountModel, { IAccount } from '@/models/AccountModel'
import { notifyExpiredAccount } from '@/utils/sendMail'
import { getTimeRemaining } from '@/utils/time'
import { NextRequest, NextResponse } from 'next/server'

// [GET]: /check-expire
export async function GET(req: NextRequest) {
  console.log('- Check Expire -')

  try {
    // get all accounts if (expire - begin >= 24h)
    const accounts: any[] = await AccountModel.find({
      active: true,
      usingUser: { $exists: true },
      expire: { $gt: new Date() },
    })
      .populate({
        path: 'type',
        select: 'title slug',
      })
      .sort({ begin: 1 })
      .lean()

    // const now = +new Date()
    const notifyAccounts: IAccount[] = [accounts[0]]

    // accounts.forEach(account => {
    //   const begin = +new Date(account.begin!)
    //   const expire = +new Date(account.expire!)
    //   // 1 day account
    //   if (expire - begin <= 24 * 60 * 60 * 1000) {
    //     if (expire - now <= 2 * 60 * 60 * 1000) {
    //       notifyAccounts.push(account)
    //     }
    //   }
    //   // longer than 1 day account
    //   else {
    //     if (expire - now <= 24 * 60 * 60 * 1000) {
    //       notifyAccounts.push(account)
    //     }
    //   }
    // })

    notifyAccounts.forEach((account: any) => {
      // send email to user
      const remainingTime = getTimeRemaining(new Date(account.expire), true) as {
        day: number
        hour: number
        minute: number
      }

      notifyExpiredAccount(account.usingUser!, {
        ...account,
        title: account.type.title,
        remainingTime: `${remainingTime.day ? remainingTime.day + ' ngày' : ''} ${
          remainingTime.hour ? remainingTime.hour + ' giờ' : ''
        }`,
        reBuyLink: `${process.env.NEXT_PUBLIC_APP_URL}/${account.type.slug}`,
      })
    })
    return NextResponse.json(
      { notifyAccounts: [], message: 'You are not allow to visit this page!' },
      { status: 200 }
    )

    // return NextResponse.json({ message: 'You are not allow to visit this page!' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
