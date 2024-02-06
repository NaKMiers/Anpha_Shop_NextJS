export const formatPrice = (price: number) =>
  Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
