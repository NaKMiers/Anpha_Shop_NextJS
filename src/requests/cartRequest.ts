// Cart
export const getCartApi = async () => {
  const res = await fetch('/api/cart')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const addToCartApi = async (productId: string, quantity: number) => {
  const res = await fetch('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateCartQuantityApi = async (cartItemId: string, quantity: number) => {
  const res = await fetch(`/api/cart/${cartItemId}/set-quantity`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteCartItemApi = async (cartItemId: string) => {
  const res = await fetch(`/api/cart/${cartItemId}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
