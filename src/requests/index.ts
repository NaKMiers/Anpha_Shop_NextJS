import { EditingValues } from '@/app/(admin)/admin/category/all/page'

// Page

// Product
export const getAllProductsApi = async () => {
  const res = await fetch('/api/admin/product/all')
  return await res.json()
}

export const getProductApi = async (id: string) => {
  const res = await fetch(`/api/admin/product/${id}`)
  return await res.json()
}

export const addProductApi = async (data: FormData) => {
  const res = await fetch('/api/admin/product/add', {
    method: 'POST',
    body: data,
  })
  return await res.json()
}

export const activateProductsApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/product/activate', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })
  return await res.json()
}

export const updateProductApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/product/${id}/edit`, {
    method: 'PUT',
    body: data,
  })
  return await res.json()
}

export const deleteProductsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/product/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })
  return await res.json()
}

// Category
export const getAllCagetoriesApi = async () => {
  const res = await fetch('/api/admin/category/all')
  return await res.json()
}

export const addCategoryApi = async (data: any) => {
  const res = await fetch('/api/admin/category/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await res.json()
}

export const updateCategoriesApi = async (editingValues: EditingValues[]) => {
  const res = await fetch('/api/admin/category/edit', {
    method: 'PUT',
    body: JSON.stringify({ editingValues }),
  })
  return await res.json()
}

export const deleteCategoriesApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/category/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })
  return await res.json()
}

// Tag
export const getAllTagsApi = async () => {
  const res = await fetch('/api/admin/tag/all')
  return await res.json()
}

export const addTagApi = async (data: any) => {
  const res = await fetch('/api/admin/tag/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await res.json()
}

export const featureTagsApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/tag/feature', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })
  return await res.json()
}

export const updateTagsApi = async (editingValues: EditingValues[]) => {
  const res = await fetch('/api/admin/tag/edit', {
    method: 'PUT',
    body: JSON.stringify({ editingValues }),
  })
  return await res.json()
}

export const deleteTagsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/tag/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })
  return await res.json()
}

// Account
export const getAllAccountsApi = async () => {
  const res = await fetch('/api/admin/account/all')
  return await res.json()
}

export const getAccountApi = async (id: string) => {
  const res = await fetch(`/api/admin/account/${id}`)
  return await res.json()
}

export const addAccountApi = async (data: any) => {
  const res = await fetch('/api/admin/account/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await res.json()
}

export const updateAccountApi = async (id: string, data: any) => {
  const res = await fetch(`/api/admin/account/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await res.json()
}

export const activateAccountsApi = async (ids: string[], value: boolean) => {
  const res = await fetch(`/api/admin/account/activate`, {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })
  return await res.json()
}

export const deleteAccountsApi = async (ids: string[]) => {
  const res = await fetch(`/api/admin/account/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })
  return await res.json()
}

// Order
export const getAllOrdersApi = async () => {
  const res = await fetch('/api/admin/order/all')
  return await res.json()
}

export const cancelOrdersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/order/cancel', {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  })
  return await res.json()
}

export const deletedOrdersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/order/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })
  return await res.json()
}

// User
export const getAllUsersApi = async () => {
  const res = await fetch('/api/admin/user/all')
  return await res.json()
}

export const getRoleUsersApi = async () => {
  const res = await fetch('/api/admin/user/role-users')
  return await res.json()
}

export const deleteUsersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/user/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })
  return await res.json()
}

// Voucher
export const getAllVouchersApi = async () => {
  const res = await fetch('/api/admin/voucher/all')
  return await res.json()
}

export const getVoucherApi = async (code: string) => {
  const res = await fetch(`/api/admin/voucher/${code}`)
  return await res.json()
}

export const addVoucherApi = async (data: any) => {
  const res = await fetch('/api/admin/voucher/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await res.json()
}

export const activateVouchersApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/voucher/activate', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })
  return await res.json()
}

export const updateVoucherApi = async (code: string, data: any) => {
  const res = await fetch(`/api/admin/voucher/${code}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await res.json()
}

export const deleteVouchersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/voucher/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })
  return await res.json()
}

// Flashsale
export const getAllFlashSalesApi = async () => {
  const res = await fetch('/api/admin/flash-sale/all')
  return await res.json()
}

export const getFlashSaleApi = async (id: string) => {
  const res = await fetch(`/api/admin/flash-sale/${id}`)
  return await res.json()
}

export const addFlashSaleApi = async (data: any) => {
  const res = await fetch('/api/admin/flash-sale/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })
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
  return await res.json()
}

export const deleteFlashSalesApi = async (ids: string[], productIds: string[]) => {
  const res = await fetch('/api/admin/flash-sale/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids, productIds }),
  })
  return await res.json()
}

// Cart

// Comment
