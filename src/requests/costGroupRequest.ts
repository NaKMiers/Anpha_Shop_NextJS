// Cost Group -------------------------------------

// [GET]
export const getAllCostGroupsApi = async (query: string = '') => {
  // no cache
  const res = await fetch(`/api/admin/cost-group/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addCostGroupApi = async (data: FormData) => {
  const res = await fetch('/api/admin/cost-group/add', {
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
export const updateCostGroupApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/cost-group/${id}/edit`, {
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
export const deleteCostGroupsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/cost-group/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
