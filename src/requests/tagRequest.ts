import { EditingValues } from '@/app/(admin)/admin/tag/all/page'

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
