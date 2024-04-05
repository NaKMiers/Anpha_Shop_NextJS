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
