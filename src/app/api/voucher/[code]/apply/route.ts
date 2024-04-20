import { connectDatabase } from '@/config/database'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import { formatPrice } from '@/utils/number'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Voucher, User
import '@/models/VoucherModel'
import '@/models/UserModel'
import { FullyVoucher } from '@/app/api/user/order-history/route'

// [POST]: /voucher/:code/apply
export async function POST(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Apply Voucher -')

  try {
    // connect to database
    await connectDatabase()

    // get userId to check if user used this voucher
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userEmail = token?.email

    // get data to check voucher
    const { email, total } = await req.json()

    // get voucher from database to apply
    const voucher: FullyVoucher | null = await VoucherModel.findOne({ code }).populate('owner').lean()

    // if voucher does not exist
    if (!voucher || !voucher.active) {
      return NextResponse.json({ message: 'Voucher không tồn tại' }, { status: 404 })
    }

    // prevent user use their own voucher
    if (voucher.owner.email === email || voucher.owner.email === userEmail) {
      return NextResponse.json(
        { message: 'Bạn không thể sử dụng voucher của chính mình' },
        { status: 401 }
      )
    }

    // voucher has been used by you
    if (voucher.usedUsers.includes(email || userEmail)) {
      return NextResponse.json(
        { message: 'Bạn đã từng dùng voucher này, hãy nhập voucher khác.' },
        { status: 401 }
      )
    }

    // voucher has expired => * voucher never be expired if expire = null
    if (voucher.expire && new Date() > new Date(voucher.expire)) {
      return NextResponse.json({ message: 'Voucher của bạn đã hết hạn' }, { status: 401 })
    }

    // voucher has over used => * voucher can be used infitite times if timesLeft = null
    if ((voucher.timesLeft || 0) <= 0) {
      return NextResponse.json({ message: 'Voucher của bạn đã hết lượt sử dụng' }, { status: 401 })
    }

    // not enought total to apply
    if (total < voucher.minTotal) {
      return NextResponse.json(
        {
          message: `Chỉ áp dụng với đơn hàng có giá trị tối thiếu ${formatPrice(voucher.minTotal)}`,
        },
        { status: 401 }
      )
    }

    let message = ''
    switch (voucher.type) {
      case 'fixed-reduce': {
        message = `Bạn được ${formatPrice(+voucher.value)} vào tổng giá trị đơn hàng`
        break
      }
      case 'fixed': {
        message = `Đơn hàng của bạn sẽ có giá là ${formatPrice(+voucher.value)}`
        break
      }
      case 'percentage': {
        message = `Bạn được ${voucher.value} vào tổng giá trị đơn hàng, tối đa ${Intl.NumberFormat(
          'vi-VN',
          {
            style: 'currency',
            currency: 'VND',
          }
        ).format(voucher.maxReduce)}`
        break
      }
    }

    return NextResponse.json({ voucher, message }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
