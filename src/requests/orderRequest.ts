import { FullyCartItem } from '@/app/api/cart/route'

// Order -------------------------------------

// [GET]
export const getAllOrdersApi = async () => {
  // no-store to bypass cache
  const res = await fetch('/api/admin/order/all', { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const generateOrderCodeApi = async () => {
  // no cache
  const res = await fetch('/api/order/generate-order-code', { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const createOrderApi = async (
  code: string,
  email: string,
  total: number,
  voucherApplied: string,
  discount: number,
  items: FullyCartItem[],
  paymentMethod: string
) => {
  const res = await fetch('/api/order/create', {
    method: 'POST',
    body: JSON.stringify({
      code,
      email,
      total,
      voucherApplied,
      discount,
      items,
      paymentMethod,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const deliverOrderApi = async (orderId: string) => {
  const res = await fetch(`/api/admin/order/${orderId}/deliver`, {
    method: 'PATCH',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const reDeliverOrder = async (orderId: string) => {
  const res = await fetch(`/api/admin/order/${orderId}/re-deliver`, {
    method: 'PATCH',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const cancelOrdersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/order/cancel', {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deletedOrdersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/order/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const caclIncomeApi = async (time: Date, timeType: string) => {
  const res = await fetch('/api/admin/order/calc-income', {
    method: 'POST',
    body: JSON.stringify({ time, timeType }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
