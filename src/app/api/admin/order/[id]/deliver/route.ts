import { connectDatabase } from '@/config/databse'
import handleDeliverOrder from '@/utils/handleDeliverOrder'
import { NextRequest, NextResponse } from 'next/server'

// [PATCH]: /admin/order/:id/deliver
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Deliver Order -')

  // connect to database
  await connectDatabase()

  try {
    // handle deliver order
    const response: any = await handleDeliverOrder(id)
    console.log('response:', response)

    if (response.isError) {
      return NextResponse.json({ message: response.message }, { status: 500 })
    }

    // notify delivery order
    return NextResponse.json({ message: 'Deliver Order Successfully!' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
