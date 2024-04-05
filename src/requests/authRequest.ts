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
