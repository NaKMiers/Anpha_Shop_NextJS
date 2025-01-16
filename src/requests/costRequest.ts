// Cost -------------------------------------

// [GET]
export const getAllCostsApi = async (query: string = '') => {
  // no cache
  const res = await fetch(`/api/admin/cost/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addCostApi = async (data: FormData) => {
  const res = await fetch('/api/admin/cost/add', {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateCostApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/cost/${id}/edit`, {
    method: 'PUT',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteCostsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/cost/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
