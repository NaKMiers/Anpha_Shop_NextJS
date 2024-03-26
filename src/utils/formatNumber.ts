export const formatPrice = (price: number) =>
  Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

export const countPercent = (price: number, oldPrice: number) =>
  Math.ceil(((oldPrice - price) / oldPrice) * 100) + '%'

export const calcPercentage = (percentageString: string, number: number) => {
  const percentage = Number(percentageString.replace('%', ''))
  const result = (percentage / 100) * number
  return result
}
