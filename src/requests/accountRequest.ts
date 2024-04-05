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
