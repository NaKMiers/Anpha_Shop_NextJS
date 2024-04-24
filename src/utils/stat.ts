import moment from 'moment'

// MARK: Revenue
// Hàm tính toán doanh thu dựa trên các điều kiện
const calculateRevenue = (orders: any[], date: Date | string, interval: string) => {
  const startOfInterval = moment(date).startOf(interval as moment.unitOfTime.StartOf)
  const endOfInterval = moment(date).endOf(interval as moment.unitOfTime.StartOf)

  const filteredOrders = orders.filter(order =>
    moment(order.createdAt).isBetween(startOfInterval, endOfInterval, undefined, '[]')
  )

  const revenue = filteredOrders.reduce((total, order) => total + order.total, 0)
  return revenue
}

export const revenueStatCalc = (orders: any) => {
  const currentDate = moment()

  // Tính toán ngày, tháng, năm trước
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // Lọc ra các đơn hàng theo các điều kiện khác nhau và tính tổng giá trị của trường total
  const revenueToday = calculateRevenue(orders, currentDate.toDate(), 'day')
  const revenueYesterday = calculateRevenue(orders, lastDay.toDate(), 'day')
  const revenueThisMonth = calculateRevenue(orders, currentDate.toDate(), 'month')
  const revenueLastMonth = calculateRevenue(orders, lastMonth.toDate(), 'month')
  const revenueThisYear = calculateRevenue(orders, currentDate.toDate(), 'year')
  const revenueLastYear = calculateRevenue(orders, lastYear.toDate(), 'year')

  const revenueStat = {
    day: [
      revenueToday,
      revenueYesterday,
      (((revenueToday - revenueYesterday) / revenueYesterday) * 100).toFixed(2),
    ],
    month: [
      revenueThisMonth,
      revenueLastMonth,
      (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(2),
    ],
    year: [
      revenueThisYear,
      revenueLastYear,
      (((revenueThisYear - revenueLastYear) / revenueLastYear) * 100).toFixed(2),
    ],
  }

  return revenueStat
}

// MARK: New Order
// Tính số lượng đơn hàng mới dựa trên các điều kiện thời gian
const calculateNewOrders = (orders: any[], startDate: Date | string, endDate: Date | string) => {
  const filteredOrders = orders.filter(order =>
    moment(order.createdAt).isBetween(startDate, endDate, undefined, '[]')
  )

  return filteredOrders.length
}

export const newOrderStatCalc = (orders: any[]) => {
  // Lấy ngày, tháng, năm hiện tại
  const currentDate = moment()
  console.log('currentDate: ', currentDate)

  // Tính toán ngày, tháng, năm trước
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // Tính số lượng đơn hàng mới cho các khoảng thời gian
  const newOrdersToday = calculateNewOrders(
    orders,
    currentDate.startOf('day').toDate(),
    currentDate.endOf('day').toDate()
  )
  const newOrdersYesterday = calculateNewOrders(
    orders,
    lastDay.startOf('day').toDate(),
    lastDay.endOf('day').toDate()
  )
  const newOrdersThisMonth = calculateNewOrders(
    orders,
    currentDate.startOf('month').toDate(),
    currentDate.endOf('month').toDate()
  )
  const newOrdersLastMonth = calculateNewOrders(
    orders,
    lastMonth.startOf('month').toDate(),
    lastMonth.endOf('month').toDate()
  )
  const newOrdersThisYear = calculateNewOrders(
    orders,
    currentDate.startOf('year').toDate(),
    currentDate.endOf('year').toDate()
  )
  const newOrdersLastYear = calculateNewOrders(
    orders,
    lastYear.startOf('year').toDate(),
    lastYear.endOf('year').toDate()
  )
  const newOrderStat = {
    day: [
      newOrdersToday,
      newOrdersYesterday,
      (((newOrdersToday - newOrdersYesterday) / newOrdersYesterday) * 100).toFixed(2),
    ],
    month: [
      newOrdersThisMonth,
      newOrdersLastMonth,
      (((newOrdersThisMonth - newOrdersLastMonth) / newOrdersLastMonth) * 100).toFixed(2),
    ],
    year: [
      newOrdersThisYear,
      newOrdersLastYear,
      (((newOrdersThisYear - newOrdersLastYear) / newOrdersLastYear) * 100).toFixed(2),
    ],
  }

  return newOrderStat
}

// MARK: New User
// Tính số lượng người dùng mới dựa trên các điều kiện thời gian
const calculateNewUsers = (users: any[], startDate: Date | string, endDate: Date | string) => {
  const filteredUsers = users.filter(user =>
    moment(user.createdAt).isBetween(startDate, endDate, undefined, '[]')
  )

  return filteredUsers.length
}

export const newUserStatCalc = (users: any[]) => {
  // Lấy ngày, tháng, năm hiện tại
  const currentDate = moment()
  console.log('currentDate: ', currentDate)

  // Tính toán ngày, tháng, năm trước
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // Tính số lượng người dùng mới cho các khoảng thời gian
  const newUsersToday = calculateNewUsers(
    users,
    currentDate.startOf('day').toDate(),
    currentDate.endOf('day').toDate()
  )
  const newUsersYesterday = calculateNewUsers(
    users,
    lastDay.startOf('day').toDate(),
    lastDay.endOf('day').toDate()
  )
  console.log('Month User')
  const newUsersThisMonth = calculateNewUsers(
    users,
    currentDate.startOf('month').toDate(),
    currentDate.endOf('month').toDate()
  )
  console.log(currentDate)
  console.log(currentDate.startOf('month').toDate())
  console.log(currentDate.endOf('month').toDate())
  const newUsersLastMonth = calculateNewUsers(
    users,
    lastMonth.startOf('month').toDate(),
    lastMonth.endOf('month').toDate()
  )
  const newUsersThisYear = calculateNewUsers(
    users,
    currentDate.startOf('year').toDate(),
    currentDate.endOf('year').toDate()
  )
  const newUsersLastYear = calculateNewUsers(
    users,
    lastYear.startOf('year').toDate(),
    lastYear.endOf('year').toDate()
  )
  const newUserStat = {
    day: [
      newUsersToday,
      newUsersYesterday,
      (((newUsersToday - newUsersYesterday) / newUsersYesterday) * 100).toFixed(2),
    ],
    month: [
      newUsersThisMonth,
      newUsersLastMonth,
      (((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100).toFixed(2),
    ],
    year: [
      newUsersThisYear,
      newUsersLastYear,
      (((newUsersThisYear - newUsersLastYear) / newUsersLastYear) * 100).toFixed(2),
    ],
  }

  return newUserStat
}

// MARK: New Account Sold
// Tính số lượng tài khoản mới đã bán dựa trên các điều kiện thời gian
const calculateNewAccountsSold = (orders: any[], startDate: Date | string, endDate: Date | string) => {
  let newAccounts = 0
  orders.forEach(order => {
    if (moment(order.createdAt).isBetween(startDate, endDate, undefined, '[]')) {
      order.items.forEach((item: any) => {
        newAccounts += item.accounts.length
      })
    }
  })
  return newAccounts
}

export const newAccountSoldStatCalc = (orders: any[]) => {
  // Lấy ngày, tháng, năm hiện tại
  const currentDate = moment()
  console.log('currentDate: ', currentDate)

  // Tính toán ngày, tháng, năm trước
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // Tính số lượng tài khoản mới đã bán cho các khoảng thời gian
  const newAccountsSoldToday = calculateNewAccountsSold(
    orders,
    currentDate.startOf('day').toDate(),
    currentDate.endOf('day').toDate()
  )
  const newAccountsSoldYesterday = calculateNewAccountsSold(
    orders,
    lastDay.startOf('day').toDate(),
    lastDay.endOf('day').toDate()
  )
  const newAccountsSoldThisMonth = calculateNewAccountsSold(
    orders,
    currentDate.startOf('month').toDate(),
    currentDate.endOf('month').toDate()
  )
  const newAccountsSoldLastMonth = calculateNewAccountsSold(
    orders,
    lastMonth.startOf('month').toDate(),
    lastMonth.endOf('month').toDate()
  )
  const newAccountsSoldThisYear = calculateNewAccountsSold(
    orders,
    currentDate.startOf('year').toDate(),
    currentDate.endOf('year').toDate()
  )
  const newAccountsSoldLastYear = calculateNewAccountsSold(
    orders,
    lastYear.startOf('year').toDate(),
    lastYear.endOf('year').toDate()
  )

  const newAccountSoldStat = {
    day: [
      newAccountsSoldToday,
      newAccountsSoldYesterday,
      (((newAccountsSoldToday - newAccountsSoldYesterday) / newAccountsSoldYesterday) * 100).toFixed(2),
    ],
    month: [
      newAccountsSoldThisMonth,
      newAccountsSoldLastMonth,
      (((newAccountsSoldThisMonth - newAccountsSoldLastMonth) / newAccountsSoldLastMonth) * 100).toFixed(
        2
      ),
    ],
    year: [
      newAccountsSoldThisYear,
      newAccountsSoldLastYear,
      (((newAccountsSoldThisYear - newAccountsSoldLastYear) / newAccountsSoldLastYear) * 100).toFixed(2),
    ],
  }

  return newAccountSoldStat
}

// MARK: Used Voucher
// Tính số lượng voucher được sử dụng dựa trên các điều kiện thời gian
const calculateUsedVouchers = (orders: any[], startDate: Date | string, endDate: Date | string) => {
  let usedVouchers = 0
  orders.forEach(order => {
    if (moment(order.createdAt).isBetween(startDate, endDate, undefined, '[]')) {
      if (order.discount && order.discount !== 0) {
        usedVouchers++
      }
    }
  })
  return usedVouchers
}

export const newUsedVoucherStatCalc = (orders: any[]) => {
  // Lấy ngày, tháng, năm hiện tại
  const currentDate = moment()
  console.log('currentDate: ', currentDate)

  // Tính toán ngày, tháng, năm trước
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // Tính số lượng voucher được sử dụng cho các khoảng thời gian
  const usedVouchersToday = calculateUsedVouchers(
    orders,
    currentDate.startOf('day').toDate(),
    currentDate.endOf('day').toDate()
  )
  const usedVouchersYesterday = calculateUsedVouchers(
    orders,
    lastDay.startOf('day').toDate(),
    lastDay.endOf('day').toDate()
  )
  const usedVouchersThisMonth = calculateUsedVouchers(
    orders,
    currentDate.startOf('month').toDate(),
    currentDate.endOf('month').toDate()
  )
  const usedVouchersLastMonth = calculateUsedVouchers(
    orders,
    lastMonth.startOf('month').toDate(),
    lastMonth.endOf('month').toDate()
  )
  const usedVouchersThisYear = calculateUsedVouchers(
    orders,
    currentDate.startOf('year').toDate(),
    currentDate.endOf('year').toDate()
  )
  const usedVouchersLastYear = calculateUsedVouchers(
    orders,
    lastYear.startOf('year').toDate(),
    lastYear.endOf('year').toDate()
  )

  const newUsedVoucherStat = {
    day: [
      usedVouchersToday,
      usedVouchersYesterday,
      (((usedVouchersToday - usedVouchersYesterday) / usedVouchersYesterday) * 100).toFixed(2),
    ],
    month: [
      usedVouchersThisMonth,
      usedVouchersLastMonth,
      (((usedVouchersThisMonth - usedVouchersLastMonth) / usedVouchersLastMonth) * 100).toFixed(2),
    ],
    year: [
      usedVouchersThisYear,
      usedVouchersLastYear,
      (((usedVouchersThisYear - usedVouchersLastYear) / usedVouchersLastYear) * 100).toFixed(2),
    ],
  }

  return newUsedVoucherStat
}
