// Checkout
export const getOrderCodeApi = async () => {
  const res = await fetch('/api/checkout/get-order-code')

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
