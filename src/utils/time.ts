import moment from 'moment'

export const formatTime = (time: string): string => {
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}

export const formatDate = (time: string): string => {
  // format time using "moment" library consist of day, month, year
  return time && moment(time).format('DD/MM/YYYY')
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const isToday = (date: Date): boolean => {
  return isSameDate(date, new Date())
}

export const getTimeRemaining = (expireDate: Date | string): string => {
  const now = moment()
  const expirationDate = moment(expireDate)

  const diffInDays = expirationDate.diff(now, 'days')
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`
  }

  const diffInHours = expirationDate.diff(now, 'hours')
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`
  }

  const diffInMinutes = expirationDate.diff(now, 'minutes')
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
  }

  return ''
}
