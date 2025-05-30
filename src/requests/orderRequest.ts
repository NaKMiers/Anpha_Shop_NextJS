// Order -------------------------------------

import { ICartItem } from '@/models/CartItemModel'

// [GET]
export const getAllOrdersApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/order/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getOrderHistoryApi = async (query: string) => {
  // no-store to bypass cache
  const res = await fetch(`/api/user/order-history${query}`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getOrderApi = async (code: string) => {
  // no-store to bypass cache
  const res = await fetch(`/api/order/${code}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /order/check/:id
export const checkOrderApi = async (id: string) => {
  // no-store to bypass cache
  const res = await fetch(`/api/order/check/${id}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const generateOrderCodeApi = async () => {
  // no cache
  const res = await fetch('/api/order/generate-order-code', {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const createOrderApi = async (
  // code: string,
  email: string,
  total: number,
  voucherApplied: string | undefined,
  discount: number | undefined,
  items: ICartItem[],
  paymentMethod: string
) => {
  const res = await fetch('/api/order/create', {
    method: 'POST',
    body: JSON.stringify({
      // code,
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

// [PUT]
export const editOrderApi = async (orderId: string, data: any) => {
  const res = await fetch(`/api/admin/order/${orderId}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const deliverOrderApi = async (orderId: string, message: string = '') => {
  const res = await fetch(`/api/admin/order/${orderId}/deliver`, {
    method: 'PATCH',
    body: JSON.stringify({ message }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const reDeliverOrder = async (orderId: string, message: string = '') => {
  const res = await fetch(`/api/admin/order/${orderId}/re-deliver`, {
    method: 'PATCH',
    body: JSON.stringify({ message }),
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
