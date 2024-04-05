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
