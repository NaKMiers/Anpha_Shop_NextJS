import moment from 'moment'

export const formatTime = (time: string) => {
  // format time using "moment" library consist of day, month, year, hour, minute, second
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}
