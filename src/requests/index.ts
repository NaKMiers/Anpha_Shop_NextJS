import { EditingValues } from '@/app/(admin)/admin/category/all/page'
import { FullyCartItem } from '@/app/api/cart/route'

// Auth -------------------------------------
export const registerApi = async (data: any) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const forgotPasswordApi = async (data: any) => {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const resetPassword = async (email: string, token: string, newPassword: string) => {
  const res = await fetch(`/api/auth/reset-password?email=${email}&token=${token}`, {
    method: 'PATCH',
    body: JSON.stringify({ newPassword }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// Page
export const getHomeApi = async () => {
  const res = await fetch(`${process.env.APP_URL}/api`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getProductPageApi = async (slug: string) => {
  const res = await fetch(`${process.env.APP_URL}/api/product/${slug}`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getTagsPageApi = async (searchParams: { [key: string]: string[] } | undefined) => {
  let url = `${process.env.APP_URL}/api/tag?`
  for (let key in searchParams) {
    // check if key is an array
    if (Array.isArray(searchParams[key])) {
      for (let value of searchParams[key]) {
        url += `${key}=${value}&`
      }
    } else {
      url += `${key}=${searchParams[key]}&`
    }
  }

  // remove final '&'
  url = url.slice(0, -1)

  const res = await fetch(url)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getCategoriesPageApi = async (searchParams: { [key: string]: string[] } | undefined) => {
  let url = `${process.env.APP_URL}/api/category?`
  for (let key in searchParams) {
    // check if key is an array
    if (Array.isArray(searchParams[key])) {
      for (let value of searchParams[key]) {
        url += `${key}=${value}&`
      }
    } else {
      url += `${key}=${searchParams[key]}&`
    }
  }

  // remove final '&'
  url = url.slice(0, -1)

  const res = await fetch(url)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getFlashSalePageApi = async () => {
  const res = await fetch(`${process.env.APP_URL}/api/flash-sale`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// Product -------------------------------------
export const getAllProductsApi = async () => {
  const res = await fetch('/api/admin/product/all')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getProductApi = async (id: string) => {
  const res = await fetch(`/api/admin/product/${id}`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getBestSellerProductsApi = async () => {
  const res = await fetch('/api/product/best-seller')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const addProductApi = async (data: FormData) => {
  const res = await fetch('/api/admin/product/add', {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const activateProductsApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/product/activate', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateProductPropertyApi = async (id: string, field: string, value: any) => {
  const res = await fetch(`/api/admin/product/${id}/edit-property/${field}`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateProductApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/product/${id}/edit`, {
    method: 'PUT',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteProductsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/product/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// Category -------------------------------------
export const getAllCagetoriesApi = async () => {
  const res = await fetch('/api/admin/category/all')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const addCategoryApi = async (data: any) => {
  const res = await fetch('/api/admin/category/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateCategoriesApi = async (editingValues: EditingValues[]) => {
  const res = await fetch('/api/admin/category/edit', {
    method: 'PUT',
    body: JSON.stringify({ editingValues }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteCategoriesApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/category/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// Tag -------------------------------------
export const getAllTagsApi = async () => {
  const res = await fetch('/api/admin/tag/all')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const addTagApi = async (data: any) => {
  const res = await fetch('/api/admin/tag/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const featureTagsApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/tag/feature', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateTagsApi = async (editingValues: EditingValues[]) => {
  const res = await fetch('/api/admin/tag/edit', {
    method: 'PUT',
    body: JSON.stringify({ editingValues }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteTagsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/tag/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// Account -------------------------------------
export const getAllAccountsApi = async () => {
  const res = await fetch('/api/admin/account/all')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getAccountApi = async (id: string) => {
  const res = await fetch(`/api/admin/account/${id}`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const addAccountApi = async (data: any) => {
  const res = await fetch('/api/admin/account/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateAccountApi = async (id: string, data: any) => {
  const res = await fetch(`/api/admin/account/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const activateAccountsApi = async (ids: string[], value: boolean) => {
  const res = await fetch(`/api/admin/account/activate`, {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteAccountsApi = async (ids: string[]) => {
  const res = await fetch(`/api/admin/account/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

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

// User -------------------------------------
export const getAllUsersApi = async () => {
  const res = await fetch('/api/admin/user/all')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getRoleUsersApi = async () => {
  const res = await fetch('/api/admin/user/role-users')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateProfileApi = async (data: any) => {
  const res = await fetch('/api/user/update-profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const changePasswordApi = async (data: any) => {
  const res = await fetch('/api/user/change-password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  const asd = await res.json()
  console.log('asd', asd)

  return asd
}

export const rechargeUserApi = async (id: string, amount: number) => {
  const res = await fetch(`/api/admin/user/${id}/recharge`, {
    method: 'PATCH',
    body: JSON.stringify({ amount }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const setCollaboratorApi = async (userId: string, type: string, value: string) => {
  const res = await fetch(`/api/admin/user/${userId}/set-collaborator`, {
    method: 'PATCH',
    body: JSON.stringify({ type, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const demoteCollaboratorApi = async (userId: string) => {
  const res = await fetch(`/api/admin/user/${userId}/demote-collaborator`, {
    method: 'PATCH',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteUsersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/user/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// Voucher
export const getAllVouchersApi = async () => {
  const res = await fetch('/api/admin/voucher/all')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getVoucherApi = async (code: string) => {
  const res = await fetch(`/api/admin/voucher/${code}`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const addVoucherApi = async (data: any) => {
  const res = await fetch('/api/admin/voucher/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const activateVouchersApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/voucher/activate', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const applyVoucherApi = async (code: string, email: string, subTotal: number) => {
  const res = await fetch(`/api/voucher/${code}/apply`, {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      total: subTotal,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateVoucherApi = async (code: string, data: any) => {
  const res = await fetch(`/api/admin/voucher/${code}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteVouchersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/voucher/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// Flashsale
export const getAllFlashSalesApi = async () => {
  const res = await fetch('/api/admin/flash-sale/all')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getFlashSaleApi = async (id: string) => {
  const res = await fetch(`/api/admin/flash-sale/${id}`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const addFlashSaleApi = async (data: any) => {
  const res = await fetch('/api/admin/flash-sale/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateFlashSaleApi = async (id: string, data: any, appliedProducts: string[]) => {
  const res = await fetch(`/api/admin/flash-sale/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify({
      ...data,
      appliedProducts,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteFlashSalesApi = async (ids: string[], productIds: string[]) => {
  const res = await fetch('/api/admin/flash-sale/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids, productIds }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// Cart
export const getCartApi = async () => {
  const res = await fetch('/api/cart')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const addToCartApi = async (productId: string, quantity: number) => {
  const res = await fetch('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateCartQuantityApi = async (cartItemId: string, quantity: number) => {
  const res = await fetch(`/api/cart/${cartItemId}/set-quantity`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteCartItemApi = async (cartItemId: string) => {
  const res = await fetch(`/api/cart/${cartItemId}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// Comment

// Checkout
export const getOrderCodeApi = async () => {
  const res = await fetch('/api/checkout/get-order-code')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
