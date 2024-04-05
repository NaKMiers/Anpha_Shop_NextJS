import { EditingValues } from '@/app/(admin)/admin/category/all/page'

// Category -------------------------------------

// [GET]
export const getAllCagetoriesApi = async () => {
  // no cache
  const res = await fetch('/api/admin/category/all', { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
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

// [PUT]
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

// [DELETE]
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
