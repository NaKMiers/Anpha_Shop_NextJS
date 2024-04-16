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

// get times
export const getTimes = (d = 0, h = 0, m = 0, s = 0) => {
  // convert all to seconds
  const totalSeconds = h * 3600 + m * 60 + s

  // calc days, hours, minutes, seconds
  const days = Math.floor(totalSeconds / (24 * 3600))
  const remainingSeconds = totalSeconds % (24 * 3600)
  const hours = Math.floor(remainingSeconds / 3600)
  const remainingSecondsAfterHours = remainingSeconds % 3600
  const minutes = Math.floor(remainingSecondsAfterHours / 60)
  const seconds = remainingSecondsAfterHours % 60

  return {
    days: days + d,
    hours,
    minutes,
    seconds,
  }
}

// from numbers of (day, hour, minute, second) => expire time
export const calcExpireTime = (d = 0, h = 0, m = 0, s = 0) => {
  // calc days, hours, minutes, seconds
  const { days, hours, minutes, seconds } = getTimes(d, h, m, s)

  // get current time
  const currentTime = new Date()

  // add time to current time
  const expireTime = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate() + days,
    currentTime.getHours() + hours,
    currentTime.getMinutes() + minutes,
    currentTime.getSeconds() + seconds
  )

  return expireTime
}
