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
