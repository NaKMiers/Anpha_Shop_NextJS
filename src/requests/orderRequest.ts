import { FullyCartItem } from '@/app/api/cart/route'

// Order -------------------------------------
export const getAllOrdersApi = async () => {
  const res = await fetch('/api/admin/order/all')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

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
